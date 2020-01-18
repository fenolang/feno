import { getPublic } from '@config/env';
import http from 'http';
import service from 'node-static';

export function $on() {
    let port: number = 8080;
    let file = new service.Server(getPublic());
    http.createServer((req, res) => {
        req.addListener('end', () => {
            // I dont know
            file.serve(req, res);
        }).resume();
    }).listen(port);

    console.log(`Server listening on ${port}!`)    
}