import Error from '@syntax/models/Error';
import * as find from '@instances/find';
import { Request } from '@core/main-process';

function scriptsError(filename): void {
    new Error({
        text: "import() expects at least 1 parameter but got 0!",
        at: `${filename}.feno`,
        solution: "You need to call at least one script within the import() function",
        info: "https://fenolang.herokuapp.com/docs/meta_elements#import"
    })
}

export function checkNoScript(req: Request): string {
    if (find.noscript(req.code)) {
        if (find.head(req.code)) {
            req.code = req.code.replace(/noscript: ?{([\s\S]*?)}/,'<noscript>$1</noscript>');
        } else {
            new Error({
                text: "Head instance was not found!",
                at: `${req.filename}.feno`,
                solution: "You should declare a Head instance before declaring the NoScript instance",
                info: "https://fenolang.herokuapp.com/docs/noscript"
            })
        }
    } else {
        if (find.head(req.code)) {
            /** If a noscript is defined in configuration */
            if (req.config.noscript && req.config.noscript.length && req.config.noscript != "") {
                req.code = req.code.replace(/head: ?{([\s\S]*?)}/, `head: {$1<noscript>${req.config.noscript}</noscript>\n}`);
            }
        }
    }
    return req.code;
}

export function $watch(code: string, filename: string): string {
    if (code) {
        if (/import\(.*?\)/.test(code)) { // If the developer call the import() function
            let content: string = code.split('import(').pop().split(')')[0];
            if (/"(.*?)"/.test(content)) { // Check if a script is being called
                let import_names: string | string[] = content.replace(/"/g, '') // Delete '"' characters
                if (import_names) { // Check if a script is REALLY being called
                    const import_declaration: string = `import(${content})`;
                    if (import_names.indexOf(',') != -1) {
                        import_names = import_names.split(',');
                        var import_code: string = "";
                        import_names.forEach(style => {
                            if (/\.\//.test(style)) // If the file path is outside of /scripts folder
                                import_code += `\n\t<script src="${style}.js"></script>`;
                            else
                                import_code += `\n\t<script src="/scripts/${style}.js"></script>`;

                        });
                        code = code.split(import_declaration).join(import_code);
                    } else {
                        if (/\.\//.test(import_names)) // If the file path is outside of /scripts folder
                            code = code.split(import_declaration).join(`<script src="${import_names}.js"></script>`);
                        else
                            code = code.split(import_declaration).join(`<script src="/scripts/${import_names}.js"></script>`);
                    }
                } else {
                    scriptsError(filename)
                }
            } else { // If the import() function is called without content
                scriptsError(filename)
            }
        }
    }
    return code;
}