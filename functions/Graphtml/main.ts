import Instance from './models/Instance';

export async function searchInstance(code: string): Promise<string> {
    return new Promise((resolve,reject) => {
        if (/\bnew Oleo ?\({([\s\S]*?)}\)/g.test(code)) {
            let res = $run(code);
            resolve(res);
        }
    })
}

export async function $run(code: string):Promise<string> {
    let el = new Instance({name: "", type: "", structure: code, inline: false, content: ""});
    el.getInstance(code);
    return new Promise((resolve,reject) => {
        let struct = el.strings(code);
        struct = el.destroy(struct);
        resolve(struct);
    })
    //Deprecated code:
    //let struct = await el.strings(code);
    //struct = await el.destroy(struct);
    //return struct;
}