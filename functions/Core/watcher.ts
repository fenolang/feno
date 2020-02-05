import { getPublic } from '@config/env';
import { Configuration } from '@core/main-process';
import * as find from '@core/instances/find';
import * as Core from '@core/main-process';
import * as Components from '@feno/components';
import Error from '@syntax/models/Error';
import fse from 'fs-extra';
import path from 'path';
const base = process.cwd();

export async function watch (config: Configuration) {
    return new Promise(async (resolve, reject) => {
        $watchDeletedStyles(config);
        $watchDeletedScripts(config);
        $watchStyles(config);
        await Components.transpile(config);
        await $watchChanges(config);
        resolve();
        console.log("");
        console.log(`< \u{1F33B}  Compiled Successfully!    `);    
    })
}

function $watchChanges(config: Configuration) {
    return new Promise(async (resolve, reject) => {
        fse.readdir(`${base}/src/pages`, (err: string, files: string[]) => {
            if (files && files.length) {
                files.forEach(file => {
                    let ext: string = path.extname(file);
                    if (ext === '.feno') {
                        fse.readFile(`${base}/src/pages/${file}`, 'utf8', async (err: string, data: string) => {
                            let basename: string = path.basename(file, path.extname(file));
                            if (find.doc(data)) {
                                let content: string = "";
                                //content = await Core.Process(data, 'script', basename);
                                content = await Core.Process({
                                    code: data,
                                    type: 'script',
                                    filename: basename,
                                    config: config
                                })
                                fse.writeFile(path.join(getPublic(), `${basename}.html`), content, (err: string) => {
                                    if (err) throw err;
                                    resolve();
                                });
                            } else {
                                new Error({
                                    text: "Document instance was not found!",
                                    at: `${basename}.feno`,
                                    solution: `Declare the Doc Instance inside ${basename}.feno file`,
                                    info: "https://fenolang.herokuapp.com/docs/doc_instance"
                                })
                            }
                        });
                    } else {
                    }
                });
            } else { // If there are no pages
                new Error({
                    text: "There are no pages in this project!",
                    at: `index.js`,
                    solution: "Create an index.feno file in /pages folder for start",
                    info: "https://fenolang.herokuapp.com/docs/installation"
                })
            }
        });
    })
}

function $watchDeletedScripts(config: Configuration) {
    fse.readdir(getPublic(), (err: string, files: string[]): boolean => {
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

function $watchStyles(config: Configuration) {
    fse.readdir(`${base}/src/${config.stylesDir}`, (err: string, files: string[]): boolean => {
        if (err) console.error(err);
        if (files && files.length) {
            files.forEach(file => {
                let ext: string = path.extname(file);
                if (ext == '.css') {
                    fse.copyFile(`${base}/src/${config.stylesDir}${file}`,
                        /*`./public/css/${file}`,*/
                        /*path.join(path.dirname(require.resolve('graphtml')),`/public/${file}`),*/
                        path.join(getPublic(), `/css/${file}`),
                        (err: string) => {
                            if (err) console.error(err);
                        });
                }
            });
        }
        return true;
    });
}

function $watchDeletedStyles(config: Configuration) {
    fse.readdir(path.join(getPublic(),'/css'), (err: string, files: string[]): boolean => {
        if (err) console.error(err);
        if (files && files.length) {
            files.forEach(file => {
                let ext: string = path.extname(file);
                if (ext == '.css') {
                    fse.pathExists(`${base}/src/${config.stylesDir}${file}`, (err: string, exists: boolean) => {
                        if (err) console.error(err);
                        if (!exists) {
                            fse.remove(path.join(getPublic(), `/${file}`), (err: string) => {
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

export { };

