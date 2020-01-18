

customElements.define('mi-componente', class extends HTMLElement {
    constructor() {
        super();
        
this._titulo = null;
this._subtitulo = null;
    }

    static get observedAttributes() {
        return ['titulo','subtitulo'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.shadowRoot.querySelector(`[name="${name}"]`).innerHTML = this[name];
        }
    }

    connectedCallback() {
        let shadowRoot = this.attachShadow({mode: 'open'});
        let doc = document.createElement('div');
        doc.innerHTML = `<template id="doc">
    <h1><slot name="titulo"></slot></h1>
    <p><slot name="subtitulo"></slot></p>
<template>`;
        let t = doc.querySelector('#doc');
        let instance = t.content.cloneNode(true);

        instance.querySelector('[name="titulo"]').innerHTML = this.titulo;
instance.querySelector('[name="subtitulo"]').innerHTML = this.subtitulo;


        shadowRoot.appendChild(instance);
    }

    get titulo () {
    console.log('get titulo()');
    return this.getAttribute('titulo');
}

set titulo (val) {
    console.log(`set titulo(${val})`);
    this._titulo = val;
}get subtitulo () {
    console.log('get subtitulo()');
    return this.getAttribute('subtitulo');
}

set subtitulo (val) {
    console.log(`set subtitulo(${val})`);
    this._subtitulo = val;
}
});