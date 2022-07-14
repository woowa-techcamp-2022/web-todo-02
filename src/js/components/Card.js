import { insertAfter } from '../utils.js';
import view from '../view.js';

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
    this.$element.classList.add('card');
    this.$element.setAttribute('data-id', this.state.id);
    this.render();
    this.attachEvents();
  }

  attachEvents() {
    const $deleteBtn = this.$element.querySelector('.card-header-delete');

    $deleteBtn.addEventListener('click', this.deleteCard.bind(this));
    $deleteBtn.addEventListener('mouseover', this.turnOnDanger.bind(this));
    $deleteBtn.addEventListener('mouseout', this.turnOffDanger.bind(this));
    this.$element.addEventListener('dblclick', this.updateCard.bind(this));
    this.$element.addEventListener('mousedown', this.dragStart.bind(this));
  }

  deleteCard() {
    view.removeElement(this.$element);
  }

  updateCard() {
    view.updateCard(this.$element, this.getTitle(), this.getContent());
  }

  turnOnDanger() {
    const $card = this.$element;
    view.turnOnCardDanger($card);
  }

  turnOffDanger() {
    const $card = this.$element;
    view.turnOffCardDanger($card);
  }

  setCardInitialPosition() {
    const rect = this.$element.getBoundingClientRect();
    this.$element.style.top = `${rect.top}px`;
    this.$element.style.left = `${rect.left}px`;
  }

  addSkeleton() {
    const $skeleton = this.$element.cloneNode(true);
    $skeleton.classList.add('skeleton');
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
    const $skeleton = document.querySelector('.skeleton');
    $skeleton.classList.add('changed');
    event.target.replaceWith($skeleton.cloneNode(true));
    $skeleton.replaceWith($originalCard);
  }

  moveSkeletonToAdjacentCard(event) {
    const $card = event.target;
    const cardRect = $card.getBoundingClientRect();
    const yCenter = cardRect.top + cardRect.height / 2;
    const $skeleton = document.querySelector('.skeleton');
    $skeleton.classList.add('changed');
    if (event.clientY > yCenter) {
      insertAfter($skeleton, $card);
    } else {
      $card.parentNode.insertBefore($skeleton, $card);
    }
  }

  setMouseEnterEventToAllCardLists() {
    this.getAllCardLists().forEach(($cardLists) => {
      $cardLists.onmouseenter = (event) => {
        const $skeleton = document.querySelector('.skeleton');
        $skeleton.classList.add('changed');
        const newColumnId = event.target.closest('.column').dataset.id;
        this.setColumnId(newColumnId);
        insertAfter($skeleton, $cardLists.lastChild);
      };
    });
  }

  setMouseEnterEventToAllCards() {
    this.getAllCardsWithoutMovingCard().forEach(($card) => {
      $card.onmouseenter = (event) => {
        const newColumnId = $card.closest('.column').dataset.id;
        if (this.$element.dataset.columnId === newColumnId) {
          this.replaceCardWithSkeleton(event);
        } else {
          this.moveSkeletonToAdjacentCard(event);
        }
        this.setColumnId(newColumnId);
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

  setColumnId(id) {
    this.$element.dataset.columnId = id;
  }

  dragStart(event) {
    if (event.target.closest('.card-header-delete')) return;

    this.setCardInitialPosition();
    this.addSkeleton();
    this.$element.classList.add('moving');
    this.setColumnId(this.$element.closest('.column').dataset.id);
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
    const $skeleton = document.querySelector('.skeleton');
    // dblclick 이벤트를 감지하기 위해 잔상 카드가 이동했을 때만 엘리먼트와 교체해주도록 함
    if ($skeleton.classList.contains('changed')) {
      $skeleton.replaceWith(this.$element);
    } else {
      $skeleton.remove();
    }
    this.$element.classList.remove('moving');
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
