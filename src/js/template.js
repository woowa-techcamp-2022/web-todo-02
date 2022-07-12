export default class {
  constructor() {}

  cardForm(id) {
    return ` 
      <li class="card" data-id="${id}">
        <form class="card-form">
          <input type="text" name="title" />
          <input type="text" name="content" />
          <button class="card-submitbtn">등록</button>
        </form>
      </li>
    `;
  }

  card(card) {
    const { id, title, content } = card;
    return `
      <li class="card" data-id="${id}">
        <article>
          <header class="card-header">
            <h3 class="card-header-title">${title}</h3>
            <button class="card-header-delete">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z"
                  fill="black"
                />
              </svg>
            </button>
          </header>
          <p class="card-content">${content}</p>
          <footer class="card-author">author by web</footer>
        </article>
      </li>
    `;
  }

  column(column) {
    const { id, title, cards } = column;
    return `
      <section class="column" data-id="${id}">
        <div class="column-header">
          <div>
            <h2 class="column-header-title">${title}</h2>
            <div class="column-header-counter">${cards.length}</div>
          </div>
          <div>
            <button class="column-header-add">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.10571
                12.5303L5.10571
                11.4697H11.4697V5.10571H12.5303V11.4697H18.8943V12.5303H12.5303V18.8943H11.4697V12.5303H5.10571Z"
                  fill="black"
                />
              </svg>
            </button>
            <button class="column-header-delete">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 17.25L6.75 16.5L11.25 12L6.75 7.5L7.5 6.75L12 11.25L16.5 6.75L17.25 7.5L12.75 12L17.25 16.5L16.5 17.25L12 12.75L7.5 17.25Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </div>
        <ul class="column-cards">
          ${cards.map((card) => this.card(card)).join('')}
        </ul>
      </section>`;
  }
}
