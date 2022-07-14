
export default class {
    constructor() {
        this.$element = document.createElement('li');
        this.state = {
            title,
            time,
        };
        
        this.init();
    }

    init() {
        this.$element.classList.add("history-card");
        this.render();
    }

    render() {
        this.$element.innerHTML = `
            <div class="history-card-title">${this.state.title}</div>
            <div class="history-card-time">${this.getTimeDiff(this.state.time)}</div>
        `;
    }
}