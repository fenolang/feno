import { Program } from '@main/Program'
import * as find from '@utils/find';
import { getPublic } from '@config/env';
import { Configuration } from './Program';
import { Request } from './Program'
import path from 'path';
import fse from 'fs-extra';
import Error from '@models/Error'
const base = process.cwd();

export function analyzeProps(code: string): string {
    code = code.replace(/{{ ?props\.(.*?) ?}}/g,'<slot name="$1"></slot>')
    return code;
}

class Component {
    super_variables: string = "";
    public attributes: string = "return [";
    name: string = "";
    query_selectors: string = "";
    get_and_sets: string = "";
    content: string = "";
    script: string = ""

    constructor (component_name: string) {
        this.name = component_name;
    }

    public addVariable(variable: string): void {
        this.super_variables += `\nthis._${variable} = null;`;
        this.addAttribute(variable);
        this.addQuerySelector(variable);
        this.setGetAndSet(variable);
    }

    public addAttribute(attr: string): void {
        this.attributes += `'${attr}',`;
    }

    public addQuerySelector(variable: string) {
        this.query_selectors += `instance.querySelector('[name="${variable}"]').innerHTML = this.${variable};\n`
    }

    public addScript(script: string) {
        this.script = `let script_tag = document.createElement('script')\nscript_tag.textContent = \`${script}\`\ninstance.appendChild(script_tag)`
    }

    public addContent(code: string): void {
        this.content = code;
    }

    public setGetAndSet(variable: string) {
        this.get_and_sets += `get ${variable} () {
    return this.getAttribute('${variable}');
}

set ${variable} (val) {
    this._${variable} = val;
}`
    }

    public showValues(): void {
        console.log("super variables:", this.super_variables);
        console.log("attributes:", this.attributes);
        console.log("query selectors:", this.query_selectors);
        console.log("get and sets:", this.get_and_sets);
    }

    public closeAttributes(): void {
        this.attributes = this.attributes.slice(0, -1);
        this.attributes += "];";
    }

    public formatCode(): string {
        return `customElements.define("${this.name}", class extends HTMLElement {
    constructor() {
        super();
        ${this.super_variables}
    }

    static get observedAttributes() {
        ${this.attributes}
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.shadowRoot.querySelector(\`[name="\${name}"]\`).innerHTML = this[name];
        }
    }

    connectedCallback() {
        let shadowRoot = this.attachShadow({mode: 'open'});
        let doc = document.createElement('div');
        doc.innerHTML = \`${this.content}\`;
        let t = doc.querySelector('#doc');
        let instance = t.content.cloneNode(true);
        ${this.script}

        ${this.query_selectors}

        shadowRoot.appendChild(instance);
    }

    ${this.get_and_sets}
});`
    }
}

export async function transpile(config: Configuration) {
    /** Read all files in components folder */
    fse.readdir(`${base}/src/components/`, async (err: string, files: string[]) => {
        if (err) return console.error(err)
        if (files && files.length) {
            var components_declaration: string = ""
            files.forEach(async (file) => {
                let ext = path.extname(file)
                // If the file is a feno script
                if (ext == '.feno') {
                    let basename = path.basename(file, path.extname(file))

                    let data = await fse.readFile(`${base}/src/components/${file}`, 'utf8')
                    if (find.component(data)) {
                        /** Get data of the component */
                        let component_name = data.match(/<component name="(.*?)">[\s\S]*<component>/)[1]
                        let component_content = data.match(/<component name=".*?">([\s\S]*)<component>/)[1]
                        // Transpile content
                        let program = new Program({
                            type: "component",
                            filename: basename,
                            config: config,
                            code: component_content
                        })
                        await program.execute()
                        let transpiled_content = program.result

                        // Get body tag
                        let original_content = transpiled_content
                        transpiled_content = transpiled_content.match(/<body>([\s\S]*?)<\/body>/)[1]
                        transpiled_content = `<template id="doc">${transpiled_content}</template>`

                        let component = new Component(component_name)
                        if (/{{ ?props\.(.*?) ?}}/.test(transpiled_content)) {
                            /** Transpile called props */
                            let props_array = transpiled_content.match(/{{ ?props\.(.*?) ?}}/g)
                            /** Detect props and transpile to JavaScript */
                            props_array.forEach(prop_call => {
                                prop_call = prop_call.split(/{{ ?props\./).join('');
                                prop_call = prop_call.split(/ ?}}/).join('');
                                component.addVariable(prop_call);
                            })
                            component.closeAttributes();
                            transpiled_content = analyzeProps(transpiled_content);
                        } else
                            component.attributes = "";
                        component.addContent(transpiled_content);

                        if (/<script>([\s\S]*?)<\/script>/.test(original_content)) {
                            let script_tag = original_content.match(/<script>([\s\S]*?)<\/script>/)[1]
                            component.addScript(script_tag)
                        }

                        components_declaration = `${components_declaration}\n\n${component.formatCode()}`;
                    }
                    // If we are in the last file of the folder
                    if (files[files.length - 1] == file) {
                        fse.writeFile(path.join(getPublic(), '/scripts/components.js'), components_declaration, (err: string) => {
                            if (err) return console.error(err);
                        })
                    }
                }
            })
        }
    })
}

export async function test(req: Request) {
    if (find.component(req.code)) {
        var components_declaration: string = "";
        let component_name = req.code.match(/['|"|`](.*?)['|"|`](?=, ?{)/);
        let component_content = req.code.replace(/declare Component ?\(['|"|`](.*?)['|"|`], ?{([\s\S]*?)}\)/, 'doc: {$2}');
        /** Transpile component */
        let transpilation = new Program({
            type: "component",
            filename: "test",
            config: req.config,
            code: component_content
        })
        await transpilation.execute()
        let transpiled_content = transpilation.result
        /** Define content inside a template */
        transpiled_content = transpiled_content.replace(/<body>([\s\S]*?)<\/body>/g, '<template id="doc">$1<template>')
        let component = new Component(component_name[0]);
        if (/{{ ?props\.(.*?) ?}}/.test(transpiled_content)) {
            /** Transpile called props */
            let props_array = transpiled_content.match(/{{ ?props\.(.*?) ?}}/g)
            /** Detect props and transpile to JavaScript */
            props_array.forEach(prop_call => {
                prop_call = prop_call.split(/{{ ?props\./).join('');
                prop_call = prop_call.split(/ ?}}/).join('');
                component.addVariable(prop_call);
            })
            component.closeAttributes();
            transpiled_content = analyzeProps(transpiled_content);
        } else {
            component.attributes = "";
            component.addContent(transpiled_content);
            components_declaration = `${components_declaration}\n\n${component.formatCode()}`;
            return components_declaration;
        }
    } else {
        new Error({
            text: "Component declaration not found",
            at: "test",
            solution: "Declare a component in yout test",
            info: "https://fenolang.herokuapp.com/docs/components"
        })
    }
}