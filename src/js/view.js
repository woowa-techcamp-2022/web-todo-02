import Card from './components/Card.js';
import CardForm from './components/CardForm.js';
import Column from './components/Column.js';

class View {
  constructor() {}

  removeElement($element) {
    $element.remove();
  }

  addColumn(id, title) {
    const $main = document.querySelector('#main');
    const $column = new Column(id, title).getElement();
    $main.appendChild($column);
  }

  addCard(columnId, cardId, title, content) {
    const $columns = document.querySelectorAll('.column');
    $columns.forEach(($column) => {
      const id = $column.dataset.id;

      if (id === columnId) {
        const $cardList = $column.querySelector('.column-cards');
        $cardList.appendChild(new Card(cardId, title, content).getElement());
      }
    });
  }

  addCardForm($column, $cardList) {
    $column.classList.add('adding');
    $cardList.insertBefore(new CardForm().getElement(), $cardList.firstChild);
  }

  removeCardForm($column, $cardList) {
    $column.classList.remove('adding');
    this.removeElement($cardList.firstChild);
  }

  confirmCardFormSubmit($column, $cardForm, title, content) {
    const $card = new Card('fixme', title, content);

    $column.classList.remove('adding');
    $cardForm.replaceWith($card.getElement());
  }

  cancelCardFormSubmit($column, $cardForm) {
    if ($column.classList.contains('adding')) {
      $column.classList.remove('adding');
      this.removeElement($cardForm);
    } else {
      this.cancelUpdateCard($column, $cardForm);
    }
  }

  cancelUpdateCard($column, $cardForm) {}

  activateBtn($button) {
    $button.removeAttribute('disabled');
  }

  deactivateBtn($button) {
    $button.setAttribute('disabled', true);
  }

  updateCard($card, title, content) {
    $card.replaceWith(new CardForm(title, content).getElement());
  }

  turnOnCardDanger($card) {
    $card.classList.add('danger');
  }

  turnOffCardDanger($card) {
    $card.classList.remove('danger');
  }
}

const viewInstance = new View();
export default viewInstance;
