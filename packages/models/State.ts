import Error from './Error'
import * as find from '@utils/find'

interface Request {
    code: string,
    filename: string
}

export default class State {
    public req: Request

    constructor(req: Request) {
        this.req = req;
    }

    public async process() {
        // # Check if a State property is declared
        if (find.state(this.req.code)) {
            let all_modificators = this.req.code.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/g);
            for await (let modificator of all_modificators) {
                // # Get state properties
                let modificator_body = modificator.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/)[0]
                let name = modificator.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/)[1]
                let value = modificator.match(/\bdeclare (.*?) (.*?|[\s\S]*?)\n?as State/)[2]

                let interpolation = `{{ ?(${name}(\\[[0-9]\\])?(\\..*)?) ?}}`
                let regex = new RegExp(interpolation, 'g')
                var reactive: String = ""
                // # Check if a variable is being called on the document instance
                if (regex.test(this.req.code)) {
                    let matches = this.req.code.match(regex)
                    for await (let match of matches) {
                        let body = new RegExp(interpolation)
                        let elements = match.match(body)
                        // Replace interpolation
                        this.req.code = this.req.code.replace(elements[0], `<slot name="${elements[1]}"></slot>`)
                        // Set setters
                        let setter = `document.querySelector('[name="${elements[1]}"]').innerHTML = _${elements[1]};`
                        reactive += `\n${setter}\n`
                        this.req.code = this.req.code.replace(/<script>([\s\S]*?)<\/script>/, `<script>$1\n${setter}</script>`)
                    }
                }

                this.req.code = this.req.code.replace(modificator_body, `var _${name} = ${value};\nObject.defineProperty(this, '${name}', {
                    enumerable: true,
                    get: function() { return _${name}; },
                    set: function(v) { _${name} = v;\n${reactive}\n}
                })`)
            }
        }
    }
}