export default class {
  constructor({ $target }) {
    this.$element = document.createElement('ul');

    /* set element info */
    this.$element.classList.add('column-cards');

    /* attach to Target node */
    this.$target.appendChild(this.$element);
  }
}
