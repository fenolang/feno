import * as Core from '@core/main-process';
import { getPublic } from '@config/env';
import path from 'path';
import fse from 'fs-extra';
const base = process.cwd();

function formData(code: string, filename: string): string {
    let data = `customElements.define('${filename}', class extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = \`${code}\`;
}
});`
    return data;
}

export async function transpile() {
    /** Read all files in components folder */
    fse.readdir(`${base}/src/components/`, async (err: string, files: string[]) => {
        if (err) return console.error(err);
        if (files && files.length) {
            var components_declaration: string = "";
            files.forEach(async (file) => {
                let ext = path.extname(file);
                // If the file is a feno script
                if (ext == '.feno') {
                    let basename = path.basename(file, path.extname(file));
                    fse.readFile(`${base}/src/components/${file}`, 'utf8', async (err: string, data: string) => {
                        if (err) return console.error(err);
                        let transpiled_content = await Core.Process(data, 'script', basename);
                        let body = transpiled_content.replace(/<body>([\s\S]*?)<\/body>/g,'$1');
                        let js_document = formData(body, basename);
                        components_declaration = `${components_declaration}\n\n${js_document}`;
                        // If we are in the last file of the folder
                        if (files[files.length-1] == file) {
                            fse.writeFile(path.join(getPublic(), '/scripts/components.js'), components_declaration, (err: string) => {
                                if (err) return console.error(err);
                            })                
                        }
                    })
                }
            })
        }
    })
}