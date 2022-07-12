import Title from './title/Title.js';
import Counter from './counter/Counter.js';

export default class {
  constructor($target, title) {
    this.$target = $target;
    this.$element = document.createElement('div');

    this.$title = new Title(this.$element, title);
    this.$counter = new Counter(this.$element);

    this.$target.appendChild(this.$element);
  }
}
