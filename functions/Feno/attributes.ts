
export function transpile(code: string): string { 
    code = code.replace(/Click="(.*?)"/,'onclick="$1"');
    code = code.replace(/keyUp="(.*?)"/,'onkeyup="$1"');
    code = code.replace(/keyDown="(.*?)"/,'onkeydown="$1"');
    code = code.replace(/newTab/, 'target="_blank"');
    code = code.replace(/Val="(.*?)"/,'value="$1"');
    code = code.replace(/To="(.*?)"/,'href="$1"');

    return code;
}