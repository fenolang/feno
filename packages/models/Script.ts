import { getPublic } from '@config/env';
import { Configuration } from '@main/Program';
import * as find from '@utils/find';
import beautify from 'js-beautify';
import fse from 'fs-extra';
import path from 'path';
import { functions } from '@main/Program'
import Variable from './Variable';
import Constant from './Constant';
import Vector from './Vector';
const base = process.cwd();

interface Request {
    code: string,
    filename: string
}

export default class Script {
    public req: Request;

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
        let files: [] = await fse.readdir(path.join(getPublic(), `/scripts`))
        if (files && files.length) {
            files.forEach(async file => {
                let filename = path.basename(file, path.extname(file));
                if (filename != "components") {
                    let file_exists = await fse.pathExists(`${base}/src/${config.scriptsDir}${filename}.feno`)
                    if (!file_exists)
                        await fse.remove(path.join(getPublic(), `/scripts/${file}`))
                }
            })
        }
    }

    public async observe(config: Configuration) {
        let files = await fse.readdir(`${base}/src/${config.scriptsDir}`)
        if (files && files.length) {
            files.forEach(async file => {
                let ext = path.extname(file)
                /** If the file is a feno script */
                if (ext == ".feno") {
                    let file_content = await fse.readFile(`${base}/src/${config.scriptsDir}${file}`, 'utf8')
                    if (file_content && file_content.length) {
                        this.req = {
                            filename: path.basename(file, path.extname(file)),
                            code: file_content
                        }
                        await this.process()
                        await fse.writeFile(path.join(getPublic(), `/scripts/${this.req.filename}.js`), this.req.code)
                    }
                }
            })
        }
    }

    public async process() {
        return new Promise(async (resolve, reject) => {
            await this.vectors();
            await this.variables();
            await this.constants();
            this.req.code = functions(this.req.code);
            this.req.code = beautify(this.req.code);
            resolve()
        })
    }

    private async variables() {
        /** Check if contents variable declarations */
        if (find.variable(this.req.code)) {
            let variables = this.req.code.match(/\bdef (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/g)
            variables.forEach(code => {
                let variable = new Variable({
                    var: code,
                    filename: this.req.filename
                })
                /** Check types */
                if (variable.checkType() && variable.checkAssignmentTypes(this.req.code)) {
                    this.req.code = variable.transpile(this.req.code);
                }
            })
        }
    }

    private async constants() {
        /** Check if contents constant declations */
        if (find.constant(this.req.code)) {
            let constants = this.req.code.match(/\bconst (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/g)
            constants.forEach(code => {
                let constant = new Constant({
                    var: code,
                    filename: this.req.filename
                })
                /** Check types */
                if (constant.checkType() && constant.checkNoAssignaments(this.req.code)) {
                    this.req.code = constant.transpile(this.req.code);
                }
            })
        }
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