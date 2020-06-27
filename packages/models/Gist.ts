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
    
    private async applyVariables(type: string, variable: string) {
        if (type == "Array") {
            let interpolation = `{{ ?(${variable}\\[[0-9]\\]?\\..*?) ?}}`
            let regex = new RegExp(interpolation, 'g')
            if (regex.test(this.html)) {
                for await (let x of this.html.match(regex)) {
                    let body = new RegExp(interpolation)
                    let elements = x.match(body)
                    this.html = this.html.replace(elements[0], `<slot name="${elements[1]}"></slot>`)
                    let apply_code = `document.querySelector('[name="${elements[1]}"]').innerHTML = ${elements[1]};`
                    this.html = this.html.replace(/<script>([\s\S]*?)<\/script>/, `<script>$1\n${apply_code}</script>`)
                }
            }
        } else if (type == "Object") {
            let interpolation = `{{ ?(${variable}\\..*?) ?}}`
            let regex = new RegExp(interpolation, 'g')
            if (regex.test(this.html)) {
                for await (let match of this.html.match(regex)) {
                    let body = new RegExp(interpolation)
                    let elements = match.match(body)
                    this.html = this.html.replace(elements[0], `<slot name="${elements[1]}"></slot>`)
                    let apply_code = `document.querySelector('[name="${elements[1]}"]').innerHTML = ${elements[1]};`
                    this.html = this.html.replace(/<script>([\s\S]*?)<\/script>/, `<script>$1\n${apply_code}</script>`)
                }
            }
        }

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
            for await (let code of variables) {
                let variable = new Variable({
                    var: code,
                    filename: this.filename
                })
                if (variable.checkType() && variable.checkAssignmentTypes(this.code)) {
                    this.html = variable.transpile(this.html);
                    await this.applyVariables(variable.type, variable.variable_name);
                }
            }
        }
    }

    public async constants() {
        /** Check if contents constant declations */
        if (find.constant(this.code)) {
            let constants = this.code.match(/\bconst (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/g)
            constants.forEach(code => {
                let constant = new Constant({
                    var: code,
                    filename: this.filename
                })
                /** Check types */
                if (constant.checkType() && constant.checkNoAssignaments(this.code)) {
                    this.code = constant.transpile(this.code);
                }
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
        return new Promise(async (resolve, reject) => {
            // # Find a vector
            if (find.vector(this.code)) {
                let vector_matches = this.code.match(/declare Vector .*? ?{[\s\S]*?}/g);
                // For every vector
                for await (let vector_match of vector_matches) {
                    let vector = new Vector(vector_match, this.filename);
                    // # Transpile code of vector
                    await vector.transpile(this.html);
                    this.html = vector.result;
                    // # Transpile code of vector properties
                    this.html = this.html.replace(/<script>[\s\S]*?<\/script>/, functions(this.html.match(/<script>[\s\S]*?<\/script>/)[0]))
                }
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