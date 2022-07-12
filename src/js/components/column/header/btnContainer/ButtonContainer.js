import AddBtn from '../../../button/AddBtn.js';
import DeleteBtn from '../../../button/DeleteBtn.js';

export default class {
  constructor($target, addCard, deleteColumn) {
    this.$target = $target;
    this.$element = document.createElement('div');

    this.$addBtn = new AddBtn(this.$element, 'column-header-add', addCard);
    this.$deleteBtn = new DeleteBtn(
      this.$element,
      'column-header-delete',
      deleteColumn
    );

    this.$target.appendChild(this.$element);
  }
}
