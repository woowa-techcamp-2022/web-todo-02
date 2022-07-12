export default class {
  constructor({
    $app,
    initialState,
    onClickCardAddButton,
    onAddCard,
    onDeleteCard,
  }) {
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'columns';
    this.onClickCardAddButton = onClickCardAddButton;
    this.onAddCard = onAddCard;
    this.onDeleteCard = onDeleteCard;
    $app.appendChild(this.$target);

    this.setEvents();
    this.render();
  }

  clickCardAddButtonEvent(event) {
    if (event.target.closest('.column-header-add')) {
      this.onClickCardAddButton(event);
    }
  }

  submitAddCardEvent(event) {
    if (event.target.closest('.card-form')) {
      this.onAddCard(event);
    }
  }

  deleteCardEvent(event) {
    if (event.target.closest('.card-header-delete')) {
      this.onDeleteCard(event);
    }
  }

  clickEvents(event) {
    if (event.target.closest('.column-header-add')) {
      this.onClickCardAddButton(event);
    } else if (
      event.target.closest('.card-header-delete') ||
      event.target.closest('.card-form-cancelbtn')
    ) {
      this.onDeleteCard(event);
    }
  }

  validateCardForm(event) {
    const $cardForm = event.target.closest('.card-form');
    if ($cardForm) {
      const submitButton = document.querySelector('.card-form-submitbtn');
      if ($cardForm.title.value !== '' && $cardForm.content.value !== '') {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    }
  }

  setEvents() {
    this.$target.addEventListener('click', this.clickEvents.bind(this));
    this.$target.addEventListener('submit', this.onAddCard.bind(this));
    this.$target.addEventListener('input', this.validateCardForm.bind(this));
  }

  setState(nextState) {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.render();
  }

  cards(card, index) {
    return `
      <li class="card ${
        card.isWriting ? 'is-writing' : ''
      }" data-index="${index}">
        <form class="card-form">
          <input type="text" name="title" placeholder="제목을 입력하세요" />
          <input type="text" name="content" placeholder="내용을 입력하세요" />
          <div class="card-form-buttons">
            <button type="button" class="card-form-cancelbtn">취소</button>
            <button class="card-form-submitbtn" disabled>등록</button>
          </div>
        </form>
        <article>
          <header class="card-header">
            <h3 class="card-header-title">${card.title}</h3>
            <button class="card-header-delete">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z"
                  fill="black"
                />
              </svg>
            </button>
          </header>
          <p class="card-content">${card.content}</p>
          <footer class="card-author">author by web</footer>
        </article>
      </li>
    `;
  }

  render() {
    const { columns } = this.state;

    this.$target.innerHTML = columns
      .map(
        (column, index) =>
          `
      <section class="column" data-index="${index}">
        <div class="column-header">
          <div>
            <h2 class="column-header-title">${column.title}</h2>
            <div class="column-header-counter">${column.cards.length}</div>
          </div>
          <div>
            <button class="column-header-add">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.10571
                12.5303L5.10571
                11.4697H11.4697V5.10571H12.5303V11.4697H18.8943V12.5303H12.5303V18.8943H11.4697V12.5303H5.10571Z"
                  fill="black"
                />
              </svg>
            </button>
            <button class="column-header-delete">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul class="column-cards">
          ${column.cards.map((card, index) => this.cards(card, index)).join('')}
        </ul>
      </section>
    `
      )
      .join('');
  }
}
