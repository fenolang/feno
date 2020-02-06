

customElements.define("mi-comp", class extends HTMLElement {
    constructor() {
        super();
        
    }

    static get observedAttributes() {
        
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
    <p>Hola</p>
<template>`;
        let t = doc.querySelector('#doc');
        let instance = t.content.cloneNode(true);

        

        shadowRoot.appendChild(instance);
    }

    
});