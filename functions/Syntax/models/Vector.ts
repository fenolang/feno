import Error from './Error';

export default class Vector {
    body: string
    name: string
    result: string
    filename: string

    constructor(body: string, filename: string) {
        this.body = body;
        this.name = body.match(/Vector (.*?):/)[1];
        this.filename = filename;
    }

    public async transpile(code: string) {
        return new Promise((resolve, reject) => {
            // # Search "waits" / properties
            if (/wait\("(.*?)"\)/.test(this.body)) {
                let prop_matches = this.body.match(/wait\("(.*?)"\)/g);
                // # For every property
                prop_matches.forEach((prop: string, prop_id: number) => {
                    let prop_name = prop.match(/"(.*?)"/)[1];
                    let assignaments = new RegExp(`Vector ${this.name} ?\\(${prop_name}\\):([\\s\\S]*?)}`, 'g');
                    // # Check if there are assignaments to vector
                    if (assignaments.test(code)) {
                        let assignament_matches = code.match(assignaments);
                        // # Cases in switch
                        let cases = "";
                        // # For each assignament to this vector
                        assignament_matches.forEach((assignament, assignament_id) => {
                            // # Replace vector use for function call
                            code = code.replace(assignament, `vc_${this.name}("${prop_name}", ${assignament_id})`)
                            // # Get given code to vector
                            let given_code = assignament.match(new RegExp(`${this.name}\\((.*?)\\):([\\s\\S]*?)}`))[2]
                            cases += `\tcase ${assignament_id}:\n\t\t\t${given_code}\n\t\t\tbreak;\n\t`
                        })   
                        let vector = `//Property: '${prop_name}'\nif (vector == '${prop_name}') {\n\tswitch(opc) {\n\t${cases}\n\t}\n}`
                        code = code.replace(prop, vector);
                    } else {
                        code = code.replace(prop, `// Property: '${prop_name}'\nif (vector == '${prop_name}') {\n}`);
                    }
                })
                // # Transform Vector declaration to a function declaration
                code = code.replace(/declare Vector (.*?):([\s\S]*?)}/g, `// Vector: '${this.name}'\nFun vc_$1(vector, opc) :$2}`);
                this.result = code;
                resolve()
            } else {
                // # Transform Vector declaration to a function declaration
                code = code.replace(/declare Vector (.*?):([\s\S]*?)}/g, 'Fun $1(vector, opc) {$2}');
                // # If there are assignaments to the vector
                if (/Vector (.*?) ?\((.*?)\):([\s\S]*?)}/g.test(code)) {
                    let probably_prop = code.match(/Vector (.*?) ?\((.*?)\):([\s\S]*?)}/)[2];
                    // Return error because this vector does not wait any prop and the user is giving one
                    new Error({
                        text: `Vector '${this.name}' does not wait '${probably_prop}' prop.`,
                        at: `${this.filename}.feno`,
                        solution: `Don't send props to vectors that doesn't wait any prop.`,
                        info: "https://fenolang.herokuapp.com/docs/vectors"
                    })
                    reject()
                } else {
                    this.result = code;
                    resolve();
                }
            }
        })
    }
}