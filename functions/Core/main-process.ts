import { searchInstance, $run } from '@syntax/main';
import * as styles from '@feno/styles';
import * as scripts from '@feno/scripts';
import * as interpretation from '@feno/interpretation';

export async function Process(code:string, type:string, name:string) {
    code = await searchInstance(code); // Search FENO class

    /** Search for external sources */
    code = await styles.$watch(code, name);
    code = await scripts.$watch(code, name);
    code = await scripts.checkNoScript(code, name);

    /** Transpile */
    code = await interpretation.compile(code,type,name);
    
    return code;
}