import { searchInstance, $run } from '@syntax/main';
import * as styles from '@feno/styles';
import * as scripts from '@feno/scripts';
import * as interpretation from '@feno/interpretation';

export async function Process(code:string, type:string, filename:string) {
    code = await searchInstance(code, filename); // Search FENO class

    /** Search for external sources */
    code = await styles.$watch(code, filename);
    code = await scripts.$watch(code, filename);
    code = await scripts.checkNoScript(code, filename);

    /** Transpile */
    code = await interpretation.compile(code,type,filename);
    
    return code;
}