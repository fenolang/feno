module.exports = {
    $watch: (code:string):string => {
        code = code.replace(/\bimage\("(.*?)\b", ?(.*?)\)/g,'<img src="/images/$1" $2>');
        return code;
    }
}