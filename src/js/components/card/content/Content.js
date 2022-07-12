export default class {
    constructor($target, content) {
        this.$target = $target;
        this.$element = document.createElement('p');
        this.state = {
            content
        }

        this.$element.classList.add('card-content');
        this.$target.appendChild(this.$element);

        this.render();
    }

    setState(newState) {
        this.state = {
            ...this.state,
            ...newState,
        }

        this.render();
    }

    render() {
        this.$element.innerText = this.state.content;
    }
}