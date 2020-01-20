export function basicFunctions(code: string) {
    code = code.replace(/print\((.*?)\)/g,'console.log($1)');
    code = code.replace(/msg\((.*?)\)/g, 'alert($1)');
    return code;
}