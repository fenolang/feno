import Error from './Error';

interface Params {
    var: string;
    filename: string;
}

export default class Variable {

    variable: string = ""
    variable_name: string = ""
    type: string = ""
    value: string = ""
    filename: string = ""

    // Types
    String = `["|'|\`].*?["|'|\`]`
    Number = `\\d`
    Boolean = `true|false`
    Object = `{[\\s\\S]*?}`
    Array = `\[[\\s\\S]*?\]`

    constructor(instance: Params) {
        this.variable = instance.var
        this.variable_name = this.variable.match(/\bconst (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/)[1]
        this.value = this.variable.match(/\bconst (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/)[2]
        this.type = this.variable.match(/\bconst (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/)[3]
        this.filename = instance.filename
    }

    public transpile(code: string): string {
        code = code.replace(this.variable, `const ${this.variable_name} = ${this.value};`)
        return code
    }

    public checkNoAssignaments(code: string): boolean {
        let regex: RegExp = new RegExp(`^[\t| ]*${this.variable_name} ?= ?(.*?)`,'gm')
        if (regex.test(code)) {
            new Error({
                text: `Cannot assign to '${this.variable_name}' because it is a constant.`,
                at: `${this.filename}.feno`,
                solution: "Don't redeclare your constants.",
                info: "https://fenolang.herokuapp.com/docs/variables#const"
            })
        } else
            return true
    }

    private returnError(type: string) {
        new Error({
            text: `Type '${type}' is not assignable to type '${this.type}'.`,
            at: `${this.variable} in ${this.filename}.feno`,
            solution: `Check that your types are correctly defined in ${this.filename}.feno file`,
            info: `https://fenolang.herokuapp.com/docs/typing`
        })
    }

    public checkType() {
        /** ANY */
        if (this.type == "Any")
            return true
        /** STRING */
        else if (this.type == "String") {
            if (!/\d|true|false|{[\s\S]*?}|\[[\s\S]*?\]/.test(this.value))
                return true
            else this.returnError("String")
        }
        /** NUMBER */
        else if (this.type == "Number") {
            if (!/true|false|{[\s\S]*?}|\[[\s\S]*?\]|["|'|`].*?["|'|`]/.test(this.value))
                return true
            else this.returnError("Number")
        }
        /** OBJECT */
        else if (this.type == "Object") {
            if (!/(?!{)(.*)\d|true|false|\[[\s\S]*?\]|["|'|`].*?["|'|`](?![\s\S]*?})/.test(this.value))
                return true
            else this.returnError("Object")
        }
        /** ARRAY */
        else if (this.type == "Array") {
            if (!/\d|true|false|{[\\s\\S]*?}|["|'|`].*?["|'|`](?![\s\S]*?\])/.test(this.value))
                return true
            else this.returnError("Array")
        }
        /** BOOLEAN */
        else if (this.type == "Boolean") {
            if (!/\d|{[\s\S]*?}|\[[\s\S]*?\]|["|'|`].*?["|'|`]/.test(this.value))
                return true
            else this.returnError("Boolean")
        }
    }
}