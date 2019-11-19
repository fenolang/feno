const fse = require('fs-extra');
const path = require('path');
const base = process.cwd();

const Core = require('./main-process');
const Components = require('./components'); // Módulo $Watch para componentes

module.exports = {
    watch: async () => {
        await $watchDeletedStyles();
        await $watchDeletedScripts();
        await $watchStyles();
        await $watchChanges();
        await Components.$Watch();
        console.log(`< \u{1F33B}  Compiled Successfully!    `);
        return 'yes';
    }
};

function $watchChanges() {
    fse.readdir(`${base}/src/scripts`, (err: string, files: string[]): boolean => {
        files.forEach(file => {
            let ext: string = path.extname(file);
            if (ext === '.darl') {
                fse.readFile(`${base}/src/scripts/${file}`, 'utf8', async (err: string, data: string) => {
                    let basename: string = path.basename(file, path.extname(file));
                    let content: string = await Core.Process(data, 'script', basename);
                    fse.writeFile(
                    /*`./public/${basename}.html`*/
                    path.join(path.dirname(require.resolve('graphtml')),`/public/${basename}.html`),
                    content, (err: string) => {
                        if (err) throw err;
                    });
                });
            }
        });
        return true;
    });
}

function $watchDeletedScripts() {
    fse.readdir(
        /*'./public',*/
        path.join(path.dirname(require.resolve('graphtml')),`/public`),
        (err: string, files: string[]): boolean => {
        files.forEach(file => {
            if (file != 'css') {
                let ext: string = path.extname(file);
                let basename: string = path.basename(file, path.extname(file));
                if (ext == '.html') {
                    fse.pathExists(`${base}/src/scripts/${basename}.darl`, (err: string, exists: boolean) => {
                        if (!exists) {
                            fse.remove(
                                /*`./public/${file}`*/
                                path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),
                                (err: string) => {
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
    fse.readdir(`${base}/src/styles`, (err: string, files: string[]): boolean => {
        if (err) console.error(err);
        files.forEach(file => {
            let ext: string = path.extname(file);
            if (ext == '.css') {
                fse.copyFile(`${base}/src/styles/${file}`,
                /*`./public/css/${file}`,*/
                path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),
                (err: string) => {
                    if (err) console.error(err);
                });
            }
        });
        return true;
    });
}

function $watchDeletedStyles() {
    fse.readdir(
        /*'./public/css',*/
        path.join(path.dirname(require.resolve('graphtml')),`/public/css`),
        (err: string, files: string[]): boolean => {
        if (err) console.error(err);
        files.forEach(file => {
            let ext: string = path.extname(file);
            if (ext == '.css') {
                fse.pathExists(`${base}/src/styles/${file}`, (err: string, exists: boolean) => {
                    if (err) console.error(err);
                    if (!exists) {
                        fse.remove(
                            /*`./public/css/${file}`,*/
                            path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),
                            (err: string) => {
                            if (err) console.error(err);
                        });
                    }
                });
            }
        });
        return true;
    });
}

export { }