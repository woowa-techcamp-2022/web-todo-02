class Model {
  constructor() {}

  getAllColumns(callback) {
    fetch('/column')
      .then((res) => {
        console.log(res);
        return res.json();
      })
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
