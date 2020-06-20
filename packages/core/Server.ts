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
    }

}