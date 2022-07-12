export default class {
    constructor($target, title) {
        this.$target = $target;
        this.$element = document.createElement('h2');
        this.state = {
            title
        }

        this.$element.classList.add('column-header-title');
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
        this.$element.innerText = this.state.title;
    }
}