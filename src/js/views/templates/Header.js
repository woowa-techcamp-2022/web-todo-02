export default class {
  constructor({ $target, title, count = 0 }) {
    this.$target = $target;
    this.$element = document.createElement('div');
    this.state = {
      title,
      count,
    };

    /* set element info */
    this.$element.classList.add('column-header');

    /* attach to Target node */
    this.$target.appendChild(this.$element);

    this.render();
  }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.render();
  }

  setTitle(title) {
    this.setState({ title });
  }

  setCount(count) {
    this.setState({ count });
  }

  increaseCount() {
    this.setCount(this.state.count + 1);
  }

  decreaseCount() {
    this.setCount(this.state.count - 1);
  }

  initEvents() {
    this.$element
      .querySelector('.column-header-add')
      .addEventListener('click', () => {
        if (this.$target.classList.contains('adding')) this.removeTempCard();
        else this.addTempCard();
      });
  }

  addTempCard() {
    const $column = this.$target;
    const $cardList = $column.querySelector('.column-cards');

    $column.classList.add('adding');
    $cardList.insertBefore(
      new TempCard({
        cardAddCallback: this.increaseCount.bind(this),
        cardRemoveCallback: this.decreaseCount.bind(this),
      }).$element,
      $cardList.firstChild
    );
  }

  removeTempCard() {
    const $column = this.$target;
    const $cardList = $column.querySelector('.column-cards');

    $column.classList.remove('adding');
    $cardList.firstChild.remove();
  }

  render() {
    this.$element.innerHTML = `
            <div>
                <h2 class="column-header-title">${this.state.title}</h2>
                <div class="column-header-counter">${this.state.count}</div>
            </div>
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
        `;

    /* attach event listener */
    this.initEvents();
  }
}
