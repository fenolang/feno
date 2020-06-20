

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
    <h1>Mi componente</h1>
</template>`;
        let t = doc.querySelector('#doc');
        let instance = t.content.cloneNode(true);
        let script_tag = document.createElement('script')
script_tag.textContent = ``
instance.appendChild(script_tag)

        

        shadowRoot.appendChild(instance);
    }

    
});