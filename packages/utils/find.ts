export function render(code: string): boolean {
    if (/<render>[\s\S]*<render>/.test(code))
        return true
    else
        return false
}

export function meta(code: string): boolean {
    if (/<meta>[\s\S]*<meta>/.test(code))
        return true
    else
        return false
}

export function noscript(code: string): boolean {
    if (/<noscript>[\s\S]*<\/noscript>/.test(code))
        return true
    else
        return false
}

export function component(code: string): boolean {
    if (/<component name=".*?">[\s\S]*<component>/.test(code))
        return true
    else
        return false
}

export function variable(code: string): boolean {
    if (/\bdef (.*?) (.*?|[\s\S]*?)\n?as (String|Number|Boolean|Array|Object|Any)/.test(code))
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

export function vector(code: string): boolean {
    if (/declare Vector .*?:[\s\S]*?}/.test(code))
        return true
    else
        return false
}

export function state(code: string): boolean {
    if (/declare State .*?: ?.*?;/.test(code))
        return true
    else
        return false
}