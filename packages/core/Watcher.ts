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
            console.log(`< \u{1F33B}  Compiled Successfully!    `);
        })
    }

    private async watchPages() {
        return new Promise(async (resolve, reject) => {
            fse.readdir(`${base}/src/pages`, (err: string, files: string[]) => {
                if (files && files.length) {
                    files.forEach(file => {
                        let ext: string = path.extname(file)
                        if (ext === '.feno') {
                            fse.readFile(`${base}/src/pages/${file}`, 'utf8', async (err: string, data: string) => {
                                if (err) return console.error(err)
                                let filename: string = path.basename(file, path.extname(file))
                                let transpilation = new Program({
                                    type: "document",
                                    filename: filename,
                                    config: this.config,
                                    code: data
                                })
                                await transpilation.run()
                            })
                        } else {
                            resolve()
                        }
                    })
                    resolve()
                } else { // If there are no pages
                    new Error({
                        text: "There are no pages in this project!",
                        at: `index.js`,
                        solution: "Create an index.feno file in /pages folder for start",
                        info: "https://fenolang.herokuapp.com/docs/installation"
                    })
                }
            })
        })
    }

    private async watchStyles() {
        return new Promise((resolve, reject) => {
            fse.readdir(`${base}/src/${this.config.stylesDir}`, (err: string, files: string[]) => {
                if (err) console.error(err);
                if (files && files.length) {
                    files.forEach(file => {
                        let ext: string = path.extname(file);
                        if (ext == '.css') {
                            fse.copyFile(`${base}/src/${this.config.stylesDir}${file}`,
                            path.join(getPublic(), `/css/${file}`), (err: string) => {
                                if (err) console.error(err);
                                resolve()
                            });
                        } else resolve()
                    });
                } else resolve()
            });
        })
    }

    private async checkDeletedPages() {
        return new Promise((resolve, reject) => {
            fse.readdir(getPublic(), (err: string, files: string[]) => {
                if (err) console.error(err)
                files.forEach(file => {
                    let ext: string = path.extname(file)
                    let basename: string = path.basename(file, path.extname(file))
                    if (ext == '.html') {
                        fse.pathExists(`${base}/src/pages/${basename}.feno`, (err: string, exists: boolean) => {
                            if (err) console.error(err)
                            if (!exists) {
                                fse.remove(path.join(getPublic(), `/${file}`), (err: string) => {
                                    if (err) console.error(err)
                                    resolve();
                                })
                            } else resolve()
                        })
                    } else resolve()
                })
            })
        })
    }

    private async checkDeletedStyles() {
        return new Promise((resolve, reject) => {
            fse.readdir(path.join(getPublic(), '/css'), (err: string, files: string[]) => {
                if (err) console.error(err)
                // # If the styles directory has files
                if (files && files.length) {
                    files.forEach(file => {
                        let ext: string = path.extname(file);
                        // # If the extension of the file is ".css"
                        if (ext == '.css') {
                            fse.pathExists(`${base}/src/${this.config.stylesDir}${file}`, (err: string, exists: boolean) => {
                                if (err) console.error(err);
                                if (!exists) {
                                    // # Remove css file from the public path
                                    fse.remove(path.join(getPublic(), `/${file}`), (err: string) => {
                                        if (err) console.error(err)
                                        resolve()
                                    })
                                } else
                                    resolve()
                            })
                        } else
                            resolve()
                    });
                } else
                    resolve()
            })
        })
    }

}