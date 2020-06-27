import { getPublic } from '@config/env'
import { Configuration } from '@main/Program'
import { Program } from '@main/Program'
import Error from '@models/Error'
import * as Components from '@main/components';
import fse from 'fs-extra'
import path, { basename } from 'path'
import rsync from "rsyncwrapper"
const base = process.cwd()

export default class Watcher {
    config: Configuration

    constructor (config: Configuration) {
        this.config = config
    }

    public async exec() {
        return new Promise(async (resolve, reject) => {
            await this.checkDeletedPages()
            await this.WatchStyles()
            await this.WatchScripts()
            await this.WatchImages()
            await Components.transpile(this.config)
            await this.watchPages()
            resolve()
        })
    }

    private async watchPages() {
        let files = await fse.readdir(`${base}/src/pages`)
        if (files && files.length) {
            files.forEach(async file => {
                let ext: string = path.extname(file)
                if (ext == ".feno") {
                    let file_content = await fse.readFile(`${base}/src/pages/${file}`, 'utf8')
                    let filename: string = path.basename(file, path.extname(file))
                    let transpilation = new Program({
                        type: "page",
                        filename: filename,
                        config: this.config,
                        code: file_content
                    })
                    await transpilation.execute()
                }
            })
        } else
            new Error({
                text: "There are no pages in this project!",
                at: `index.js`,
                solution: "Create an index.feno file in /pages folder for start",
                info: "https://fenolang.herokuapp.com/docs/installation"
            })
    }

    private async WatchStyles() {
        rsync({
            src: `${base}/src/${this.config.stylesDir}`,
            dest: path.join(getPublic(), "/css"),
            recursive: true,
            deleteAll: true
        }, err => err ? console.error(err) : null)
    }

    private async WatchImages() {
        rsync({
            src: `${base}/src/static`,
            dest: path.join(getPublic()),
            recursive: true,
            deleteAll: true
        }, err => err ? console.error(err) : null)
    }

    private async WatchScripts() {
        rsync({
            src: `${base}/src/${this.config.scriptsDir}`,
            dest: path.join(getPublic(), "/scripts"),
            recursive: true,
            delete: true,
            exclude: ["components.js"]
        }, err => err ? console.error(err) : null)
    }

    private async checkDeletedPages() {
        let files = await fse.readdir(getPublic())
        files.forEach(async file => {
            let ext: string = path.extname(file)
            let filename: string = path.basename(file, path.extname(file))
            if (ext == ".html") {
                let file_exists = await fse.pathExists(`${base}/src/pages/${filename}.feno`)
                if (!file_exists)
                    await fse.remove(path.join(getPublic(), `/${file}`))
            }
        })
    }

}