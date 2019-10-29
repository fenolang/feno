const emoji = require('node-emoji');
const styles = require('./../Oleo/styles');

const interpretation = require('./../Oleo/interpretation');

module.exports = {
    Process: async function(code:string, type:string, name:string) {
        code = await styles.$watch(code);
        code = await interpretation.compile(code,type,name);
        return code;
    }
}

export {}