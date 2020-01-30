export function close_doc(doc:string):string { /** Encapsular contenido del documento en body tags */
   let doc_content = doc.match(/doc: {([\s\S]*)}/)[1];;
   doc = doc.split(`doc: {${doc_content}}`).join(`<body>${doc_content}</body>`);
   doc = doc.split(`doc:{${doc_content}}`).join(`<body>${doc_content}</body>`);
   return doc;
}

export function formatDocument(doc: string, type: string): string {
   doc = doc.replace(/doc: ?{([\s\S]*?)}/, '<body>$1</body>');
   if (type != 'component')
      doc = `<!DOCTYPE html>\n<html lang="en">\n${doc}\n</html>`;
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