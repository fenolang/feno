/** Styles function */
export function $watch(code:string): string {
    if (code) {
        code = code.replace(/import ['|"|`]\.\/(.*?)\.css['|"|`]/g, `<link rel="stylesheet" href="$1.css">`)
        code = code.replace(/import ['|"|`](.*?)\.css['|"|`]/g, `<link rel="stylesheet" href="/css/$1.css">`)
    }
    return code
}