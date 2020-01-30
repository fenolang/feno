import { Request } from '@core/main-process';
import Instance from './models/Instance';
import Error from './models/Error';

export async function searchInstance(req: Request): Promise<string> {
    return new Promise((resolve,reject) => {
        if (/\bnew Feno ?\({([\s\S]*?)}\)/g.test(req.code)) {
            let res = $run(req);
            resolve(res);
        } else {
            resolve(req.code);
        }
    })
}

export async function $run(req: Request):Promise<string> {
    let el = new Instance({structure: req.code, inline: false, filename: req.filename});
    return new Promise(async (resolve,reject) => {
        el.strings();
        el.constants();
        await el.layouts(req.config);
        el.destroy();
        resolve(el.getContent());    
    })
    //Deprecated code:
    //let struct = await el.strings(code);
    //struct = await el.destroy(struct);
    //return struct;
}