import * as fs from './fs'
import clear from './clear';

const base = process.cwd()

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

clear();

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
    }
}