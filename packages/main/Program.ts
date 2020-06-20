const beautify = require('js-beautify').html;
const beautifyjs = require('js-beautify');
const base = process.cwd();
import { getPublic } from '@config/env';
import Error from '@models/Error';
import Gist from '@root/packages/models/Gist';
// Models
import Script from '@models/Script';
import * as find from '@utils/find';
import fse from 'fs-extra';
import path from 'path';
import { SetPackages } from "./packages"
import * as scripts from './scripts';
import * as styles from './styles';
import * as layouts from './layouts';



interface Body {
    type: string,
    filename: string,
    config: Configuration,
    code: string,
    head: string,
    body: string
}

export interface Request {
    type: string,
    filename: string,
    config: Configuration,
    code: string,
    html?: string
}

export interface Configuration {
    port: number,
    stylesDir: string,
    scriptsDir: string,
    outDir: string,
    noscript: string
}

export class Program {

    req: Request = {
        type: "",
        filename: "",
        code: "",
        html: `<!DOCTYPE html>\n<html lang="es">\n<head>\n</head>\n<body></body>\n<script>\n</script>\n</html>`,
        config: {
            port: 0,
            scriptsDir: "",
            stylesDir: "",
            outDir: "",
            noscript: ""
        }
    }

    constructor (req: Request) {
        this.req.type = req.type
        this.req.filename = req.filename
        this.req.config = req.config
        this.req.code = req.code
    }

    get result(): string {
        return this.req.html
    }

    public async execute() {
        if (this.req.type == "page") {
            this.checkExistance()
            await this.main()
            await this.save()
        } else if (this.req.type == "component") {
            this.checkExistance()
            await this.main()
        } else if (this.req.type == "layout") {
            this.checkExistance()
            await this.main()
        }
    }

    public async test() {
        if (this.req.type == "page" || this.req.type == "component") {
            this.checkExistance()
            await this.main()
        } else if (this.req.type == "script") {
            let script = new Script()
            script.req = {
                code: this.req.code,
                filename: this.req.filename
            }
            await script.process()
            this.req.code = script.req.code
        }
    }

