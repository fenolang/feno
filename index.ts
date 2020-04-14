import 'module-alias/register'
import clear from '@config/clear';
import fse from 'fs-extra';

import Watcher from '@core/Watcher'
import Server from '@core/Server'

//Interfaces
import { Configuration } from '@main/Program';

const base = process.cwd();

clear();

async function config() {
    return new Promise(async (resolve, reject) => {
        fse.pathExists(`${base}/src/feconfig.feno`, (err: string, exists: boolean) => {
            if (err) return console.error(err)
            if (exists) {
                fse.readFile(`${base}/src/feconfig.feno`, 'utf8', async (err: string, data: string) => {
                    if (err) return console.error(err)
                    let config: Configuration = {
                        port: 4000,
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
                    
                    resolve(config)
                })
            } else
                resolve()
        })
    })
}

export async function main(config) {
    return new Promise(async (resolve, reject) => {
        let watcher = new Watcher(config)
        await watcher.exec()
        resolve();
    })
}

async function server(config) {
    return new Promise((resolve, reject) => {
        let server = new Server(config)
        server.exec()
        resolve();
    })
}

export async function run() {
    let configuration = await config()
    await main(configuration);
    await server(configuration);
}

run()