import * as functions from './compile';
import * as component_functions from './compile-components';
import * as images from './images';
import * as styles from './styles';
import * as head from '@syntax/head';

export async function compile(code:string,type:string,name:string) {
    let html: string = code;
    await new Promise(async (resolve, reject) => {
        //html = await functions.deleteLinks(html);

        html = await images.$watch(html, name);

        //html = await functions.attributes(html); HTML DEPRECATED

        //html = await functions.tags(html); HTML DEPRECATED

        html = await functions.jscompile(html);

        //html = await functions.fixTags(html);

        // Head instance
        html = await head.$watch(html, name);

        // Styles instance
        html = await styles.checkInstance(html, name);

        if (type == 'script') {
            html = functions.close_doc(html);
        } else {
            html = component_functions.close_doc(html);
        }
        resolve();
    })
    return html;
}