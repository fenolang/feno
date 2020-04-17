const GREEN = '\x1b[32m'
const BGREEN = "\x1b[42m"
const NORMAL = '\x1b[0m'
const BLACK = "\x1b[30m"
const WHITE = '\x1b[37m'
const BOLD = "\x1b[1m"
const BLUE = '\x1b[34m'
const UNDER = '\x1b[4m'

// # Modules
import { getPublic } from '@config/env';
import http from 'http';
import service from 'node-static';

// # Interfaces
import { Configuration } from '@main/Program';

export default class Server {
    config: Configuration

    constructor(config: Configuration) {
        this.config = config
    }

    public exec() {
        let port: number = this.config.port;
        let folder = new service.Server(getPublic());
        http.createServer((req, res) => {
            req.addListener('end', () => {
                folder.serve(req, res)
            }).resume()
        }).listen(port);

        console.log(`\n${NORMAL}\u{1F98A} \u{1F495} Using ${GREEN}${BOLD}Feno v2.0.0-beta\n${NORMAL}${WHITE}`)
        console.log(`${BGREEN}${BLACK}${BOLD} OK! ${NORMAL}${WHITE} Server listening on: ${GREEN}${UNDER}https://localhost:${port}/${NORMAL}`)
        console.log(`\t${BLACK}Compiled successfully!`)
        console.log(`\n${BOLD}${BLUE}\u{2139}${WHITE} Waiting for file changes`)

    }

}