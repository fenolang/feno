import express from 'express';
import { getPublic } from '@config/env';
const app = express();

export function $on() {
    let port: number = 8080;
    app.use('/',express.static(
        getPublic()
    ));
    app.listen(port);

    console.log(`Server listening on ${port}!`)
}