import fse from 'fs-extra'

interface File {
    route: string,
    content: string
}

interface FolderOnSameRoute {
    route: string,
    names: string[]
}

interface Folder {
    path: string
}

export function createFoldersOnPath(folders: FolderOnSameRoute) {
    return new Promise((resolve, reject) => {
        folders.names.forEach(name => {
            fse.mkdirs(`${folders.route}/${name}`, (err: string) => {
                if (err) return console.error(err);
            })
        })
        resolve();
    })
}

export function createFolders(folders: Folder[]) {
    return new Promise((resolve, reject) => {
        folders.forEach(folder => {
            fse.mkdirs(`${folder.path}`, (err: string) => {
                if (err) return console.error(err);
            })
        })
        resolve();
    })
}

export function createFolder(folder: string) {
    return new Promise ((resolve, reject) => {
        fse.mkdirs(`${folder}`, (err: string) => {
            if (err) return console.error(err);
        })
        resolve();
    })
}

export function writeFiles(files: File[]) {
    return new Promise((resolve, reject) => {
        files.forEach(file => {
            fse.writeFile(file.route, file.content, (err: string) => {
                if (err) return console.error(err);
            })
        })
        resolve();
    })
}

export function writeFile(file: File) {
    return new Promise((resolve, reject) => {
        fse.writeFile(file.route, file.content, (err: string) => {
            if (err) return console.error(err);
        })
        resolve();
    })
}