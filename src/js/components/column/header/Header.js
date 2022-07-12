import TitleContainer from "./TitleContainer.js";
import ButtonContainer from "./ButtonContainer.js";

export default class {
    constructor($target, title, addCard, deleteColumn) {
        this.$target = $target;
        this.$element = document.createElement('div');

        this.$titleContainer = new TitleContainer(this.$element, title);
        this.$btnContainer = new ButtonContainer(this.$element, addCard, deleteColumn);

        this.$element.classList.add('column-header');
        this.$target.appendChild(this.$element);
    }
}