import 'module-alias/register'
import clear from 'clear';
import * as listen from '@core/server';

//Modulos
import * as Watcher from '@core/watcher';

clear();

async function main() {
    return new Promise(async (resolve, reject) => {
        await Watcher.watch();
        resolve();
    })
}

async function server() {
    return new Promise((resolve, reject) => {
        listen.$on();
        resolve();
    })
}

module.exports = {
    run: () => {
        server();
        main();
    }
}

export async function run() {
    await main();
    await server();
}

run();