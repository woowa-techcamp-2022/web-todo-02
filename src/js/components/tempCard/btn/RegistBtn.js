export default class {
  constructor($target, onclick) {
    this.$target = $target;
    this.$element = document.createElement('button');

    this.$element.innerText = '등록';
    this.$element.classList = 'card-regist';

    this.$element.addEventListener('click', onclick);

    this.$target.appendChild(this.$element);
  }
}
