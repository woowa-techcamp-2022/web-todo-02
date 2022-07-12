export default class {
    constructor($target, className, onclick) {
        this.$target = $target;
        this.$element = document.createElement('button');

        this.$element.classList.add(className);
        this.$element.addEventListener('click', onclick);
        this.$element.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.10571 12.5303L5.10571 11.4697H11.4697V5.10571H12.5303V11.4697H18.8943V12.5303H12.5303V18.8943H11.4697V12.5303H5.10571Z" fill="black"/>
        </svg>
        `

        this.$target.appendChild(this.$element);
    }
}