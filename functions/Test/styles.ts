import fse from 'fs-extra';
import path from 'path';
import Error from '@syntax/models/Error';
import { getPublic } from '@config/env';

function showResult(filename: string, exists: boolean): void {
    if (exists)
        console.log(`${filename} path: Works without any problem!`);
    else
        console.log(`${filename} path: Doesn't works! :(`);
}

export function checkStylesPaths(content: [string]) {
    if (content && content.length) {
        content.forEach(filename => {
            if (/\.\//.test(filename)) { // If the path is outside of /css folder
                fse.pathExists(path.join(getPublic(),filename),(err: string, exists: boolean) => {
                    if (err) return console.error(err);
                    showResult(filename, exists)
                })
            } else {
                fse.pathExists(path.join(getPublic(), `/css/${filename}`), (err: string, exists: boolean) => {
                    if (err) return console.error(err);
                    showResult(filename, exists)
                })
            }
        })
    } else {
        new Error({
            text: "checkStylesPaths() function needs an array of paths!",
            at: "index.js",
            solution: "Send an array of paths as a param of checkStylesPaths() function",
            info: "No available for now"
        })
    }
}