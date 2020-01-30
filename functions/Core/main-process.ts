import { searchInstance, $run } from '@syntax/main';
import Script from '@syntax/models/Script';
import * as styles from '@feno/styles';
import * as scripts from '@feno/scripts';
import * as interpretation from '@feno/interpretation';

export interface Configuration {
    stylesDir: string,
    scriptsDir: string,
    outDir: string,
    noscript: string
}

export interface Request {
    code: string,
    type: string,
    filename: string,
    config: Configuration
}

export async function Process(req: Request) {
    /** Run scripts transpilation */
    let script = new Script();
    script.start(req.config);

    req.code = await searchInstance(req); // Search FENO class

    /** Search for external sources */
    req.code = await styles.$watch(req.code, req.filename);
    req.code = await scripts.$watch(req.code, req.filename);
    req.code = await scripts.checkNoScript(req.code, req.filename);

    /** Transpile */
    //req.code = await interpretation.compile(req.code, req.type, req.filename);
    req.code = await interpretation.compile(req);

    return req.code;
}