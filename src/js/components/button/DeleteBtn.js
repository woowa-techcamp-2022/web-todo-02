export default class {
    constructor($target, className, onclick) {
        this.$target = $target;
        this.$element = document.createElement('button');

        this.$element.classList.add(className);
        this.$element.addEventListener('click', onclick);
        this.$element.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z" fill="black"/>
        </svg>
        `

        this.$target.appendChild(this.$element);
    }
}