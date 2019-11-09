const emoji = require('node-emoji');
import { searchInstance, $run } from '../Graphtml/main';
const styles = require('./../Graph/styles');

const interpretation = require('./../Graph/interpretation');

module.exports = {
    Process: async function(code:string, type:string, name:string) {
        code = await searchInstance(code);
        code = await styles.$watch(code);
        code = await interpretation.compile(code,type,name);
        return code;
    }
}

export {}