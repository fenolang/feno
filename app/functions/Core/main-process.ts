const emoji = require('node-emoji');
import { searchInstance, $run } from './../OleoScript/main';
const styles = require('./../Oleo/styles');

const interpretation = require('./../Oleo/interpretation');

module.exports = {
    Process: async function(code:string, type:string, name:string) {
        code = await searchInstance(code);
        code = await styles.$watch(code);
        code = await interpretation.compile(code,type,name);
        return code;
    }
}

export {}