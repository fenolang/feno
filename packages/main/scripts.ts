import Error from '@models/Error';
import * as find from '@utils/find';
import { Request } from './Program';

export function checkNoScript(req: Request): string {
    if (!find.noscript(req.html)) {
        /** If a noscript is defined in configuration */
        if (req.config.noscript && req.config.noscript.length && req.config.noscript != "") {
            req.html = req.html.replace(/<head>([\s\S]*)<\/head>/, `<head>$1\n<noscript>${req.config.noscript}</noscript></head>`)
        }
    }
    return req.html;
}

export function $watch(code: string): string {
    if (code) {
        code = code.replace(/import ['|"|`]\.\/(.*?)\.feno['|"|`]/g, `<script src="$1.js"></script>`)
        code = code.replace(/import ['|"|`](.*?)\.feno['|"|`]/g, `<script src="/scripts/$1.js"></script>`)
    }
    return code;
}