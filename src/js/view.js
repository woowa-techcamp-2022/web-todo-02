import Card from './components/Card.js';
import CardForm from './components/CardForm.js';
import Column from './components/Column.js';
import History from './components/History.js';
import controller from './Controller.js';

class View {
  constructor() {}

  removeElement($element) {
    $element.remove();
  }

  insertAfter($newNode, $existingNode) {
    $existingNode.parentNode.insertBefore($newNode, $existingNode.nextSibling);
  }

  addClass($element, className) {
    $element.classList.add(className);
  }

  removeClass($element, className) {
    $element.classList.remove(className);
  }

  appendColumn(id, title) {
    const $main = document.querySelector('#main');
    const $column = new Column(id, title).getElement();
    $main.appendChild($column);
  }

  appendCard(columnId, cardId, title, content) {
    const $columns = document.querySelectorAll('.column');
    $columns.forEach(($column) => {
      const id = $column.dataset.id;

      if (id === columnId) {
        const $cardList = $column.querySelector('.column-cards');
        $cardList.appendChild(new Card(cardId, title, content).getElement());
      }
    });
  }

  getColumnCardsCounter(columnId) {
    const selector = `.column[data-id="${columnId}"] .column-header-counter`;
    return document.querySelector(selector);
  }

  setColumnCardsCount(columnId, count) {
    const $counter = this.getColumnCardsCounter(columnId);
    $counter.innerHTML = count;
  }

  addColumnCardsCount(columnId) {
    const $counter = this.getColumnCardsCounter(columnId);
    $counter.innerHTML++;
  }

  removeColumnCardsCount(columnId) {
    const $counter = this.getColumnCardsCounter(columnId);
    $counter.innerHTML--;
  }

  addCardForm($column, $cardList) {
    this.addClass($column, 'adding');
    $cardList.insertBefore(
      new CardForm('add').getElement(),
      $cardList.firstChild
    );
  }

  replaceCardFormWithCard(cardId, $column, $cardForm, title, content) {
    this.removeClass($column, 'adding');
    const $card = new Card(cardId, title, content);
    $cardForm.replaceWith($card.getElement());
  }

  addCard($column, $cardForm, title, content) {
    const columnId = $column.dataset.id;
    controller.addCard(columnId, title, content).then((cardId) => {
      this.replaceCardFormWithCard(cardId, $column, $cardForm, title, content);
      this.addColumnCardsCount(columnId);
      this.addHistory();
    });
  }

  updateCard($column, $cardForm, title, content) {
    controller.updateCard($cardForm.dataset.id, title, content).then(() => {
      this.replaceCardFormWithCard(
        $cardForm.dataset.id,
        $column,
        $cardForm,
        title,
        content
      );
      this.addHistory();
    });
  }

  confirmCardFormSubmit($column, $cardForm, title, content) {
    const { action } = $cardForm.dataset;
    if (action === 'add') {
      this.addCard($column, $cardForm, title, content);
    } else if (action === 'update') {
      this.updateCard($column, $cardForm, title, content);
    }
  }

  cancelCardFormSubmit($column, $cardForm) {
    if ($column.classList.contains('adding')) {
      this.removeClass($column, 'adding');
      this.removeElement($cardForm);
    } else {
      this.cancelUpdateCard($cardForm);
    }
  }

  cancelUpdateCard($cardForm) {
    const { id } = $cardForm.dataset;
    const title = $cardForm.querySelector('.card-form-title').value;
    const content = $cardForm.querySelector('.card-form-content').value;
    $cardForm.replaceWith(new Card(id, title, content).getElement());
  }

  replaceCardWithCardForm($card, title, content) {
    $card.replaceWith(
      new CardForm('update', $card.dataset.id, title, content).getElement()
    );
  }

  displaySidebar() {
    document.querySelector('#aside').classList.add('show');
    this.addHistory();
  }

  hideSidebar() {
    document.querySelector('#aside').classList.remove('show');
  }

  addHistory() {
    const $historyColumn = document.querySelector('#aside-history-column');
    controller.getHistory().then((histories) => {
      $historyColumn.innerHTML = '';
      histories.forEach((history) =>
        $historyColumn.appendChild(new History(history).getElement())
      );
    });
  }
}

const viewInstance = new View();
export default viewInstance;
