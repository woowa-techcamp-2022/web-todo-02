export default class {
  constructor($target, title) {
    this.$target = $target;
    this.$element = document.createElement('h3');
    this.state = {
      title,
    };

    this.$element.classList.add('card-header-title');
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

  render() {
    this.$element.innerText = this.state.title;
  }
}
