import fse from 'fs-extra';
import path from 'path';
import * as find from '@instances/find';
import Variable from './Variable';
import { getPublic } from '@config/env';
const base = process.cwd();

interface Request {
    code: string,
    filename: string
}

export default class Script {
    req: Request;

    constructor() {
    }

    public async start() {
        await this.checkDeletedScripts();
        await this.observe();
    }

    public async checkDeletedScripts() {
        return new Promise((resolve, reject) => {
            fse.readdir(path.join(getPublic(), `/scripts/`), (err: string, files: []) => {
                if (err) return console.error(err);
                if (files && files.length) {
                    files.forEach(file => {
                        let filename = path.basename(file, path.extname(file));
                        if (filename != 'components') {
                            fse.pathExists(`${base}/src/scripts/${filename}.feno`, (err: string, exists: boolean) => {
                                if (err) return console.error(err);
                                if (!exists) {
                                    fse.remove(path.join(getPublic(), `/scripts/${file}`), (err: string) => {
                                        if (err) return console.error(err);
                                    })
                                }
                            })    
                        }
                    })
                    resolve();
                }
            })
        })
    }

    public async observe() {
        return new Promise((resolve, reject) => {
            fse.readdir(`${base}/src/scripts/`, (err: string, files: []) => {
                if (err) return console.error(err);
                /** If there are scripts */
                if (files && files.length) {
                    files.forEach(file => {
                        let ext = path.extname(file);
                        /** If the file is a feno script */
                        if (ext == '.feno') {
                            fse.readFile(`${base}/src/scripts/${file}`, 'utf8', async (err: string, data: string) => {
                                if (data && data.length) {
                                    if (err) return console.error(err);
                                    this.req = {
                                        filename: path.basename(file, path.extname(file)),
                                        code: data
                                    }
                                    await this.process();
                                    fse.writeFile(path.join(getPublic(), `/scripts/${this.req.filename}.js`), this.req.code, (err: string) => {
                                        if (err) return console.error(err);
                                    })
                                }
                            })
                        }
                    })
                    resolve();
                }
            })
        })
    }

    private async process() {
        await this.variables();
    }

    private async variables() {
        return new Promise((resolve, reject) => {
            let lines: string[] = this.req.code.split(/\n/);
            lines.forEach(line => {
                if (find.variable(line)) {
                    let variable = new Variable({
                        var: line.match(/def (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/)[0],
                        filename: this.req.filename
                    })
                    /** Check if types are correct in var */
                    if (variable.checkType() && variable.checkAssignmentTypes(this.req.code)) {
                        // Transpile variable to JS
                        this.req.code = variable.transpile(this.req.code);
                    }
                }
            })
            resolve();
        })
    }
}