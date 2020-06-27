import fse from 'fs-extra';
import * as fs from './fs'
import clear from './clear';
import { getPublic } from './env';
import { Config, run } from '../index';
import c from "./utils"
const base = process.cwd()

async function Build() {
    return new Promise(async (resolve, reject) => {
        let config = await Config()
        await run()
        clear()
        await fse.copy(getPublic(), `${base}/${config.outDir}`)
        resolve();
    })
}

async function Init() {
    await fs.createFolder(`${base}/src`);
    await fs.createFoldersOnPath({
        route: `${base}/src`,
        names: ["layouts", "components", "meta", "pages", "scripts", "styles"]
    })
    await fs.writeFile({ route: `${base}/src/pages/index.feno`, content: "" });
    let config_content: string = `{\n\tport: "4000"\n\toutDir: "",\n\tscriptsDir: "",\n\tstylesDir: ""\n\tnoScript: {\n\t}\n}`
    await fs.writeFile({ route: `${base}/src/feconfig.feno`, content: config_content});
    await fs.writeFile({ route: `${base}/src/packages.feno`, content: "" })
    await fs.writeFile({ route: `${base}/nodemon.json`, content: `{\n\t"ext": "feno"\n}` });
}

async function Folders() {
    await fs.createFolder(`${base}/src`);
    await fs.createFoldersOnPath({
        route: `${base}/src`,
        names: ["layouts", "components", "meta", "pages", "scripts", "styles"]
    })
}

async function Files() {
    let src_folder = await fse.pathExists(`${base}/src`)
    if (src_folder) {
        await fs.createFolder(`${base}/src/pages`)
        await fs.writeFile({ route: `${base}/src/pages/index.feno`, content: "" })
        let config_content: string = `{\n\tport: "4000"\n\toutDir: "",\n\tscriptsDir: "",\n\tstylesDir: ""\n\tnoScript: {\n\t}\n}`
        await fs.writeFile({ route: `${base}/src/feconfig.feno`, content: config_content })
        await fs.writeFile({ route: `${base}/src/packages.feno`, content: "" })
        await fs.writeFile({ route: `${base}/nodemon.json`, content: `{\n\t"ext": "feno"\n}` })
        console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Files created successfully!${c.NORMAL}\n`)
    } else {
        console.log(`\n${c.NORMAL}${c.RED}🤯 💔 Unfortunately something unexpected happened...\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} I couldn't find the src/ folder!${c.NORMAL}\n`)
    }
}

async function ConfigFile() {
    let src_folder = await fse.pathExists(`${base}/src`)
    let config_content: string = `{\n\tport: "4000"\n\toutDir: "",\n\tscriptsDir: "",\n\tstylesDir: ""\n\tnoScript: {\n\t}\n}`
    if (src_folder) {
        await fs.writeFile({ route: `${base}/src/feconfig.feno`, content: config_content })
        console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Config file created successfully!${c.NORMAL}\n`)
    } else {
        console.log(`\n${c.NORMAL}${c.RED}🤯 💔 Unfortunately something unexpected happened...\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} I couldn't find the src/ folder!${c.NORMAL}\n`)
    }
}

async function PackagesFile() {
    let src_folder = await fse.pathExists(`${base}/src`)
    if (src_folder) {
        await fs.writeFile({ route: `${base}/src/packages.feno`, content: "" })
        console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Config file created successfully!${c.NORMAL}\n`)
    } else {
        console.log(`\n${c.NORMAL}${c.RED}🤯 💔 Unfortunately something unexpected happened...\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} I couldn't find the src/ folder!${c.NORMAL}\n`)
    }
}

async function NodemonFile() {
    await fs.writeFile({ route: `${base}/nodemon.json`, content: `{\n\t"ext": "feno"\n}` })
}

async function Load() {
    if (process.argv.includes('init')) {
        Init()
        console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
        console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Work environment created successfully!${c.NORMAL}\n`)
    } else {
        if (process.argv.includes('generate')) {
            if (process.argv.includes('folders')) {
                Folders()
                console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
                console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Folders created successfully!${c.NORMAL}\n`)
            } else if (process.argv.includes('files')) {
                Files()
            } else if (process.argv.includes('config')) {
                ConfigFile()
            } else if (process.argv.includes('nmfile')) {
                NodemonFile()
                console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
                console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Nodemon file created successfully!${c.NORMAL}\n`)
            } else if (process.argv.includes('packages')) {
                PackagesFile()
            }
        } else {
            if (process.argv.includes('build')) {
                //await Build()
                console.log(`\n${c.NORMAL}🧪 💗 Using ${c.GREEN}${c.BOLD}Feno v${c.VERSION}\n`)
                console.log(`${c.BOLD}${c.BLUE}\u{2139}${c.WHITE} Production files created successfully!${c.NORMAL}\n`)
            }
        }
    }
}

clear();

new Promise(async (resolve, reject) => {
    await Load();
    resolve();    
})