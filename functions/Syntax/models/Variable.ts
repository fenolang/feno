interface Params {
    type: string;
    name: string;
    value: string;
}

export default class Variable {
    type: string = "";
    name: string = "";
    value: string = "";

    constructor(instance:Params) {
        this.type = instance.type;
        this.name = instance.name;
        this.value = instance.value;
    }
}