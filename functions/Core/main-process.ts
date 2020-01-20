import { searchInstance, $run } from '@syntax/main';
import Script from '@syntax/models/Script';
import * as styles from '@feno/styles';
import * as scripts from '@feno/scripts';
import * as interpretation from '@feno/interpretation';

export async function Process(code:string, type:string, filename:string) {
    /** Run scripts transpilation */
    let script = new Script();
    script.start();

    code = await searchInstance(code, filename); // Search FENO class

    /** Search for external sources */
    code = await styles.$watch(code, filename);
    code = await scripts.$watch(code, filename);
    code = await scripts.checkNoScript(code, filename);

    /** Transpile */
    code = await interpretation.compile(code,type,filename);
    
    return code;
}