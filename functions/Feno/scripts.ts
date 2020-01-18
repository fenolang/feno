import Error from '@syntax/models/Error';
import * as find from '@instances/find';

function scriptsError(filename): void {
    new Error({
        text: "import() expects at least 1 parameter but got 0!",
        at: `${filename}.feno`,
        solution: "You need to call at least one script within the import() function",
        info: "http://fenolang.org/docs/meta_elements#import"
    })
}

export function checkNoScript(code: string, filename: string): string {
    if (find.noscript(code)) {
        if (find.head(code)) {
            code = code.replace(/noscript: ?{([\s\S]*?)}/,'<noscript>$1</noscript>');
        } else {
            new Error({
                text: "Head instance was not found!",
                at: `${filename}.feno`,
                solution: "You should declare a Head instance before declaring the NoScript instance",
                info: "http://fenolang.org/docs/noscript"
            })
        }
    }
    return code;
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