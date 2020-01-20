import Error from './Error';

/*const String = `"(.*?)"|'(.*?)'|\`[\\s\\S]*?\``;
const Number = `[0-9]*?`;
const Boolean = `true|false`;
const Object = `{[\\s\\S]*?}`;
const Array = `\[[\\s\\S]*?\]`;*/

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
    String = `"(.*?)"|'(.*?)'|\`[\\s\\S]*?\``;
    Number = `[0-9]+`;
    Boolean = `true|false`;
    Object = `{[\\s\\S]*?}`;
    Array = `\[[\\s\\S]*?\]`;

    constructor(instance:Params) {
        this.variable = instance.var;
        this.value = this.variable.match(/def (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/)[3];
        this.variable_name = this.variable.match(/def (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/)[2];
        this.type = this.variable.match(/def (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/)[1];
        this.filename = instance.filename;
    }

    public transpile(code: string): string {
        let regex = new RegExp(`def ${this.type} ${this.variable_name} ?= ?${this.value};`, 'g');
        code = code.replace(regex, `let ${this.variable_name} = ${this.value};`);
        return code;
    }

    private returnError(type: string) {
        new Error({
            text: `Type '${type}' is not assignable to type '${this.type}'.`,
            at: `${this.variable} in ${this.filename}.feno`,
            solution: `Check that your types are correctly defined in ${this.filename}.feno file`,
            info: `http://fenolang.org/docs/typing`
        })
    }

    private returnAssignmentError(type: string) {
        new Error({
            text: `Type '${type}' cannot implicity change its type.`,
            at: `${this.filename}.feno`,
            solution: `Check that your types are correctly defined in ${this.filename}.feno file`,
            info: `http://fenolang.org/docs/typing`
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
        /** STRING */
        if (/"(.*?)"|'(.*?)'|`(.*?)`/.test(this.value)) {
            if (this.type == 'String' || this.type == 'Any')
                return true;
            else {
                this.returnError('String');
            }
        /** OBJECT */
        } else if (/{(.*?|[\s\S]*?)}/.test(this.value)) {
            if (this.type == 'Object' || this.type == 'Any')
                return true
            else {
                this.returnError('Object');
            }
        /** ARRAY */
        } else if (/\[(.*?|[\s\S]*?)]/.test(this.value)) {
            if (this.type == 'Array' || this.type == 'Any')
                return true
            else {
                this.returnError('Array');
            }
        /** BOOLEAN */
        } else if (/true|false/.test(this.value)) {
            if (this.type == 'Boolean' || this.type == 'Any')
                return true
            else {
                this.returnError('Boolean');
            }
        } else if (/\d/.test(this.value)) {
            if (this.type == 'Number' || this.type == 'Any')
                return true
            else {
                this.returnError('Number');
            }
        }
    }
}