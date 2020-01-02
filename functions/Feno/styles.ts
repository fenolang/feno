module.exports = {
    $watch: (code:string):string => {
        if (code) {
            if (/links\(.*?\)/.test(code)) {
                let styles_names: string|string[] = code.split('links(').pop().split(')')[0];
                const styles_declaration: string = `links(${styles_names})`;
                if (styles_names.indexOf(',') != -1) {
                    styles_names = styles_names.split(',');
                    var styles_code: string = "";
                    styles_names.forEach(style => {
                        styles_code += `<link rel="stylesheet" href="${style}.css">`;
                    });
                    code = code.split(styles_declaration).join(styles_code);
                }
            }
        }
        return code;
    }
}