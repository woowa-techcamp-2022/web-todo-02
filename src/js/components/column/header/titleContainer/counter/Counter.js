export default class {
    constructor($target) {
        this.$target = $target;
        this.$element = document.createElement('div');
        this.state = {
            count: 0,
        }

        this.$element.classList.add('column-header-counter');
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

    countUp() {
        this.setState({count: this.state.count + 1});
    }

    countDown() {
        this.setState({count: this.state.count - 1});
    }
    
    render() {
        this.$element.innerText = this.state.count;
    }
}