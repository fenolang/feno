import fse from 'fs-extra';
import * as fs from './fs'
import clear from './clear';
import { getPublic } from './env';
import * as feno from '../index';
const base = process.cwd()

async function build() {
    return new Promise(async (resolve, reject) => {
        await feno.main()
        clear();
        fse.copy(getPublic(), `${base}/dist`, (err: string) => {
            if (err) return console.error(err);
        })
        resolve();
    })
}

async function init() {
    await fs.createFolder(`${base}/src`);
    await fs.createFoldersOnPath({
        route: `${base}/src`,
        names: ["layouts", "components", "meta", "pages", "scripts", "styles"]
    })
    await fs.writeFile({ route: `${base}/src/pages/index.feno`, content: "" });
    let config_content: string = `{\n\toutDir: "",\n\tscriptsDir: "",\n\tstylesDir: ""\n}`
    await fs.writeFile({ route: `${base}/feconfig.feno`, content: config_content});
    await fs.writeFile({ route: `${base}/nodemon.json`, content: `{\n\t"ext": "feno"\n}` });
}

async function folders() {
    await fs.createFolder(`${base}/src`);
    await fs.createFoldersOnPath({
        route: `${base}/src`,
        names: ["layouts", "components", "meta", "pages", "scripts", "styles"]
    })
}

async function files() {
    await fs.writeFile({ route: `${base}/src/pages/index.feno`, content: "" });
    let config_content: string = `{\n\toutDir: "",\n\tscriptsDir: "",\n\tstylesDir: ""\n}`
    await fs.writeFile({ route: `${base}/feconfig.feno`, content: config_content });
    await fs.writeFile({ route: `${base}/nodemon.json`, content: `{\n\t"ext": "feno"\n}` });
}

async function configfile() {
    let config_content: string = `{\n\toutDir: "",\n\tscriptsDir: "",\n\tstylesDir: ""\n}`
    await fs.writeFile({ route: `${base}/feconfig.feno`, content: config_content });
}

async function nodemonfile() {
    await fs.writeFile({ route: `${base}/nodemon.json`, content: `{\n\t"ext": "feno"\n}` });
}

async function load() {
    if (process.argv.includes('init')) {
        init()
        console.log(`< \u{1F4E6}  Work environment created successfully!`);
    } else {
        if (process.argv.includes('generate')) {
            if (process.argv.includes('folders')) {
                folders()
                console.log(`< \u{1F4E6}  Folders created successfully!`)
            } else if (process.argv.includes('files')) {
                files()
                console.log(`< \u{1F4E6}  Files created successfully!`)
            } else if (process.argv.includes('config')) {
                configfile()
                console.log(`< \u{1F4E6}  Config file created successfully!`)
            } else if (process.argv.includes('nmfile')) {
                nodemonfile()
                console.log(`< \u{1F4E6}  Nodemon file created successfully!`)
            }
        } else {
            if (process.argv.includes('build')) {
                await build()
                console.log(`< \u{1F4E6}  Production files created successfully!`)
            }
        }
    }
}

clear();

new Promise(async (resolve, reject) => {
    await load();
    resolve();    
})