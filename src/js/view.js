export default class {
  /**
   * @param {import('./template').default} template
   */
  constructor(template) {
    this.template = template;
  }

  getElementFromTemplate(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.firstElementChild;
  }

  getColumn(column) {
    return this.getElementFromTemplate(this.template.column(column));
  }

  getCardForm(id) {
    return this.getElementFromTemplate(this.template.cardForm(id));
  }

  getCard(card) {
    return this.getElementFromTemplate(this.template.card(card));
  }
}
