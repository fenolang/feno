import Error from '@syntax/models/Error'

export function $watch(code:string, filename: string):string {
    if (/\bimage\(""\)/g.test(code)) { // If the image() function got 0 parameters
        new Error({
            text: "image() function expects 1 parameter but got 0!",
            at: `${filename}.feno`,
            solution: "Pass the path of the image that you want as a parameter on image() function",
            info: "https://fenolang.herokuapp.com/docs/img"
        })
    } else {
        code = code.replace(/\bimage\("(.*?)\b"\)(.\((.*?)\))?/g, '<img src="/images/$1" $3>');
        return code;
    }
}