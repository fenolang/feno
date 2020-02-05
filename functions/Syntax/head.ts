import * as find from '@instances/find';
import Error from '@syntax/models/Error';
import fse from 'fs-extra';
import { rejects } from 'assert';
const base = process.cwd();

export async function $watch(feno_code:string, filename:string) {
    if (await find.head(feno_code)) {
        // DEPRECATED? let head_content: string = feno_code.split('head: {').pop().split('}')[0];
        //let head_content: string = feno_code.replace(/head: ?\n?.*?{([\s\S]*?)\n}/,'$1');
        let head_content: string = feno_code
            .match(/head: ?\n?.*?{([\s\S]*?)\n}/)[0]
            .replace(/head: ?\n?.*?{([\s\S]*?)\n}/, '$1');
        // Esta variable será el head que recibira modificaciones de contenido: meta, title, etc...
        let head_code: string = `head: {${head_content}\n}`;
        // Esta variable será el head pero sin modificaciones del developer...
        let head_code_without_modifications: string = head_code;

        if (/title: ?\"(.*?)\",?/.test(head_content)) { // Si se encuentra una declaración de título
            head_code = head_code.replace(/title: ?\"(.*?)\",?/, '<title>$1</title>');
        }

        if (/meta: ?\[/.test(head_content)) { /** Si se ha declarado un meta */
            let meta_content: string = head_content.split(/meta: ?\[/).pop().split(/\]/)[0]; // Obtener contenido del meta
            meta_content = meta_content.replace(/^\s*/gm, ''); // Remover tabs
            /** Check if meta has content */
            if (meta_content && /"(.*?),|:(.*?)"/g.test(meta_content)) {
                meta_content = meta_content.replace(/"charset:(.*?)",?/g, '\t<meta charset="$1">');
                meta_content = meta_content.replace(/"fb-(.*?),(.*?)",?/g, '\t<meta property="og:$1" content="$2">');
                meta_content = meta_content.replace(/"twitter-(.*?),(.*?)",?/g, '\t<meta property="twitter:$1" content="$2">');
                meta_content = meta_content.replace(/"(.*?),(.*?)",?/g, '\t<meta name="$1" content="$2">');
                meta_content = meta_content.replace(/"viewport",?/g, '\t<meta name="viewport" content="width=device-width, initial-scale=1">');
                if (/meta\(\)/.test(head_content)) {
                    head_code = head_code.split(/meta\(\)/).join('');
                }
                // Remove first tab in the meta (for indent)
                meta_content = meta_content.substring(1);
                head_code = head_code.replace(/meta: ?\[([\s\S]*).*?\n.*?]/gm, meta_content)// Reemplazar Meta
            } else {
                /** The meta has no content: return error */
                new Error({
                    text: "The Meta property need at least 1 element but got 0!",
                    at: `${filename}.feno`,
                    solution: "Declare at least one element inside Meta[] property.",
                    info: "https://fenolang.herokuapp.com/docs/meta_elements#structure"
                })
            }
        } else {
            await new Promise((resolve, reject) => { // Iniciar promesa
                // Comprar existencia de meta single file
                fse.pathExists(`${base}/src/meta/_${filename}.feno`, async (err: string, exists: boolean) => {
                    if (err) return console.error(err);
                    if (exists) { // si existe...
                        if (head_content.indexOf('meta(') != -1) {
                            fse.readFile(`${base}/src/meta/_${filename}.feno`, 'utf8', (err: string, data: string) => { // Obtener contenido
                                if (err) return console.error(err);
                                if (data) {
                                    /** Proceso de Interpretación del archivo */
                                    data = data.split('[').join('');
                                    data = data.split(']').join('');
                                    data = data.replace(/^\s*/gm, ''); // Remover tabs
                                    /** If meta has content */
                                    if (data && /"(.*?),|:(.*?)"/g.test(data)) {
                                        data = data.replace(/"charset:(.*?)",?/g, '\t<meta charset="$1">');
                                        data = data.replace(/"fb-(.*?),(.*?)",?/g, '\t<meta property="og:$1" content="$2">');
                                        data = data.replace(/"twitter-(.*?),(.*?)",?/g, '\t<meta property="twitter:$1" content="$2">');
                                        data = data.replace(/"(.*?),(.*?)",?/g, '\t<meta name="$1" content="$2">');
                                        data = data.replace(/"viewport",?/, '\t<meta name="viewport" content="width=device-width, initial-scale=1">');
                                        // Delete first line break and first tab (indent file)
                                        data = data.substring(1);
                                        head_code = head_code.split(/meta\(\)/).join(data); //Reemplazar meta() por contenido
                                        resolve(); // Terminar promesa
                                    } else {
                                        /** The meta has no content: return error */
                                        new Error({
                                            text: "The Meta single file need at least 1 element but got 0!",
                                            at: `${filename}.feno and _${filename}.feno`,
                                            solution: "Declare at least one element inside your Meta[] single file.",
                                            info: "https://fenolang.herokuapp.com/docs/meta_elements#structure"
                                        })
                                    }
                                }
                            });
                        } else {
                            resolve();
                        }
                    } else { // Si no existe el meta single file
                        head_code = head_code.split(/meta\(\)/).join('');
                        resolve();
                    }
                });
            });
        }

        /** v.0.7.0-beta: Check if a component is being called */
        if (/@(.*?) ?\((.*?)\)/g.test(feno_code)) {
            feno_code = feno_code.replace(/@(.*?) ?\((.*?)\)/g,'<$1 $2></$1>')
        }

        // DEPRECATED? let final_head_code: string = await replace_nue_head(head_code);
        // Remover Head escrito en NueCode e insertar Head en HTML
        // TESTING: feno_code = feno_code.split(head_code_without_modifications).join(final_head_code);
        let components_tag = `<script src="./scripts/components.js"></script>`
        head_code = head_code.replace(/head: ?\n?.*?{([\s\S]*?)\n}/,`<head>$1${components_tag}\n</head>`);
        feno_code = feno_code.replace(/head: ?\n?.*?{([\s\S]*?)\n}/g, head_code)
        return feno_code;
    } else {
        /** v.0.7.0-beta: Check if a component is being called */
        if (/@(.*?) ?\((.*?)\)/g.test(feno_code)) {
            feno_code = feno_code.replace(/@(.*?) ?\((.*?)\)/g, '<$1 $2></$1>')
        }
        return feno_code;
    }
}
