import { searchInstance, $run } from '../Syntax/main';
const styles = require('./../Feno/styles');

const interpretation = require('./../Feno/interpretation');

module.exports = {
    Process: async function(code:string, type:string, name:string) {
        code = await searchInstance(code);
        code = await styles.$watch(code);
        code = await interpretation.compile(code,type,name);
        return code;
    }
}

export {}