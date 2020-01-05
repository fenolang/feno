import Error from '@syntax/models/Error';

function stylesError(filename): void {
    new Error({
        text: "styles() function needs at least one parameter!",
        at: `${filename}.feno`,
        solution: "You need to call at least one stylesheet within the styles() function",
        info: "http://fenolang.org/docs/meta_elements#styles"
    })
}

export function $watch(code:string, filename: string):string {
    if (code) {
        if (/styles\(.*?\)/.test(code)) { // If the developer call the styles() function
            let content: string = code.split('styles(').pop().split(')')[0];
            if (/"(.*?)"/.test(content)) { // Check if a style is being called
                let styles_names: string | string[] = content.replace(/"/g,'') // Delete '"' characters
                if (styles_names) { // Check if a style is REALLY being called
                    const styles_declaration: string = `styles(${content})`;
                    if (styles_names.indexOf(',') != -1) {
                        styles_names = styles_names.split(',');
                        var styles_code: string = "";
                        styles_names.forEach(style => {
                            if (/\.\//.test(style)) // If the file path is outside of /css folder
                                styles_code += `\n\t<link rel="stylesheet" href="${style}.css">`;
                            else
                                styles_code += `\n\t<link rel="stylesheet" href="/css/${style}.css">`;

                        });
                        code = code.split(styles_declaration).join(styles_code);
                    } else {
                        if (/\.\//.test(styles_names)) // If the file path is outside of /css folder
                            code = code.split(styles_declaration).join(`<link rel="stylesheet" href="${styles_names}.css">`);
                        else
                            code = code.split(styles_declaration).join(`<link rel="stylesheet" href="/css/${styles_names}.css">`);
                    }
                } else {
                    stylesError(filename)
                }
            } else { // If the style() function is called without content
                stylesError(filename)
            }
        }
    }
    return code;
}