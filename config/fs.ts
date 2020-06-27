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

export async function createFoldersOnPath(folders: FolderOnSameRoute) {
    for await (let name of folders.names) {
        await fse.mkdirs(`${folders.route}/${name}`)
    }
}

export async function createFolders(folders: Folder[]) {
    for await (let folder of folders) {
        await fse.mkdirs(`${folder.path}`)
    }
}

export async function createFolder(folder: string) {
    await fse.mkdirs(`${folder}`)
}

export async function writeFiles(files: File[]) {
    for await (let file of files) {
        await fse.writeFile(file.route, file.content)
    }
}

export async function writeFile(file: File) {
    await fse.writeFile(file.route, file.content)
}