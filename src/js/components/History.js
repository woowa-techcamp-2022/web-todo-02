export default class {
  constructor({
    act,
    title,
    from_col: fromColumn,
    to_col: toColumn,
    created_time: createdTime,
  }) {
    this.$element = document.createElement('li');
    this.state = {
      act,
      title,
      fromColumn,
      toColumn,
      createdTime,
    };

    this.init();
  }

  init() {
    this.$element.classList.add('history-card');
    this.render();
  }

  timeForToday() {
    const today = new Date();
    const timeValue = new Date(this.state.createdTime);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
      return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  }

  makeStatement() {
    switch (this.state.act) {
      case 'add':
        return `${this.state.fromColumn}에 ${this.state.title} 카드를 등록하였습니다.`;
      case 'remove':
        return `${this.state.fromColumn}의 ${this.state.title} 카드를 삭제하였습니다.`;
      case 'update':
        return `${this.state.fromColumn}의 ${this.state.title} 카드를 수정하였습니다.`;
      case 'move':
        return `${this.state.fromColumn}의 ${this.state.title} 카드를 ${this.state.toColumn}로 이동하였습니다.`;
    }
  }

  getElement() {
    return this.$element;
  }

  render() {
    this.$element.innerHTML = `
            <div class="history-card-title">${this.makeStatement()}</div>
            <div class="history-card-time">${this.timeForToday()}</div>
        `;
  }
}
