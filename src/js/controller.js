export default class {
  /**
   * @param {HTMLElement} $main
   * @param {import('./model').default} model
   * @param {import('./view').default} view
   */
  constructor($main, model, view) {
    this.$main = $main;
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.addAllColumns();
  }

  addColumnHeaderCount(event) {
    const $column = event.target.closest('.column');
    $column.querySelector('.column-header-counter').innerHTML++;
  }

  subtractColumnHeaderCount(event) {
    const $column = event.target.closest('.column');
    $column.querySelector('.column-header-counter').innerHTML--;
  }

  cardFormSubmitEvent(event) {
    event.preventDefault();
    const title = event.target.title.value;
    const content = event.target.content.value;
    this.model.addCard({ title, content }, (card) => {
      const $card = this.view.getCard(card);
      event.target.closest('.column').classList.remove('is-adding');
      this.addColumnHeaderCount(event);
      event.target.closest('.card').replaceWith($card);
    });
  }

  cardAddFormToggleEvent(event) {
    const $column = event.target.closest('.column');
    const columnId = Number($column.dataset.id);
    const isAdding = $column.classList.contains('is-adding');
    if (isAdding) {
      $column.classList.remove('is-adding');
      const $columnCards = $column.querySelector('.column-cards');
      $columnCards.removeChild($columnCards.firstChild);
    } else {
      $column.classList.add('is-adding');
      const $cardForm = this.view.getCardForm(columnId);
      $cardForm.addEventListener('submit', this.cardFormSubmitEvent.bind(this));
      const $columnCards = $column.querySelector('.column-cards');
      $columnCards.insertBefore($cardForm, $columnCards.firstChild);
    }
  }

  cardDeleteEvent(event) {
    this.model.deleteCard(() => {
      this.subtractColumnHeaderCount(event);
      const $card = event.target.closest('.card');
      $card.remove();
    });
  }

  addColumn(column) {
    const $column = this.view.getColumn(column);
    const $columnHeaderAdd = $column.querySelector('.column-header-add');
    $columnHeaderAdd.addEventListener(
      'click',
      this.cardAddFormToggleEvent.bind(this)
    );
    $column.addEventListener('click', (event) => {
      if (event.target.closest('.card-header-delete')) {
        this.cardDeleteEvent(event);
      }
    });
    this.$main.appendChild($column);
  }

  addAllColumns() {
    this.model.getColumns((columns) => {
      columns.forEach((column) => {
        this.addColumn(column);
      });
    });
  }
}
