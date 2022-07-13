import view from '../view.js';

export default class {
  constructor(id, title, content) {
    this.$element = document.createElement('li');
    this.state = {
      id,
      title,
      content,
    };

    this.$element.classList.add('card');
    this.$element.setAttribute('data-id', id);
    this.render();
    /* attach event listener */
    this.initEvents();
  }

  initEvents() {
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

  getAllCardsWithoutMovingCard() {
    return document.querySelectorAll('.card:not(.moving):not(.skeleton)');
  }

  replaceCardWithSkeleton(event) {
    const $originalCard = event.target;
    const $skeleton = document.querySelector('.skeleton');
    $skeleton.classList.add('replaced');
    event.target.replaceWith($skeleton.cloneNode(true));
    $skeleton.replaceWith($originalCard);
  }

  setMouseEnterEventToAllCards() {
    this.getAllCardsWithoutMovingCard().forEach((card) => {
      card.onmouseenter = this.replaceCardWithSkeleton.bind(this);
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
    this.$element.classList.add('moving');
    // 1. pointer-events를 none으로 설정한 이유: 카드 드래그 시 다른 카드의 mouseenter 이벤트를 감지하기 위해
    // 2. setTimeout으로 delay를 넣어준 이유: dblclick 이벤트를 감지하기 위해
    const styleTimeoutID = setTimeout(() => {
      this.$element.style.pointerEvents = 'none';
    }, 100);

    const dragStartPosition = { x: event.clientX, y: event.clientY };
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
    // dbl 클릭 이벤트를 감지하기 위해 잔상 카드가 이동했을 때만 엘리먼트와 교체해주도록 함
    if ($skeleton.classList.contains('replaced')) {
      $skeleton.replaceWith(this.$element);
    } else {
      $skeleton.remove();
    }
    this.$element.classList.remove('moving');
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
