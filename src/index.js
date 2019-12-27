import { html, render } from 'lit-html';
import '@/components/title';

const template = name => {
  return html`
    <name-tag name="${name}"></name-tag>
  `;
};

const mainNode = document.getElementById('main');

render(template('Pie'), mainNode);
