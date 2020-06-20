import 'module-alias/register'
import clear from '@config/clear';
import fse from 'fs-extra';
const perf = require('execution-time')()

import Watcher from '@core/Watcher'
import Server from '@core/Server'
import Error from "@models/Error"

//Interfaces
import { Configuration } from '@main/Program';

const GREEN = '\x1b[32m'
const BGREEN = "\x1b[42m"
const NORMAL = '\x1b[0m'
const BLACK = "\x1b[30m"
const WHITE = '\x1b[37m'
const BOLD = "\x1b[1m"
const BLUE = '\x1b[34m'
const UNDER = '\x1b[4m'

const base = process.cwd();

clear();

interface Option {
    result?: boolean,
    match?: string,
}

async function OptionIsDefined(data: string, option: string, is_dir: boolean):Promise<Option> {
    return new Promise(async (resolve, reject) => {
        let regex = new RegExp(`${option}: ?["|'|\`](.*?)["|'|\`],?`)
        let match: string = data.match(regex)[1]
        let dir_exists = await fse.pathExists(`${base}/src/${match}/`)
        if (is_dir) {
            if (!dir_exists) {
                new Error({
                    text: `The directory '${match}' does not exists on path '${base}/src/'`,
                    at: "feconfig.feno",
                    solution: `Create a directory called '${match}' on path '${base}/src/'`,
                    info: "https://fenolang.herokuapp.com/docs/config_file"
                })
            }
        }

        if (regex.test(data) && match != "")
            resolve({ result: true, match: match })
        else
            resolve({ result: false, match: match })
    })
}

async function Config(): Promise<Configuration> {
    return new Promise(async (resolve, reject) => {
        let config: Configuration = {
            port: 4000,
            outDir: "",
            stylesDir: "",
            scriptsDir: "",
            noscript: ""
        }
        let config_exists: boolean = await fse.pathExists(`${base}/src/feconfig.feno`)
        if (config_exists) {
            let data = await fse.readFile(`${base}/src/feconfig.feno`, 'utf8')

            let option = await OptionIsDefined(data, "port", false)
            config.port = option.result ? Number(option.match.split('"').join("")) : 4000

            option = await OptionIsDefined(data, "outDir", true)
            config.outDir = option.result ? option.match : "dist/"

            option = await OptionIsDefined(data, "stylesDir", true)
            config.stylesDir = option.result ? option.match : "styles/"

            option = await OptionIsDefined(data, "scriptsDir", true)
            config.scriptsDir = option.result ? option.match : "scripts/"

            if (/noScript: ?{[\s\S]*?},?/.test(data) && data.match(/noScript: ?{([\s\S]*?)},?/)[1] != "")
                config.noscript = data.match(/noScript: ?{([\s\S]*?)},?/)[1]
            
            resolve(config)
        }
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
    perf.start()

    let configuration: Configuration = await Config()
    await main(configuration);
    await server(configuration);

    const res = perf.stop()
    res.time = `${res.time/1000}`.substring(0, 4)

    console.log(`\n${NORMAL}🧪 💗 Using ${GREEN}${BOLD}Feno v2.0.0-beta\n${NORMAL}${WHITE}`)
    console.log(`${BGREEN}${BLACK}${BOLD} OK! ${NORMAL}${WHITE} Listening on: ${GREEN}${UNDER}https://localhost:${configuration.port}/${NORMAL}`)
    console.log(`\t${NORMAL}> In ${res.time} miliseconds!`)
    console.log(`\n${BOLD}${BLUE}\u{2139}${WHITE} Waiting for file changes`)


}

run()