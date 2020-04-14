import { Program } from './Program'
import { Configuration } from './Program';
import fse from 'fs-extra';
import Error from '@models/Error';
import * as find from '@utils/find';
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
                        if (find.render(data)) {
                            if (/appView\(\)/g.test(data)) {
                                // Transpile layout content
                                let transpilation = new Program({
                                    type: "document",
                                    filename: this.req.filename,
                                    config: config,
                                    code: data
                                })
                                data = await transpilation.exec()
                                data = data.split('<body>').pop().split('</body>')[0];
                                // Set layout to page
                                let page_content: string = this.req.code.match(/<body>([\s\S]*?)<\/body>/)[1];
                                let layout_content: string = data.replace(/appView\(\)/, page_content);
                                this.req.code = this.req.code.replace(/<body>([\s\S]*?)<\/body>/, `<body>${layout_content}</body>`)
                                this.res = this.req.code;
                                resolve();
                            } else {
                                new Error({
                                    text: 'appView() function was not declared!',
                                    at: `/layouts/${this.req.layout}.feno`,
                                    solution: `Declare appView() function in your layouts.`,
                                    info: 'https://fenolang.herokuapp.com/docs/layouts'
                                })
                            }
                        } else {
                            new Error({
                                text: "Render tag was not found!",
                                at: `/layouts/${this.req.layout}.feno`,
                                solution: `Declare the render tag inside ${this.req.layout}.feno layout.`,
                                info: "https://fenolang.herokuapp.com/docs/doc_instance"
                            })
                        }
                    })
                } else {
                    new Error({
                        text: 'The layout was not found!',
                        at: `${this.req.filename}.feno`,
                        solution: `Don't call non existent layouts! Create the ${this.req.layout} layout to continue.`,
                        info: 'https://fenolang.herokuapp.com/docs/layouts'
                    })
                }
            })    
        })
    }
}