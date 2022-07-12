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
          isAdding: false,
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
        const column = this.state.columns[columnIndex];
        if (column.isAdding) {
          this.setState({
            columns: this.state.columns.map((column, index) =>
              index === columnIndex
                ? { ...column, isAdding: false, cards: column.cards.slice(1) }
                : column
            ),
          });
        } else {
          this.setState({
            columns: this.state.columns.map((column, index) =>
              index === columnIndex
                ? {
                    ...column,
                    isAdding: true,
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
          columns: this.state.columns.map((column, index) =>
            index === columnIndex
              ? {
                  ...column,
                  isAdding: false,
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
          columns: this.state.columns.map((column, index) =>
            index === columnIndex
              ? {
                  ...column,
                  isAdding: false,
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
