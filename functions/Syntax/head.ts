import fse from 'fs-extra';
import * as find from '@instances/find';
const base = process.cwd();

export async function $watch(feno_code:string, name:string) {
    if (await find.head(feno_code)) {
        let head_content: string = feno_code.split('head: {').pop().split('}')[0];
        // Esta variable será el head que recibira modificaciones de contenido: meta, title, etc...
        let head_code: string = `head: {${head_content}}`;
        // Esta variable será el head pero sin modificaciones del developer...
        let head_code_without_modifications: string = head_code;

        if (/title: ?\"(.*?)\",?/.test(head_content)) { // Si se encuentra una declaración de título
            head_code = head_code.replace(/title: ?\"(.*?)\",?/, '<title>$1</title>');
        }

        if (/meta: ?\[/.test(head_content)) { /** Si se ha declarado un meta */
            let meta_content: string = head_content.split(/meta: ?\[/).pop().split(/\]/)[0]; // Obtener contenido del meta
            meta_content = meta_content.replace(/^\s*/gm, ''); // Remover tabs
            let old_meta_content: string = meta_content;
            meta_content = meta_content.replace(/"charset:(.*?)",?/g, '<meta charset="$1">');
            meta_content = meta_content.replace(/"fb-(.*?),(.*?)",?/g, '<meta property="og:$1" content="$2">');
            meta_content = meta_content.replace(/"twitter-(.*?),(.*?)",?/g, '<meta property="twitter:$1" content="$2">');
            meta_content = meta_content.replace(/"(.*?),(.*?)",?/g, '<meta name="$1" content="$2">');
            if (/meta\(\)/.test(head_content)) {
                head_code = head_code.split(/meta\(\)/).join('');
            }
            head_code = head_code.replace(/meta: ?\[([\s\S]*).*?\n.*?]/g, meta_content)// Reemplazar Meta
        } else {
            await new Promise((resolve, reject) => { // Iniciar promesa
                // Comprar existencia de meta single file
                fse.pathExists(`${base}/src/meta/_${name}.feno`, async (err: string, exists: boolean) => {
                    if (err) return console.error(err);
                    if (exists) { // si existe...
                        if (head_content.indexOf('meta(') != -1) {
                            fse.readFile(`${base}/src/meta/_${name}.feno`, 'utf8', (err: string, data: string) => { // Obtener contenido
                                if (err) return console.error(err);
                                if (data) {
                                    /** Proceso de Interpretación del archivo */
                                    data = data.split('[').join('');
                                    data = data.split(']').join('');
                                    data = data.replace(/"charset:(.*?)",?/g, '<meta charset="$1">');
                                    data = data.replace(/"fb-(.*?),(.*?)",?/g, '<meta property="og:$1" content="$2">');
                                    data = data.replace(/"twitter-(.*?),(.*?)",?/g, '<meta property="twitter:$1" content="$2">');
                                    data = data.replace(/"(.*?),(.*?)",?/g, '<meta name="$1" content="$2">');
                                    head_code = head_code.split(/meta\(\)/).join(data); //Reemplazar meta() por contenido
                                    resolve(); // Terminar promesa
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

        function replace_nue_head(code: string): string {
            var head_to_return: string = code;
            head_to_return = head_to_return.replace(/^\s*\n/gm, ''); // REMOVE BLANK LINES
            head_to_return = head_to_return.split('head: {').join('<head>');
            head_to_return = head_to_return.split('}').join('</head>');
            return head_to_return;
        }

        let final_head_code: string = await replace_nue_head(head_code);
        // Remover Head escrito en NueCode e insertar Head en HTML
        feno_code = feno_code.split(head_code_without_modifications).join(final_head_code);
        return feno_code;
    } else {
        return feno_code;
    }
}
