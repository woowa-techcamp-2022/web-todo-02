export default class {
  constructor($target, className, value, placeholder, onchange) {
    this.$target = $target;
    this.$element = document.createElement('input');

    if (className) this.$element.classList.add(className);
    if (value) this.$element.setAttribute('value', value);
    if (placeholder) this.$element.setAttribute('placeholder', placeholder);
    if (onchange)
      this.$element.addEventListener('change', () =>
        onchange(this.$element.value)
      );

    this.$target.appendChild(this.$element);
  }
}
