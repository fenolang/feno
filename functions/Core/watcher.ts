import { getPublic } from '@config/env';
import * as Core from '@core/main-process';
import * as find from '@core/instances/find';
import Error from '@syntax/models/Error';
import fse from 'fs-extra';
import path from 'path';
const base = process.cwd();

export async function watch () {
    return new Promise(async (resolve, reject) => {
        $watchDeletedStyles();
        $watchDeletedScripts();
        $watchStyles();
        await $watchChanges();
        resolve();
        console.log("");
        console.log(`< \u{1F33B}  Compiled Successfully!    `);    
    })
}

function $watchChanges() {
    return new Promise(async (resolve, reject) => {
        fse.readdir(`${base}/src/pages`, (err: string, files: string[]) => {
            files.forEach(file => {
                let ext: string = path.extname(file);
                if (ext === '.feno') {
                    fse.readFile(`${base}/src/pages/${file}`, 'utf8', async (err: string, data: string) => {
                        let basename: string = path.basename(file, path.extname(file));
                        if (find.doc(data)) {
                            let content: string = "";
                            content = await Core.Process(data, 'script', basename);
                            fse.writeFile(path.join(getPublic(), `${basename}.html`), content, (err: string) => {
                                if (err) throw err;
                                resolve();
                            });
                        } else {
                            new Error({
                                text: "Doc instance was not found!",
                                at: basename,
                                solution: `Declare the Doc Instance inside ${basename}.feno file`,
                                info: "http://fenolang.org/docs/doc_instance"
                            })
                        }
                    });
                } else {
                }
            });
        });
    })
}

function $watchDeletedScripts() {
    fse.readdir(
        /*'./public',*/
        /*path.join(path.dirname(require.resolve('graphtml')),`/public`),*/
        getPublic(),
        (err: string, files: string[]): boolean => {
        files.forEach(file => {
            if (file != 'css') {
                let ext: string = path.extname(file);
                let basename: string = path.basename(file, path.extname(file));
                if (ext == '.html') {
                    fse.pathExists(`${base}/src/pages/${basename}.feno`, (err: string, exists: boolean) => {
                        if (!exists) {
                            fse.remove(
                                /*`./public/${file}`*/
                                /*path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),*/
                                path.join(getPublic(),`/${file}`),
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
                /*path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),*/
                path.join(getPublic(),`/css/${file}`),
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
        /*path.join(path.dirname(require.resolve('graphtml')),`/public/css`),*/
        path.join(getPublic(),'/css'),
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
                            /*path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),*/
                            path.join(getPublic(),`/${file}`),
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

export { };
