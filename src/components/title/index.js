import { LitElement, html } from 'lit-element';

class Title extends LitElement {
  constructor(name) {
    super();
    this.name = name || 'pie';
  }

  static get properties() {
    return { name: { type: String } };
  }

  render() {
    return html`
      <p>Hello ${this.name}</p>
    `;
  }
}

customElements.define('name-tag', Title);
