import view from '../view.js';

export default class {
  constructor(action, id = '', title = '', content = '') {
    this.$element = document.createElement('li');
    this.state = {
      action,
      id,
      title,
      content,
    };

    this.init();
  }

  init() {
    this.$element.className = 'card';
    this.$element.dataset.id = this.state.id;
    this.$element.dataset.action = this.state.action;
    this.render();
    this.attachEvents();
  }

  attachEvents() {
    this.$element
      .querySelector('.card-form-cancelbtn')
      .addEventListener('click', this.cancelSubmit.bind(this));
    this.$element
      .querySelector('.card-form-submitbtn')
      .addEventListener('click', this.confirmSubmit.bind(this));
    this.$element
      .querySelector('.card-form-title')
      .addEventListener('input', this.checkInputNotEmpty.bind(this));
    this.$element
      .querySelector('.card-form-content')
      .addEventListener('input', this.checkInputNotEmpty.bind(this));
  }

  cancelSubmit(e) {
    e.preventDefault();
    const $column = this.$element.closest('.column');
    view.cancelCardFormSubmit($column, this.$element);
  }

  confirmSubmit(e) {
    e.preventDefault();
    const $column = this.$element.closest('.column');

    view.confirmCardFormSubmit(
      $column,
      this.$element,
      this.getTitle(),
      this.getContent()
    );
  }

  checkInputNotEmpty() {
    const $titleInput = this.$element.querySelector('.card-form-title');
    const $contentInput = this.$element.querySelector('.card-form-content');

    if ($titleInput.value && $contentInput.value) this.activateSubmit();
    else this.deactivateSubmit();
  }

  activateSubmit() {
    const $submitBtn = this.$element.querySelector('.card-form-submitbtn');
    $submitBtn.removeAttribute('disabled');
  }

  deactivateSubmit() {
    const $submitBtn = this.$element.querySelector('.card-form-submitbtn');
    $submitBtn.setAttribute('disabled', true);
  }

  getTitle() {
    return this.$element.querySelector('.card-form-title').value;
  }

  getContent() {
    return this.$element.querySelector('.card-form-content').value;
  }

  getElement() {
    return this.$element;
  }

  render() {
    this.$element.innerHTML = `
        <form class="card-form">
            <input class="card-form-title" type="text" name="title" placeholder="????????? ???????????????" value="${this.state.title}"/>
            <input class="card-form-content" type="text" name="content" placeholder="????????? ???????????????" value="${this.state.content}"/>
            <div class="card-form-buttons">
                <button class="card-form-cancelbtn">??????</button>
                <button class="card-form-submitbtn" disabled>??????</button>
            </div>
        </form>
    `;
  }
}
