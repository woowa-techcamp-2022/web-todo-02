import view from '../view.js';

export default class {
  constructor(id, title) {
    this.$element = document.createElement('section');
    this.state = {
      title,
      id,
    };

    this.init();
  }

  init() {
    this.$element.classList.add('column');
    this.$element.setAttribute('data-id', this.state.id);
    this.render();
    this.attachEvents();
  }

  attachEvents() {
    this.$element
      .querySelector('.column-header-add')
      .addEventListener('click', () => {
        const $column = this.$element.closest('.column');
        if ($column.classList.contains('adding')) this.removeCardForm();
        else this.addCardForm();
      });
  }

  addCardForm() {
    const $column = this.$element.closest('.column');
    const $cardList = $column.querySelector('.column-cards');

    view.addCardForm($column, $cardList);
  }

  removeCardForm() {
    const $column = this.$element.closest('.column');
    const $cardList = $column.querySelector('.column-cards');

    view.removeCardForm($column, $cardList);
  }

  getElement() {
    return this.$element;
  }

  render() {
    this.$element.innerHTML = `
        <div class="column-header">
            <h2 class="column-header-title">${this.state.title}</h2>
            <div class="column-header-counter">0</div>
            <div> 
                <button class="column-header-add">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                        <path
                        d="M5.10571
                        12.5303L5.10571
                        11.4697H11.4697V5.10571H12.5303V11.4697H18.8943V12.5303H12.5303V18.8943H11.4697V12.5303H5.10571Z"
                        fill="black"
                        />
                    </svg>
                </button>
                <button class="column-header-delete">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z" fill="black"/>
                    </svg>
                </button>
            </div>
        </div>
        <ul class="column-cards">
        </ul>
    `;
  }
}
