export function basicFunctions(code: string) {
    code = code.replace(/print\((.*?)\)/g,'console.log($1)');
    code = code.replace(/msg\((.*?)\)/g, 'alert($1)');

    //functions
    code = code.replace(/fun (\S*?) ?(\((.*?)\))? ?{/g,'function $1($3) {');

    //conditionals
    code = code.replace(/if \(?(.*?)\)? ?[{|:]/g, 'if ($1) {');
    code = code.replace(/else ?[{|:]/g, 'else {');
    code = code.replace(/elif \(?(.*?)\)? ?[{|:]/g,'else if ($1) {');

    //Imports [to ES5]
    //code = code.replace(/import ([^{]\S*?[^}]) from ["|'|`](.*?)["|'|`];/g, 'const $1 = require("$2");');
    //code = code.replace(/import ([{].*?[}]) from ["|'|`](.*?)["|'|`];/g, 'const $1 = require("$2");');

    return code;
}