import * as functions from './compile';
//import * as component_functions from './compile-components';
import * as images from './images';
import * as styles from './styles';
import * as head from '@syntax/head';
import * as attributes from './attributes';
import { Request } from '@core/main-process';

export async function compile(req: Request) {
    let html: string = req.code;
    await new Promise(async (resolve, reject) => {
        html = await images.$watch(html, req.filename);

        html = attributes.transpile(html);

        html = await functions.jscompile(html);

        // Head instance
        html = await head.$watch(html, req.filename);

        // Styles instance
        html = await styles.checkInstance(html, req.filename);

        html = functions.formatDocument(html, req.type)

        resolve();
    })
    return html;
}