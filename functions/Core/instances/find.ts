export function head(code: string): boolean {
    if (/head: ?\n?.*?{[\s\S]*?\n}/.test(code)) // Si se ha declarado la instancia head
        return true
    else
        return false
}

export function transpiledHead(code: string): boolean {
    if (/<head>[\s\S]*<\/head>/.test(code))
        return true
    else
        return false
}

export function noscript(code: string): boolean {
    if (/noscript: ?{([\s\S]*?)}/.test(code))
        return true
    else
        return false
}

export function doc(code: string): boolean {
    if (/doc: ?\n?.*?{[\s\S]*?}/.test(code))
        return true
    else
        return false
}

export function component(code: string): boolean {
    if (/declare Component ?\('(.*?)', ?{([\s\S]*?)}\)/.test(code))
        return true
    else
        return false 
}

export function variable(code: string): boolean {
    if (/def (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/.test(code)) 
        return true
    else
        return false
}

export function constant(code: string): boolean {
    if (/const (String|Number|Boolean|Array|Object|Any) (.*?) ?= ?(.*?|[\s\S]*?);/.test(code))
        return true
    else
        return false
}