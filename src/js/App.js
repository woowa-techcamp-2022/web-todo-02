import Columns from './components/Columns.js';

export default class {
  constructor($app) {
    this.state = {
      columns: [
        {
          title: 'title',
          isAdding: false,
          cards: [
            {
              title: 'title',
              content: 'cotent',
              author: 'author',
              isWriting: false,
            },
          ],
        },
        {
          title: 'title',
          cards: [{ title: 'title', content: 'cotent', author: 'author' }],
        },
      ],
    };

    this.columns = new Columns({
      $app,
      initialState: {
        columns: this.state.columns,
      },
      onClickCardAddButton(event) {
        const $column = event.target.closest('.column');
        const columnIndex = Number($column.dataset.index);
        if (this.state.isAdding) {
          this.setState({
            isAdding: false,
            columns: this.state.columns.map((column, index) =>
              index === columnIndex
                ? { ...column, cards: column.cards.slice(1) }
                : column
            ),
          });
        } else {
          this.setState({
            isAdding: true,
            columns: this.state.columns.map((column, index) =>
              index === columnIndex
                ? {
                    ...column,
                    cards: [
                      {
                        title: '',
                        content: '',
                        author: '',
                        isWriting: true,
                      },
                      ...column.cards,
                    ],
                  }
                : column
            ),
          });
        }
      },
      onAddCard(event) {
        event.preventDefault();
        const $card = event.target.closest('.card');
        const $column = event.target.closest('.column');
        const columnIndex = Number($column.dataset.index);
        const cardIndex = Number($card.dataset.index);
        const title = event.target.title.value;
        const content = event.target.title.value;
        this.setState({
          isAdding: false,
          columns: this.state.columns.map((column, index) =>
            index === columnIndex
              ? {
                  ...column,
                  cards: column.cards.map((card, index) =>
                    index === cardIndex
                      ? {
                          title: title,
                          content: content,
                          author: '',
                          isWriting: false,
                        }
                      : card
                  ),
                }
              : column
          ),
        });
      },
      onDeleteCard(event) {
        const $card = event.target.closest('.card');
        const $column = event.target.closest('.column');
        const columnIndex = Number($column.dataset.index);
        const cardIndex = Number($card.dataset.index);
        this.setState({
          isAdding: false,
          columns: this.state.columns.map((column, index) =>
            index === columnIndex
              ? {
                  ...column,
                  cards: column.cards.filter(
                    (card, index) => index !== cardIndex
                  ),
                }
              : column
          ),
        });
      },
    });
  }

  setState(nextState) {
    this.state = { ...this.state, ...nextState };
    const { columns } = this.state;
    this.columns.setState({ columns });
  }
}
