import { getPublic } from '@config/env';
import { Configuration } from '@core/main-process';
import * as find from '@instances/find';
import beautify from 'js-beautify';
import fse from 'fs-extra';
import path from 'path';
import * as utils from '../utils';
import Variable from './Variable';
import Constant from './Constant';
import Vector from './Vector';
const base = process.cwd();

interface Request {
    code: string,
    filename: string
}

export default class Script {
    req: Request;

    constructor() {
    }

    public async start(config: Configuration) {
        return new Promise(async (resolve, reject) => {
            await this.checkDeletedScripts(config);
            await this.observe(config);
            resolve();
        })
    }

    public async checkDeletedScripts(config: Configuration) {
        return new Promise((resolve, reject) => {
            fse.readdir(path.join(getPublic(), `/scripts`), (err: string, files: []) => {
                if (err) return console.error(err);
                if (files && files.length) {
                    files.forEach(file => {
                        let filename = path.basename(file, path.extname(file));
                        if (filename != 'components') {
                            fse.pathExists(`${base}/src/${config.scriptsDir}${filename}.feno`, (err: string, exists: boolean) => {
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
                } else {
                    resolve();
                }
            })
        })
    }

    public async observe(config: Configuration) {
        return new Promise((resolve, reject) => {
            fse.readdir(`${base}/src/${config.scriptsDir}`, (err: string, files: []) => {
                if (err) return console.error(err);
                /** If there are scripts */
                if (files && files.length) {
                    files.forEach(file => {
                        let ext = path.extname(file);
                        /** If the file is a feno script */
                        if (ext == '.feno') {
                            fse.readFile(`${base}/src/${config.scriptsDir}${file}`, 'utf8', async (err: string, data: string) => {
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
                } else {
                    resolve();
                }
            })
        })
    }

    private async process() {
        return new Promise(async (resolve, reject) => {
            await this.vectors();
            await this.variables();
            await this.constants();
            this.req.code = utils.basicFunctions(this.req.code);
            this.req.code = beautify(this.req.code);
            resolve()
        })
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

    private async constants() {
        return new Promise((resolve, reject) => {
            let lines: string[] = this.req.code.split(/\n/);
            lines.forEach(line => {
                if (find.constant(line)) {
                    let constant = new Constant({
                        var: line.match(/const (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/)[0],
                        filename: this.req.filename
                    })
                    /** Check if types are correct in constant */
                    if (constant.checkType() && constant.checkNoAssignaments(this.req.code)) {
                        this.req.code = constant.transpile(this.req.code);
                    }
                }
            })
            resolve();
        })
    }

    private async vectors() {
        return new Promise((resolve, reject) => {
            // # Check if there are vectors
            if (find.vector(this.req.code)) {
                // # Find all vector declarations
                let vector_matches = this.req.code.match(/declare Vector .*?:[\s\S]*?}/g);
                vector_matches.forEach(async vector_match => {
                    let vector = new Vector(vector_match, this.req.filename);
                    // # Transpile vector -> function
                    await vector.transpile(this.req.code);
                    this.req.code = vector.result;
                })
                resolve();
            } else {
                resolve();    
            }
        })
    }
}