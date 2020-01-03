export function find_doc(doc:string):string { /** Encontrar el documento */
    doc = doc.match(/doc: {([\s\S]*)}/)[1];
    return doc;
}

export function close_doc(doc:string):string { /** Encapsular contenido del documento en body tags */
    let doc_content = doc.match(/doc: {([\s\S]*)}/)[1];;
    doc = doc.split(`doc: {${doc_content}}`).join(`<div>${doc_content}</div>`);
    doc = doc.split(`doc:{${doc_content}}`).join(`<div>${doc_content}</div>`);
    return doc;
}

export function jscompile(html:string):string { /** Interpretación: { Nue } --> { JavaScript } */
    html = html.replace(/dom/g,'document');
    html = html.replace(/byId/g,'getElementById');
    html = html.replace(/byTag/g,'getElementsByTagName');
    html = html.replace(/byClass/g,'getElementsByClassName');
    html = html.replace(/allQuery/g,'querySelectorAll');
    html = html.replace(/create/g,'createElement');
    html = html.replace(/storage/g,'localStorage');

    return html;
}

export function deleteLinks(html:string):string { /** Eliminado de links escritos en Nue */
    if (html.indexOf('links(') != -1) {
        let links_content:string = html.split('links(').pop().split(/\)/)[0];
        let links_tag:string = `links(${links_content})`;
        html = html.split(links_tag).join('');
    }
    return html;
}