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
    String = `["|'|\`].*?["|'|\`]`;
    Number = `\\d`;
    Boolean = `true|false`;
    Object = `{[\\s\\S]*?}`;
    Array = `\[[\\s\\S]*?\]`;

    constructor(instance:Params) {
        this.variable = instance.var;
        this.variable_name = this.variable.match(/\bdef (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/)[1]
        this.value = this.variable.match(/\bdef (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/)[2]
        this.type = this.variable.match(/\bdef (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/)[3]
        this.filename = instance.filename;
    }

    public transpile(code: string): string {
        code = code.replace(this.variable, `let ${this.variable_name} = ${this.value};`);
        return code;
    }

    private returnError(type: string) {
        new Error({
            text: `Type '${type}' is not assignable to type '${this.type}'.`,
            at: `${this.variable} in ${this.filename}.feno`,
            solution: `Check that your types are correctly defined in ${this.filename}.feno file`,
            info: `https://fenolang.herokuapp.com/docs/typing`
        })
    }

    private returnAssignmentError(type: string) {
        new Error({
            text: `Type '${type}' cannot implicity change its type.`,
            at: `${this.filename}.feno`,
            solution: `Check that your types are correctly defined in ${this.filename}.feno file`,
            info: `https://fenolang.herokuapp.com/docs/typing`
        })
    }

    public checkAssignmentTypes(code: string) {
        let regex: RegExp;

        if (this.type == 'String') {
            regex = new RegExp(`${this.variable_name} ?= ?(${this.Number}|${this.Boolean}|${this.Object}|${this.Array})`, 'gm');
        }
        else if (this.type == 'Number')
            regex = new RegExp(`${this.variable_name} ?= ?(${this.String}|${this.Boolean}|${this.Object}|${this.Array})`, 'gm');
        else if (this.type == 'Boolean')
            regex = new RegExp(`${this.variable_name} ?= ?(${this.String}|${this.Number}|${this.Object}|${this.Array})`, 'gm');
        else if (this.type == 'Object')
            regex = new RegExp(`${this.variable_name} ?= ?(${this.Number}|${this.Number}|${this.String}|${this.Array})`, 'gm');
        else if (this.type == 'Array')
            regex = new RegExp(`${this.variable_name} ?= ?(${this.Number}|${this.Boolean}|${this.Object}|${this.String})`, 'gm');

        if (regex.test(code))
            this.returnAssignmentError(this.type);
        else
            return true
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