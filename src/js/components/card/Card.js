import Header from './header/Header.js';
import Content from './content/Content.js';
import Footer from './footer/Footer.js';

export default class {
  constructor($target, title, content, author) {
    this.$target = $target;
    this.$element = document.createElement('li');
    this.state = {
      title,
      content,
      author,
    };

    this.$header = new Header(
      this.$element,
      this.state.title,
      this.deleteCard.bind(this)
    );
    this.$content = new Content(this.$element, this.state.content);
    this.$footer = new Footer(this.$element, this.state.author);

    this.$element.classList.add('card');
    this.$target.appendChild(this.$element);
  }

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };
  }

  deleteCard() {
    if (confirm('선택한 카드를 삭제하시겠습니까?')) this.$element.remove();
  }

  changeTitle(title) {
    this.setState({ title });
    this.$header.changeTitle(title);
  }

  changeContent(content) {
    this.setState({ content });
    this.$content.setState(content);
  }
}
