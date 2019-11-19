import Variable from './Variable';

interface InstanceBody {
    name: string,
    structure: string,
    inline: boolean,
    content: string,
    type: string
}

export default class Instance {
    
    name:string = "";
    type:string = "";
    content:string = "";
    inline:boolean = false;
    structure:string = "";
    
    constructor(body:InstanceBody) {
        this.name = body.name;
        this.type = body.type;
        this.content = body.content;
        this.inline = body.inline;
        this.structure = body.structure;
    }
    
    private async run(name:string, value:string):Promise<boolean> {
        return new Promise((resolve,reject) => {
            this.structure = this.structure.split(`{{${name}}}`).join(value);
            this.structure = this.structure.split(`{{ ${name} }}`).join(value);
            resolve(true);
        })
    }
    
    public getInstance(code: string): void {
        code = code.split(/\bnew Oleo ?\({/).pop().split(/}\)/)[0];
        this.content = code;
    }
    
    public strings(code: string):string {
        if (/def (.*?) ?= ?\"\D(.*?)\"/g.test(code)) {
            let content: string = this.content;
            let lines: string[] = content.split(/\n/);
            new Promise((resolve,reject) => {
                lines.forEach(async line => {
                    // Si la línea tiene una declaración de variable
                    if (/def (.*?) ?= ?\"\D(.*?)\";/g.test(line)) {
                        let variable_content:string = line.split(/def (.*?) ?= ?\"/).pop().split(/\"/)[0];
                        let variable_name:string = line.split(/def /).pop().split(/ ?=/)[0];
                        let variable = new Variable({
                            type: "string",
                            name: variable_name,
                            value: variable_content
                        })
                        await this.run(variable.name, variable.value);
                    }
                })
                resolve(this.structure);
            })
            return this.structure;
        }
    }
    
    public destroy(code: string) {
        code = code.split(/new Darl ?\({[\s\S]*}\)/).join('');
        return code;
    }
    
}