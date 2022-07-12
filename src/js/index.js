import '../css/normalize.css';
import '../css/variables.css';
import '../css/style.css';
import Controller from './controller.js';
import Model from './model.js';
import Template from './template.js';
import View from './view.js';

function main() {
  const model = new Model();
  const template = new Template();
  const view = new View(template);
  const $main = document.querySelector('#main');
  new Controller($main, model, view);
}

main();
