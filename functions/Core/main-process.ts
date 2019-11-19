import { searchInstance, $run } from '../Syntax/main';
const styles = require('./../Darl/styles');

const interpretation = require('./../Darl/interpretation');

module.exports = {
    Process: async function(code:string, type:string, name:string) {
        code = await searchInstance(code);
        code = await styles.$watch(code);
        code = await interpretation.compile(code,type,name);
        return code;
    }
}

export {}