    // # Prepare html document for result
    private async main() {
        return new Promise(async (resolve, reject) => {

            // Get defined body
            let body: string = this.req.code.match(/<render>([\s\S]*?)<render>/)[1]
            this.req.html = this.req.html.replace(/<body>([\s\S]*?)<\/body>/, `<body>$1${body}</body>`)
            this.req.code = this.req.code.replace(/<render>([\s\S]*?)<render>/, "")

            // Get title
            if (/set title ['|"|`](.*?)['|"|`]/.test(this.req.code)) {
                let title: string = this.req.code.match(/set title ['|"|`](.*?)['|"|`]/)[1]
                this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1<title>${title}</title></head>`)
                this.req.code = this.req.code.replace(/set title ['|"|`](.*?)['|"|`]/, "")
            }

            // Get defined meta
            if (/<meta>([\s\S]*?)<meta>/.test(this.req.code)) {
                let meta: string = this.req.code.match(/<meta>([\s\S]*?)<meta>/)[1]

                meta = meta.replace(/\bcharset ['|"|`](.*?)['|"|`]/g, `<meta charset="$1">`)
                meta = meta.replace(/\butf8/g, `<meta charset="utf-8">`)
                meta = meta.replace(/\bfb-(.*?) ['|"|`](.*?)['|"|`]/g, '\t<meta property="og:$1" content="$2">')
                meta = meta.replace(/\btwitter-(.*?) ['|"|`](.*?)['|"|`]/g, '\t<meta property="twitter:$1" content="$2">')
                meta = meta.replace(/\bviewport/g, '\t<meta name="viewport" content="width=device-width, initial-scale=1">')
                meta = meta.replace(/\b(.*?) ['|"|`](.*?)['|"|`]/g, `<meta name="$1" content="$2">`)

                this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n${meta}</head>`)
                this.req.code = this.req.code.replace(/<meta>([\s\S]*?)<meta>/, "")
            } else {
                try {
                    // Check if a meta file exists
                    let exists = await fse.pathExists(`${base}/src/meta/_${this.req.filename}.feno`)
                    if (exists) {
                        // Read meta file
                        let metafile_content = await fse.readFile(`${base}/src/meta/_${this.req.filename}.feno`, 'utf8')
                        let meta = transpile_metafile(metafile_content)

                        // Apply transpiled content
                        this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n${meta}</head>`)
                    }

                    function transpile_metafile(metafile_content: string) {
                        if (metafile_content && metafile_content.length && /<meta>([\s\S]*?)<meta>/.test(metafile_content)) {
                            let meta: string = metafile_content.match(/<meta>([\s\S]*?)<meta>/)[1]

                            meta = meta.replace(/\bcharset ['|"|`](.*?)['|"|`]/g, `<meta charset="$1">`)
                            meta = meta.replace(/\butf8/g, `<meta charset="utf-8">`)
                            meta = meta.replace(/\bfb-(.*?) ['|"|`](.*?)['|"|`]/g, '\t<meta property="og:$1" content="$2">')
                            meta = meta.replace(/\btwitter-(.*?) ['|"|`](.*?)['|"|`]/g, '\t<meta property="twitter:$1" content="$2">')
                            meta = meta.replace(/\bviewport/g, '\t<meta name="viewport" content="width=device-width, initial-scale=1">')
                            meta = meta.replace(/\b(.*?) ['|"|`](.*?)['|"|`]/g, `<meta name="$1" content="$2">`)

                            return meta;
                        }
                    }
                } catch(err) {
                    console.error(err)
                }
            }

            // Get defined noscript
            if (/<noscript>([\s\S]*?)<noscript>/.test(this.req.code)) {
                let noscript: string = this.req.code.match(/<noscript>([\s\S]*?)<noscript>/)[1]
                this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n<noscript>${noscript}</noscript></head>`)
                this.req.code = this.req.code.replace(/<noscript>([\s\S]*?)<noscript>/, "")
            }

            // Transpile imports
            await this.externalSources()

            // Transpile attributes
            this.attributes()

            // Get all imported styles
            if (/<link rel="stylesheet" href=".*?">/.test(this.req.code)) {
                let links = this.req.code.match(/<link rel="stylesheet" href=".*?">/g)
                this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n\n<!-- CSS --></head>`)
                links.forEach(link => {
                    this.req.code = this.req.code.replace(link, "")
                    this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n${link}</head>`)
                })
            }

            // Get all imported scripts
            if (/<script src=".*?"><\/script>/.test(this.req.code)) {
                let imports = this.req.code.match(/<script src=".*?"><\/script>/g)
                this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n\n<!-- JS SCRIPTS --></head>`)
                imports.forEach(importt => {
                    this.req.code = this.req.code.replace(importt, "")
                    this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n${importt}</head>`)
                })
            }

            // Get and set inline styles
            if (/<style>[\s\S]*<\/style>/.test(this.req.html)) {
                let inline_styles = this.req.html.match(/<style>[\s\S]*?<\/style>/)[0]
                this.req.html = this.req.html.replace(/<style>[\s\S]*?<\/style>/, "")
                this.req.html = this.req.html.replace(/<head>([\s\S]*?)<\/head>/, `<head>$1\n\n${inline_styles}</head>`)
            }

            // Set packages
            if (this.req.type == "page")
                this.req.html = await SetPackages(this.req.html)

            // Get and set layout
            await this.layouts(this.req.config)
            // Delete possible layout declaration
            this.req.code = this.req.code.replace(/set layout ['|"|`](.*?)['|"|`]/, "")

            // Transpile script files
            let script = new Script()
            await script.start(this.req.config)

            // Get and set script tag
            this.req.html = this.req.html.replace(/<script>[\s\S]*<\/script>/, `<script>${this.req.code}</script>`)

            // Transpile javascript code in script tag
            let gist = new Gist({ filename: this.req.filename, html: this.req.html })
            gist.variables()
            gist.constants()
            gist.state_properties()
            await gist.vectors()
            this.req.html = gist.getContent()

            let script_tag = this.req.html.match(/<script>([\s\S]*)<\/script>/)[1]
            this.req.html = this.req.html.replace(/<script>[\s\S]*<\/script>/, `<script>${beautifyjs(script_tag)}</script>`)

            resolve()

        })
    }

    public async layouts(config: Configuration) {
        return new Promise(async (resolve, reject) => {
            // If the instance has a layout declared
            if (/set layout ['|"|`](.*?)['|"|`]/.test(this.req.code)) {
                let layout_name: string = this.req.code.match(/set layout ['|"|`](.*?)['|"|`]/)[1]
                // If the layout property is not empty
                if (layout_name && layout_name.length) {
                    let layouts_instance = new layouts.Transpilation({
                        code: this.req.html,
                        layout: layout_name,
                        filename: this.req.filename
                    })
                    await layouts_instance.getResponse(config)
                    this.req.html = beautify(layouts_instance.res) 
                    resolve()
                } else {
                    new Error({
                        text: 'Layout property has no content!',
                        at: `/pages/${this.req.filename}.feno`,
                        solution: "You should call a layout inside the layout property.",
                        info: `https://fenolang.herokuapp.com/docs/layouts`
                    })
                }
            } else {
                resolve()
            }
        })
    }

    private attributes(): void {
        this.req.html = this.req.html.replace(/Click="(.*?)"/g, 'onclick="$1"');
        this.req.html = this.req.html.replace(/keyUp="(.*?)"/g, 'onkeyup="$1"');
        this.req.html = this.req.html.replace(/keyDown="(.*?)"/g, 'onkeydown="$1"');
        this.req.html = this.req.html.replace(/newTab/g, 'target="_blank"');
        this.req.html = this.req.html.replace(/Val="(.*?)"/g, 'value="$1"');
        this.req.html = this.req.html.replace(/To="(.*?)"/g, 'href="$1"');
        this.req.html = this.req.html.replace(/onChange="(.*?)"/g, 'oninput="$1.set(this.value)"');
    }

    private async externalSources() {
        return new Promise((resolve, reject) => {
            this.req.code = styles.$watch(this.req.code)
            this.req.code = scripts.$watch(this.req.code)
            this.req.html = scripts.checkNoScript(this.req)
            resolve()
        })
    }

    // # Check if render tag is declared
    private checkExistance(): void {
        if (!find.render(this.req.code)) {
            new Error({
                text: "Render tag was not found!",
                at: `${this.req.filename}.feno`,
                solution: `Declare the render tag inside ${this.req.filename}.feno file`,
                info: "https://fenolang.herokuapp.com/docs/"
            })
        }
    }

    // # Save transpiled code in a html file
    private async save() {
        return new Promise((resolve, reject) => {
            fse.writeFile(path.join(getPublic(), `${this.req.filename}.html`), this.req.html, (err: string) => {
                if (err) return console.error(err)
                resolve()
            })
        })
    }

}

// # Transpile basic functions
export function functions(code: string): string {
    code = code.replace(/print\((.*?)\)/g, 'console.log($1)')
    code = code.replace(/msg\((.*?)\)/g, 'alert($1)')

    //functions
    code = code.replace(/fun (\S*?) ?(\((.*?)\))? ?{/g, 'function $1($3) {')

    //conditionals
    code = code.replace(/if \(?(.*?)\)? {/g, 'if ($1) {')
    code = code.replace(/elif \(?(.*?)\)? {/g, 'else if ($1) {')

    code = code.replace(/if \(?(.*)\)?/g, 'if ($1)')
    code = code.replace(/elif \(?(.*)\)?/g, 'else if ($1)')

    return code
}