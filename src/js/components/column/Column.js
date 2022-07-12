import TempCard from "../tempCard/TempCard.js";
import Header from "./header/Header.js";

export default class {
    constructor($target, title) {
        this.$target = $target;
        this.$element = document.createElement('section');

        this.$header = new Header(this.$element, title, this.addCard.bind(this), this.deleteColumn.bind(this));
        this.$cardList = document.createElement('ul');
        this.$cardList.classList.add('column-cards');
        this.$element.appendChild(this.$cardList);

        this.$element.classList.add('column');
        this.$target.appendChild(this.$element);
    }

    addCard() {
        new TempCard(this.$cardList, null, null, false);
    }

    deleteColumn() {
        // this.$element 지우기
    }
}