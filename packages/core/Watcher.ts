import { getPublic } from '@config/env'
import { Configuration } from '@main/Program'
import { Program } from '@main/Program'
import Error from '@models/Error'
import * as Components from '@main/components';
import fse from 'fs-extra'
import path, { basename } from 'path'
const base = process.cwd()

export default class Watcher {
    config: Configuration

    constructor (config: Configuration) {
        this.config = config
    }

    public async exec() {
        return new Promise(async (resolve, reject) => {
            await this.checkDeletedStyles()
            await this.checkDeletedPages()
            await this.watchStyles()
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

    private async watchStyles() {
        let files = await fse.readdir(`${base}/src/${this.config.stylesDir}`)
        if (files && files.length) {
            files.forEach(async file => {
                let ext: string = path.extname(file);
                if (ext == ".css") {
                    await fse.copyFile(`${base}/src/${this.config.stylesDir}${file}`, path.join(getPublic(), `/css/${file}`))
                }
            })
        }
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

    private async checkDeletedStyles() {
        let files = await fse.readdir(path.join(getPublic(), '/css'))
        if (files && files.length) {
            files.forEach(async file => {
                let ext: string = path.extname(file);
                if (ext == ".css") {
                    let file_exists = await fse.pathExists(`${base}/src/${this.config.stylesDir}${file}`)
                    if (!file_exists)
                        await fse.remove(path.join(getPublic(), `/css/${file}`))
                }
            })
        }
    }

}