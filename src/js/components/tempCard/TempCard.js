import RegistBtn from './btn/RegistBtn.js';
import Card from '../card/Card.js';
import Input from '../Input/Input.js';

export default class {
  constructor($target, title, content, isModify) {
    this.$target = $target;
    this.$element = document.createElement('li');
    this.state = {
      title,
      content,
    };

    this.$element = document.createElement('article');

    this.$titleInput = new Input(
      this.$element,
      null,
      null,
      '제목을 입력해주세요.',
      this.changeTitle.bind(this)
    );
    this.$titleInput = new Input(
      this.$element,
      null,
      null,
      '내용을 입력해주세요.',
      this.changeContent.bind(this)
    );
    this.$registBtn = new RegistBtn(
      this.$element,
      this.regist.bind(this),
      this.setState.bind(this)
    );

    this.$element.classList.add('card');
    if (isModify) this.$target.replaceWith(this.$element);
    else this.$target.insertBefore(this.$element, this.$target.firstChild);
  }

  regist() {
    this.$element.replaceWith(
      new Card(
        this.$target,
        this.state.title,
        this.state.content,
        this.state.author ?? 'web'
      ).$element
    );
  }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
  }

  changeTitle(title) {
    this.setState({ title });
  }

  changeContent(content) {
    this.setState({ content });
  }
}
