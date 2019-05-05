const fs = require('fs');
const path = require('path');
const { dbDir: dir } = require('../utils/config');

const dbName = 'user.txt';
const dbDir = path.join(__dirname, '../', dir);
const dbPath = path.join(dbDir, dbName);

const createFile = () => {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir);
      fs.writeFileSync(dbPath, JSON.stringify([]));
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  save(params) {
    try {
      createFile();
      const ctx = fs.readFileSync(dbPath);
      const userList = JSON.parse(ctx || JSON.stringify([]));
      const maxId = Math.max(...userList.map(({id}) => id));
      fs.writeFileSync(dbPath, JSON.stringify([...userList, { id: maxId + 1, ...params }]));
      return maxId + 1;
    } catch (err) {
      throw err;
    }
  },
  query() {
    try {
      createFile();
      const ctx = fs.readFileSync(dbPath);
      const userList = JSON.parse(ctx || JSON.stringify([]));
      return userList;
    } catch (err) {
      throw err;
    }
  },
  delete() {},
};
