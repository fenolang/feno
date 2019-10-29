const fse = require('fs-extra');
const path = require('path');
const emoji = require('node-emoji');

const Core = require('./main-process');
const Components = require('./components'); // Módulo $Watch para componentes

function msg(text:string):void {
    let emoji_msg:string = emoji.emojify(text,null,null);
    console.log(emoji_msg);
}

module.exports = {
    watch: async () => {
        await $watchDeletedStyles();
        await $watchDeletedScripts();
        await $watchStyles();
        await $watchChanges();
        await Components.$Watch();
        msg(`< \u{1F33B}  Compiled Successfully!    `);
        return 'yes';
    }
};

function $watchChanges() {
    fse.readdir('./src/scripts', (err:string, files:string[]):boolean => {
        files.forEach(file => {
            let ext:string = path.extname(file);
            if (ext === '.oleo') {
                fse.readFile(`./src/scripts/${file}`, 'utf8', async (err:string, data:string) => {
                    let basename:string = path.basename(file, path.extname(file));
                    let content:string = await Core.Process(data, 'script', basename);
                    fse.writeFile(`./app/public/${basename}.html`, content, (err:string) => {
                        if (err) throw err;
                    });
                });
            }
        });
        return true;
    });
}

function $watchDeletedScripts() {
    fse.readdir('./app/public', (err:string, files:string[]):boolean => {
        files.forEach(file => {
            if (file != 'css') {
                let ext:string = path.extname(file);
                let basename:string = path.basename(file, path.extname(file));
                if (ext == '.html') {
                    fse.pathExists(`./src/scripts/${basename}.oleo`, (err:string, exists:boolean) => {
                        if (!exists) {
                            fse.remove(`./app/public/${file}`, (err:string) => {
                                if (err) console.error(err);
                            });
                        }
                    });
                }
            }
        });
        return true;
    });
}

function $watchStyles() {
    fse.readdir('./src/styles', (err:string, files:string[]):boolean => {
        if (err) console.error(err);
        if (files.length) {
            files.forEach(file => {
                let ext:string = path.extname(file);
                if (ext == '.css') {
                    fse.copyFile(`./src/styles/${file}`, `./app/public/css/${file}`, (err:string) => {
                        if (err) console.error(err);
                    });
                }
            });
        }
        return true;
    });
}

function $watchDeletedStyles() {
    fse.readdir('./app/public/css', (err:string, files:string[]):boolean => {
        if (err) console.error(err);
        if (files.length) {
            files.forEach(file => {
                let ext:string = path.extname(file);
                if (ext == '.css') {
                    fse.pathExists(`./src/styles/${file}`, (err:string, exists:boolean) => {
                        if (err) console.error(err);
                        if (!exists) {
                            fse.remove(`./app/public/css/${file}`, (err:string) => {
                                if (err) console.error(err);
                            });
                        }
                    });
                }
            });
        }
        return true;
    });
}

export {}