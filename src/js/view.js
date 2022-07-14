import Card from './components/Card.js';
import CardForm from './components/CardForm.js';
import Column from './components/Column.js';
import controller from './Controller.js';

class View {
  constructor() {}

  removeElement($element) {
    $element.remove();
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

  deleteCard($card) {
    controller.deleteCard($card.dataset.id).then(() => {
      this.removeElement($card);
    });
  }

  addCardForm($column, $cardList) {
    $column.classList.add('adding');
    $cardList.insertBefore(
      new CardForm('add').getElement(),
      $cardList.firstChild
    );
  }

  removeCardForm($column, $cardList) {
    $column.classList.remove('adding');
    this.removeElement($cardList.firstChild);
  }

  replaceCardFormWithCard(cardId, $column, $cardForm, title, content) {
    $column.classList.remove('adding');
    const $card = new Card(cardId, title, content);
    $cardForm.replaceWith($card.getElement());
  }

  confirmCardFormSubmit($column, $cardForm, title, content) {
    const { action } = $cardForm.dataset;
    if (action === 'add') {
      controller.addCard($column.dataset.id, title, content).then((cardId) => {
        this.replaceCardFormWithCard(
          cardId,
          $column,
          $cardForm,
          title,
          content
        );
      });
    } else if (action === 'update') {
      controller.updateCard($column.dataset.id, title, content).then(() => {
        this.replaceCardFormWithCard(
          $cardForm.dataset.id,
          $column,
          $cardForm,
          title,
          content
        );
      });
    }
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

  replaceCardWithCardForm($card, title, content) {
    $card.replaceWith(
      new CardForm('update', $card.dataset.id, title, content).getElement()
    );
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
