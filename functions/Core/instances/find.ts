export function head(code: string): boolean {
    if (/head: ?\n?.*?{[\s\S]*?}/.test(code)) // Si se ha declarado la instancia head
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