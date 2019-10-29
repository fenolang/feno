interface InstanceBody {
    name: string,
    structure: string,
    inline: boolean,
    content: string
}

export default class Instance {

    name:string = "";
    type:string = "";
    content:string = "";
    inline:boolean = false;

    constructor(body:InstanceBody) {
        this.name = body.name;
        this.type = body.type;
        this.content = body.content;
        this.inline = body.inline;
    }


}