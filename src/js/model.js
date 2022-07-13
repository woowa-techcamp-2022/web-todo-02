class Model {
  constructor() {}

  getAllColumns(callback) {
    fetch('/column')
      .then((res) => res.json())
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

const model = new Model();
export default model;
