import { searchInstance, $run } from '@syntax/main';
import * as styles from '@feno/styles';
import * as interpretation from '@feno/interpretation';

export async function Process(code:string, type:string, name:string) {
    code = await searchInstance(code);
    code = await styles.$watch(code, name);
    code = await interpretation.compile(code,type,name);
    return code;
}