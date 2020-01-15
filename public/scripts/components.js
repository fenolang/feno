

customElements.define('final-test', class extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
    <p>Otro componente</p>
    <h1>Qué?</h1>
`;
}
});

customElements.define('prueba-com', class extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
    <final-test></final-test>
`;
}
});