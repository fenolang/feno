const fse = require('fs-extra');
const path = require('path');
const emoji = require('node-emoji');
const base = process.cwd();

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
    fse.readdir(`${base}/src/scripts`, (err:string, files:string[]):boolean => {
        files.forEach(file => {
            let ext:string = path.extname(file);
            if (ext === '.gh') {
                fse.readFile(`./src/scripts/${file}`, 'utf8', async (err:string, data:string) => {
                    let basename:string = path.basename(file, path.extname(file));
                    let content:string = await Core.Process(data, 'script', basename);
                    fse.writeFile(`./public/${basename}.html`, content, (err:string) => {
                        if (err) throw err;
                    });
                });
            }
        });
        return true;
    });
}

function $watchDeletedScripts() {
    fse.readdir('./public', (err:string, files:string[]):boolean => {
        files.forEach(file => {
            if (file != 'css') {
                let ext:string = path.extname(file);
                let basename:string = path.basename(file, path.extname(file));
                if (ext == '.html') {
                    fse.pathExists(`./src/scripts/${basename}.gh`, (err:string, exists:boolean) => {
                        if (!exists) {
                            fse.remove(`./public/${file}`, (err:string) => {
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
    fse.readdir(`${base}/src/styles`, (err:string, files:string[]):boolean => {
        if (err) console.error(err);
        if (files.length) {
            files.forEach(file => {
                let ext:string = path.extname(file);
                if (ext == '.css') {
                    fse.copyFile(`./src/styles/${file}`, `./public/css/${file}`, (err:string) => {
                        if (err) console.error(err);
                    });
                }
            });
        }
        return true;
    });
}

function $watchDeletedStyles() {
    fse.readdir('./public/css', (err:string, files:string[]):boolean => {
        if (err) console.error(err);
        if (files.length) {
            files.forEach(file => {
                let ext:string = path.extname(file);
                if (ext == '.css') {
                    fse.pathExists(`./src/styles/${file}`, (err:string, exists:boolean) => {
                        if (err) console.error(err);
                        if (!exists) {
                            fse.remove(`./public/css/${file}`, (err:string) => {
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