const fse = require('fs-extra');
const clear = require('clear');
const listen = require('./functions/Core/server');

//Modulos
const Core = require('./functions/Core/main-process');
const Watcher = require('./functions/Core/watcher');

clear();

async function main() {
    await Watcher.watch();
}

async function server() {
    await listen.$on();
    console.log("Server Running on { 8080 } port!");
}

server();
main();

export {}