import Title from './Title.js';
import DeleteBtn from '../../button/DeleteBtn.js';

export default class {
  constructor($target, title, deleteCard) {
    this.$target = $target;
    this.$element = document.createElement('header');

    this.$title = new Title(this.$element, title);
    this.$deleteBtn = new DeleteBtn(
      this.$element,
      'card-header-delete',
      deleteCard
    );

    this.$element.classList.add('card-header');
    this.$target.appendChild(this.$element);
  }

  changeTitle(title) {
    this.$title.setState({ title });
  }
}
