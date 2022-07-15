import view from '../view.js';
import controller from '../Controller.js';

export default class {
  constructor(id, title, content) {
    this.$element = document.createElement('li');
    this.state = {
      id,
      title,
      content,
    };

    this.init();
  }

  init() {
    this.$element.className = 'card';
    this.$element.setAttribute('data-id', this.state.id);
    this.render();
    this.attachEvents();
  }

  attachEvents() {
    const $deleteBtn = this.$element.querySelector('.card-header-delete');

    $deleteBtn.addEventListener('click', this.deleteCard.bind(this));
    $deleteBtn.addEventListener('mouseover', this.turnOnDanger.bind(this));
    $deleteBtn.addEventListener('mouseout', this.turnOffDanger.bind(this));
    this.$element.addEventListener(
      'dblclick',
      this.replaceCardWithCardForm.bind(this)
    );
    this.$element.addEventListener('mousedown', this.dragStart.bind(this));
  }

  deleteCard() {
    if (window.confirm('선택한 카드를 삭제할까요?')) {
      controller.deleteCard(this.$element.dataset.id).then(() => {
        const columnId = this.$element.closest('.column').dataset.id;
        view.removeColumnCardsCount(columnId);
        view.removeElement(this.$element);
        view.addHistory();
      });
    }
  }

  replaceCardWithCardForm() {
    view.replaceCardWithCardForm(
      this.$element,
      this.getTitle(),
      this.getContent()
    );
  }

  turnOnDanger() {
    view.addClass(this.$element, 'danger');
  }

  turnOffDanger() {
    view.removeClass(this.$element, 'danger');
  }

  setCardInitialPosition() {
    const rect = this.$element.getBoundingClientRect();
    this.$element.style.top = `${rect.top}px`;
    this.$element.style.left = `${rect.left}px`;
  }

  addSkeleton() {
    const $skeleton = this.$element.cloneNode(true);
    view.addClass($skeleton, 'skeleton');
    this.$element.parentNode.insertBefore($skeleton, this.$element);
  }

  getAllCardLists() {
    return document.querySelectorAll('.column-cards');
  }

  getAllCardsWithoutMovingCard() {
    return document.querySelectorAll('.card:not(.moving):not(.skeleton)');
  }

  replaceCardWithSkeleton(event) {
    const $originalCard = event.target;
    const $skeleton = this.getSkeleton();
    view.addClass($skeleton, 'changed');

    const $cards = [...this.getCardsWithoutMoving($skeleton)];
    const skeletonIndex = $cards.indexOf($skeleton);
    const cardIndex = $cards.indexOf($originalCard);

    const isSkeletonAboveCard = skeletonIndex < cardIndex;
    if (isSkeletonAboveCard) {
      view.insertAfter($skeleton, $originalCard);
    } else {
      $originalCard.parentNode.insertBefore($skeleton, $originalCard);
    }
  }

  setMouseEnterEventToAllCardLists() {
    this.getAllCardLists().forEach(($cardLists) => {
      $cardLists.onmouseenter = (event) => {
        const $skeleton = this.getSkeleton();
        view.addClass($skeleton, 'changed');
        view.insertAfter($skeleton, $cardLists.lastChild);
      };
    });
  }

  setMouseEnterEventToAllCards() {
    this.getAllCardsWithoutMovingCard().forEach(($staticCard) => {
      $staticCard.onmouseenter = (event) => {
        this.replaceCardWithSkeleton(event);
      };
    });
  }

  removeMouseEnterEventToAllCardLists() {
    this.getAllCardLists().forEach((cardList) => {
      cardList.onmouseenter = null;
    });
  }

  removeMouseEnterEventToAllCards() {
    this.getAllCardsWithoutMovingCard().forEach((card) => {
      card.onmouseenter = null;
    });
  }

  dragStart(event) {
    if (event.target.closest('.card-header-delete')) return;

    this.setCardInitialPosition();
    this.addSkeleton();
    view.addClass(this.$element, 'moving');
    // 1. pointer-events를 none으로 설정한 이유: 카드 드래그 시 다른 카드의 mouseenter 이벤트를 감지하기 위해
    // 2. setTimeout으로 delay를 넣어준 이유: dblclick 이벤트를 감지하기 위해
    const styleTimeoutID = setTimeout(() => {
      this.$element.style.pointerEvents = 'none';
    }, 150);

    const dragStartPosition = { x: event.clientX, y: event.clientY };
    this.setMouseEnterEventToAllCardLists();
    this.setMouseEnterEventToAllCards();
    const dragEvent = (event) => {
      this.drag(event, dragStartPosition);
    };
    window.addEventListener('mousemove', dragEvent);
    window.onmouseup = (event) => {
      this.dragEnd(event);
      window.removeEventListener('mousemove', dragEvent);
      clearTimeout(styleTimeoutID);
      this.$element.style.pointerEvents = '';
      window.onmouseup = null;
    };
  }

  drag(event, dragStartPosition) {
    const xDiff = event.clientX - dragStartPosition.x;
    const yDiff = event.clientY - dragStartPosition.y;
    this.$element.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
  }

  dragEnd() {
    this.$element.removeAttribute('style');
    const $skeleton = this.getSkeleton();
    view.addClass(this.$element, 'hide');
    // dblclick 이벤트를 감지하기 위해 잔상 카드가 이동했을 때만 엘리먼트와 교체해주도록 함
    if ($skeleton.classList.contains('changed')) {
      const $originalColumn = this.$element.closest('.column');
      const $newColumn = $skeleton.closest('.column');
      const originalColumnId = $originalColumn.dataset.id;
      const newColumnId = $newColumn.dataset.id;

      controller
        .moveCard(this.state.id, this.getDestinationPosition(), newColumnId)
        .then(() => {
          view.removeColumnCardsCount(originalColumnId);
          view.addColumnCardsCount(newColumnId);
          $skeleton.replaceWith(this.$element);
          view.addHistory();
        })
        .catch(() => {
          $skeleton.remove();
        })
        .finally(() => {
          view.removeClass(this.$element, 'hide');
        });
    } else {
      $skeleton.remove();
    }
    view.removeClass(this.$element, 'moving');
    this.removeMouseEnterEventToAllCardLists();
    this.removeMouseEnterEventToAllCards();
  }

  getTitle() {
    return this.state.title;
  }

  getContent() {
    return this.state.content;
  }

  getElement() {
    return this.$element;
  }

  getSkeleton() {
    return document.querySelector('.skeleton');
  }

  getCardsWithoutMoving($skeleton) {
    const $cardList = $skeleton.closest('.column-cards');
    return $cardList.querySelectorAll('.card:not(.moving)');
  }

  getDestinationPosition() {
    const $skeleton = this.getSkeleton();
    const $cards = this.getCardsWithoutMoving($skeleton);
    const skeletonIndex = [...$cards].indexOf($skeleton);

    return $cards.length - skeletonIndex;
  }

  render() {
    this.$element.innerHTML = `
        <article>
            <header class="card-header">
                <h3 class="card-header-title">${this.state.title}</h3>
                <button class="card-header-delete">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z" fill="black"/>
                    </svg>
                </button>
            </header>
            <p class="card-content">
                ${this.state.content}
            </p>
            <footer class="card-author">author by web</footer>
        </article>
    `;
  }
}
