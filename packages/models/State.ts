import Error from './Error'
import * as find from '@utils/find'

interface Request {
    code: string,
    filename: string
}

export default class State {
    public req: Request

    constructor(req: Request) {
        this.req = req;
    }

    private checkVariableExistance(variable: string) {
        if (new RegExp(`let ${variable} ?= ?(.*?);?`).test(this.req.code))
            return true
        else {
            new Error({
                text: `${variable} variable not found.`,
                at: `${this.req.filename}.feno`,
                solution: `Declare ${variable} variable before declaring its State property`,
                info: `https://fenolang.herokuapp.com/docs/state`
            })
        }
    }

    public async process() {
        return new Promise((resolve, reject) => {
            // # Check if a State property is declared
            if (find.state(this.req.code)) {
                let all_modificators = this.req.code.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/g);
                all_modificators.forEach(modificator => {
                    let modificator_body = modificator.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/)[0]
                    let name = modificator.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/)[1]
                    let value = modificator.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/)[2]
                    this.req.code = this.req.code.replace(modificator_body, `let ${name} = {\nv: ${value},\nset(new_val) {\n${name}.v = new_val\ndocument.querySelector('[name="${name}"]').innerHTML = ${name}.v\n}\n}`)

                    let regex = new RegExp(`{{ ?[${name}|${name}.v] ?}}`, 'g')
                    // # Check if a variable is being called on the document instance
                    if (regex.test(this.req.code)) {
                        this.req.code = this.req.code.replace(regex, `<slot name="${name}"></slot>`)
                        let apply_code = `document.querySelector('[name="${name}"]').innerHTML = ${name}.v;`
                        // Set apply code
                        this.req.code = this.req.code.replace(/<script>([\s\S]*?)<\/script>/, `<script>$1\n${apply_code}</script>`)
                        //this.structure = this.structure.replace(/new Feno ?\({([\s\S]*?)}\)/, `new Feno({$1\t${apply_code}\n})`);
                    }
                })
                resolve()
            }
        })
    }
}