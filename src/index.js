import { html, render } from 'lit-html';

const template = name => {
  return html`
    <p>Hello ${name}</p>
  `;
};

const mainNode = document.getElementById('main');

render(template('Pie'), mainNode);
