

customElements.define("mi-comp", class extends HTMLElement {
    constructor() {
        super();
        
this._texto = null;
    }

    static get observedAttributes() {
        return ['texto'];
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
    <h1><slot name="texto"></slot></h1>
</template>`;
        let t = doc.querySelector('#doc');
        let instance = t.content.cloneNode(true);
        let script_tag = document.createElement('script')
script_tag.textContent = ``
instance.appendChild(script_tag)

        instance.querySelector('[name="texto"]').innerHTML = this.texto;


        shadowRoot.appendChild(instance);
    }

    get texto () {
    return this.getAttribute('texto');
}

set texto (val) {
    this._texto = val;
}
});