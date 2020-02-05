import 'module-alias/register'
import clear from '@config/clear';
import fse from 'fs-extra';

//Modules
import Error from '@syntax/models/Error';
import * as Watcher from '@core/watcher';
import * as listen from '@core/server';

//Interfaces
import { Configuration } from '@core/main-process';

const base = process.cwd();

clear();

export async function main() {
    return new Promise(async (resolve, reject) => {
        fse.pathExists(`${base}/feconfig.feno`, (err: string, exists: boolean) => {
            if (err) return console.error(err);
            if (exists) {
                fse.readFile(`${base}/feconfig.feno`, 'utf8', async (err: string, data: string) => {
                    if (err) return console.error(err);
                    let config: Configuration = {
                        outDir: "",
                        stylesDir: "",
                        scriptsDir: "",
                        noscript: ""
                    }

                    if (/outDir: ?["|'|`](.*?)["|'|`],?/.test(data) && data.match(/outDir: ?["|'|`](.*?)["|'|`],?/)[1] != "")
                        config.outDir = data.match(/outDir: ?["|'|`](.*?)["|'|`],?/)[1]
                    else
                        config.outDir = "dist/"
                    if (/stylesDir: ?["|'|`](.*?)["|'|`],?/.test(data) && data.match(/stylesDir: ?["|'|`](.*?)["|'|`],?/)[1] != "")
                        config.stylesDir = data.match(/stylesDir: ?["|'|`](.*?)["|'|`],?/)[1]
                    else
                        config.stylesDir = "styles/"
                    if (/scriptsDir: ?["|'|`](.*?)["|'|`],?/.test(data) && data.match(/scriptsDir: ?["|'|`](.*?)["|'|`],?/)[1] != "")
                        config.scriptsDir = data.match(/scriptsDir: ?["|'|`](.*?)["|'|`],?/)[1]
                    else
                        config.scriptsDir = "scripts/"
                    if (/noScript: ?{[\s\S]*?},?/.test(data) && data.match(/noScript: ?{([\s\S]*?)},?/)[1] != "")
                        config.noscript = data.match(/noScript: ?{([\s\S]*?)},?/)[1]
                    else
                        config.noscript = ""

                    await Watcher.watch(config);
                    resolve();
                })
            } else {
                new Error({
                    text: "Feno configuration file was not found!",
                    at: "feconfig.feno",
                    solution: "Create a configuration file for Feno.",
                    info: "https://fenolang.herokuapp.com/docs/config-file"
                })
                resolve();
            }
        })
    })
}

async function server() {
    return new Promise((resolve, reject) => {
        listen.$on();
        resolve();
    })
}

/*module.exports = {
    run: async () => {
        await main();
        await server();
    }
}*/

export async function run() {
    await main();
    await server();
}