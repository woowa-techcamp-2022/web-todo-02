export default class {
    constructor($target, author) {
        this.$target = $target;
        this.$element = document.createElement('footer');
        this.state = {
            author
        }

        this.$element.classList.add('card-author');
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
        this.$element.innerText = `author by ${this.state.author}`;
    }
}