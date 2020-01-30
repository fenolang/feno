import { Configuration } from '@core/main-process';
import fse from 'fs-extra';
import Error from '@syntax/models/Error';
import * as Core from '@core/main-process';
import * as find from '@instances/find';
const base = process.cwd();

interface Response {
    code: string,
    layout: string,
    filename: string
}

export class Transpilation {
    req: Response;
    public res: string = "";
    
    constructor(req: Response) {
        this.req = req;
    }

    async getResponse(config: Configuration) {
        await this.transpile(config)
    }

    transpile(config: Configuration) {
        /** Check if layout exists */
        return new Promise((resolve, reject) => {
            fse.pathExists(`${base}/src/layouts/${this.req.layout}.feno`, (err: string, exists: boolean) => {
                if (err) return console.error(err);
                if (exists) {
                    /** Read the layout content */
                    fse.readFile(`${base}/src/layouts/${this.req.layout}.feno`, 'utf8', async (err: string, data: string) => {
                        if (err) return console.error(err);
                        // If the appView() function is already declared
                        if (find.doc(data)) {
                            if (/appView\(\)/g.test(data)) {
                                // Transpile layout content
                                //data = await Core.Process(data, 'script', this.req.filename);
                                data = await Core.Process({
                                    code: data,
                                    type: 'script',
                                    filename: this.req.filename,
                                    config: config
                                })
                                data = data.split('<body>').pop().split('</body>')[0];
                                // Set layout to page
                                let page_content: string = this.req.code.match(/doc: ?{([\s\S]*?)}/)[1];
                                let layout_content: string = data.replace(/appView\(\)/, page_content);
                                this.req.code = this.req.code.replace(/doc: ?{([\s\S]*?)}/, `doc: {${layout_content}}`)
                                this.res = this.req.code;
                                resolve();
                            } else {
                                new Error({
                                    text: 'appView() function was not declared!',
                                    at: `/layouts/${this.req.layout}.feno`,
                                    solution: `Declare appView() function in your layouts.`,
                                    info: 'http://fenolang.org/docs/layouts'
                                })
                            }
                        } else {
                            new Error({
                                text: "Document instance was not found!",
                                at: `/layouts/${this.req.layout}.feno`,
                                solution: `Declare the Doc Instance inside ${this.req.layout}.feno layout.`,
                                info: "http://fenolang.org/docs/doc_instance"
                            })
                        }
                    })
                } else {
                    new Error({
                        text: 'The layout was not found!',
                        at: `${this.req.filename}.feno`,
                        solution: `Don't call non existent layouts! Create the ${this.req.layout} layout to continue.`,
                        info: 'http://fenolang.org/docs/layouts'
                    })
                }
            })    
        })
    }
}