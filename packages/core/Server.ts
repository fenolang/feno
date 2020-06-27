// # Modules
import { getPublic } from '@config/env'
import http from "http"
import handler from "serve-handler"

// # Interfaces
import { Configuration } from '@main/Program';

export default class Server {
    config: Configuration

    constructor(config: Configuration) {
        this.config = config
    }

    public exec() {
        let port: number = this.config.port
        http.createServer(async (req, res) => {
            return await handler(req, res, {
                cleanUrls: true,
                public: getPublic()
            })
        }).listen(port)
    }

}