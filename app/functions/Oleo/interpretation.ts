const functions = require('./compile');
const component_functions = require('./compile-components');
const head = require('./../OleoScript/head');
const images = require('./images');

module.exports = {
    compile: async function(code:string,type:string,name:string) {
        let html:string = code;

        //html = await functions.deleteLinks(html);

        html = await images.$watch(html);

        html = await functions.attributes(html);

        html = await functions.tags(html);

        html = await functions.jscompile(html);

        //html = await functions.fixTags(html);

        html = await head.$watch(html,name);

        if (type == 'script') {
            html = functions.close_doc(html);
        } else {
            html = component_functions.close_doc(html);
        }
        return html;
    }
}