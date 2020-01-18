import Instance from './models/Instance';
import Error from './models/Error';

export async function searchInstance(code: string, filename: string): Promise<string> {
    return new Promise((resolve,reject) => {
        if (/\bnew Feno ?\({([\s\S]*?)}\)/g.test(code)) {
            let res = $run(code, filename);
            resolve(res);
        } else {
            resolve(code);
        }
    })
}

export async function $run(code: string, filename: string):Promise<string> {
    let el = new Instance({structure: code, inline: false, filename: filename});
    return new Promise(async (resolve,reject) => {
        await el.layouts();
        el.strings();
        el.destroy();
        resolve(el.getContent());    
    })
    //Deprecated code:
    //let struct = await el.strings(code);
    //struct = await el.destroy(struct);
    //return struct;
}