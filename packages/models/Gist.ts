import { Configuration } from '@main/Program';
const beautify = require('js-beautify').html;
import Variable from './Variable';
import Constant from './Constant';
import State from './State';
import Vector from './Vector';
import Error from './Error';
import * as find from '@utils/find';
import * as layouts from '@main/layouts';
import { functions } from '@main/Program';

interface GistBody {
    html: string,
    filename: string
}

export default class Gist {
    
    html: string = ""
    code: string = ""
    filename: string = ""
    
    constructor(body: GistBody) {
        this.html = body.html
        this.filename = body.filename
        this.code = this.html.match(/<script>([\s\S]*?)<\/script>/)[1]

        this.html = this.html.replace(/<script>[\s\S]*?<\/script>/, functions(this.html.match(/<script>[\s\S]*?<\/script>/)[0]))
    }
    
    private applyVariables(variable: string): void {
        // Set slots
        let regex = new RegExp(`{{ ?${variable} ?}}`,'g')
        // # Check if a variable is being called on the document instance
        if (regex.test(this.html)) {
            this.html = this.html.replace(regex, `<slot name="${variable}"></slot>`)
            let apply_code = `document.querySelector('[name="${variable}"]').innerHTML = ${variable};`
            // Set apply code
            this.html = this.html.replace(/<script>([\s\S]*?)<\/script>/, `<script>$1\n${apply_code}</script>`)
            //this.structure = this.structure.replace(/new Feno ?\({([\s\S]*?)}\)/, `new Feno({$1\t${apply_code}\n})`);
        }
    }

    public async variables() {
        if (find.variable(this.code)) {
            let variables = this.code.match(/\bdef (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/g)
            variables.forEach(code => {
                let variable = new Variable({
                    var: code,
                    filename: this.filename
                })
                if (variable.checkType() && variable.checkAssignmentTypes(this.code)) {
                    this.html = variable.transpile(this.html);
                    this.applyVariables(variable.variable_name);
                }
            })
        }
    }

    public constants(): void {
        if (find.constant(this.code)) {
            let lines: string[] = this.code.split(/\n/);
            new Promise((resolve, reject) => {
                lines.forEach(async line => {
                    if (find.constant(line)) {
                        let constant = new Constant({
                            var: line.match(/const (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/)[0],
                            filename: this.filename
                        })
                        if (constant.checkType() && constant.checkNoAssignaments(this.code)) {
                            this.html = constant.transpile(this.html);
                            this.applyVariables(constant.variable_name);
                        }
                    }
                })
                resolve(this.html);
            })
        }
    }

    public async state_properties() {
        let state = new State({
            code: this.html,
            filename: this.filename
        })
        await state.process();
        this.html = state.req.code;
        this.html = this.html.replace(/<script>[\s\S]*?<\/script>/, functions(this.html.match(/<script>[\s\S]*?<\/script>/)[0]))
    }

    public async vectors() {
        return new Promise((resolve, reject) => {
            // # Find a vector
            if (find.vector(this.code)) {
                let vector_matches = this.code.match(/declare Vector .*? ?{[\s\S]*?}/g);
                // For every vector
                vector_matches.forEach(async vector_match => {
                    let vector = new Vector(vector_match, this.filename);
                    // # Transpile code of vector
                    await vector.transpile(this.html);
                    this.html = vector.result;
                    // # Transpile code of vector properties
                    this.html = this.html.replace(/<script>[\s\S]*?<\/script>/, functions(this.html.match(/<script>[\s\S]*?<\/script>/)[0]))
                })
                resolve();
            } else {
                resolve();
            }
        })
    }

    public getContent(): string {
        this.html = beautify(this.html);
        return this.html;
    }
    
}