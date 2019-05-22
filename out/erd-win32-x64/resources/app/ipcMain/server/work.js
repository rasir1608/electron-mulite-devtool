const path = require('path');
const { app } = require('electron');
const Datastore = require('nedb');

const workDb = new Datastore({
  filename: path.join(app.getPath('userData'), '/db/work.db'),
  autoload: true,
});

console.log(path.join(app.getPath('userData'), '/db/work.db'));

module.exports = {
  save(params) {
    return new Promise((resolve, reject) => {
      workDb.insert(params, (err, recoder) => {
        if (err) reject(err);
        else resolve(recoder);
      });
    });
  },
  find(params = {}) {
    return new Promise((resolve, reject) => {
      workDb.find(params, (err, recoder) => {
        if (err) reject(err);
        else resolve(recoder);
      });
    });
  },
  delete(_id) {
    return new Promise((resolve, reject) => {
      workDb.remove({ _id }, {}, (err, recoder) => {
        if (err) reject(err);
        else resolve(recoder);
      });
    });
  },

  update(params = {}) {
    return new Promise((resolve, reject) => {
      workDb.update({ _id: params._id }, { $set: params }, {}, err => {
        if (err) reject(err);
        else resolve(params);
      });
    });
  },
};
