const BGRED = '\x1b[41m';
const WHITE = '\x1b[37m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m'
const YELLOW = '\x1b[33m';
const NORMAL = '\x1b[0m';
const UNDER = '\x1b[4m'
const BLACK = "\x1b[30m"
const BOLD = "\x1b[1m"

import clear from "@config/clear"

interface Response {
    text: string,
    at: string,
    solution: string,
    info: string
}

export default class Error {
    msg: string = "";
    text: string = "";
    file: string = "";
    solution: string = "";
    info: string = "";

    constructor(response: Response) {
        this.text = response.text;
        this.file = response.at;
        this.solution = response.solution;
        this.info = response.info;
        this.formatMessage();
        this.show();
    }

    formatMessage(): void {
        this.msg += `${NORMAL}${RED}🤯 💔 Unfortunately something unexpected happened...\n\n`
        this.msg += `${BGRED}${BLACK}${BOLD} Error! ${NORMAL}${RED} ${this.text}${NORMAL}\n`
        this.msg += `\t${UNDER}at:${NORMAL} ${this.file} file\n`
        this.msg += `\t${UNDER}${YELLOW}Solution:${NORMAL} ${YELLOW}${this.solution}${NORMAL}\n`
        this.msg += `\t${UNDER}${BLUE}More Info:${NORMAL} ${GREEN}${this.info}${NORMAL}\n`
    }

    show(): void {
        clear()
        console.log(this.msg);
        process.exit(1);
    }
}