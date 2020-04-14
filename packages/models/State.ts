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
                let all_modificators = this.req.code.match(/declare State (.*?): ?(.*?);/g);
                all_modificators.forEach(modificator => {
                    let modificator_name = modificator.match(/declare State (.*?): ?(.*?);/)[1];
                    let variable = this.req.code.match(/declare State (.*?): ?(.*?);/)[2];
                    // # Check if variable exists
                    if (this.checkVariableExistance(variable)) {
                        // # Check if the modificator function is being used
                            //let modificator_use = this.req.code.match(new RegExp(`${modificator} ?\\((.*?)\\);?`))[0];
                            //let modificator_use_code = this.req.code.match(new RegExp(`${modificator} ?\\((.*?)\\);?`))[1];
                            let modificator_unit = new RegExp(`declare State ${modificator_name}: ?${variable};`)
                            this.req.code = this.req.code.replace(modificator_unit, `Fun ${modificator_name}(new_value):\n${variable} = new_value;\ndocument.querySelector('[name="${variable}"]').innerHTML = ${variable};\n}`);
                    }
                })
                resolve()
            }
        })
    }
}