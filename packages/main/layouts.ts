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

    async transpile(config: Configuration) {
        let layout_exists = await fse.pathExists(`${base}/src/layouts/${this.req.layout}.feno`)
        if (layout_exists) {
            // Read the layout content
            let layout_data = await fse.readFile(`${base}/src/layouts/${this.req.layout}.feno`, "utf8")
            if (find.render(layout_data)) {
                // Check if appView function is being called                
                if (/appView\(\)/g.test(layout_data)) {
                    let transpilation = new Program({
                        type: "layout",
                        filename: this.req.filename,
                        config: config,
                        code: layout_data
                    })
                    await transpilation.execute()
                    layout_data = transpilation.result
                    layout_data = layout_data.split('<body>').pop().split('</body>')[0];
                    // Set layout to page
                    let page_content: string = this.req.code.match(/<body>([\s\S]*?)<\/body>/)[1];
                    let layout_content: string = layout_data.replace(/appView\(\)/, page_content);
                    this.req.code = this.req.code.replace(/<body>([\s\S]*?)<\/body>/, `<body>${layout_content}</body>`)
                    this.res = this.req.code;
                } else
                    new Error({
                        text: 'appView() function was not declared!',
                        at: `/layouts/${this.req.layout}.feno`,
                        solution: `Declare appView() function in your layouts.`,
                        info: 'https://fenolang.herokuapp.com/docs/layouts'
                    })
            } else
                new Error({
                    text: "Render tag was not found!",
                    at: `/layouts/${this.req.layout}.feno`,
                    solution: `Declare the render tag inside ${this.req.layout}.feno layout.`,
                    info: "https://fenolang.herokuapp.com/docs/doc_instance"
                })
        } else
            new Error({
                text: 'The layout was not found!',
                at: `${this.req.filename}.feno`,
                solution: `Don't call non existent layouts! Create the ${this.req.layout} layout to continue.`,
                info: 'https://fenolang.herokuapp.com/docs/layouts'
            })
    }
}