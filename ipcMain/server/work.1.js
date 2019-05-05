const fs = require('fs');
const path = require('path');
const { dbDir: dir } = require('../utils/config');

const dbName = 'work.txt';
const dbDir = path.join(__dirname, dir);
const dbPath = path.join(dbDir, dbName);

const checkFile = () => {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir);
    }
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify([]), { encoding: 'utf-8' });
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  write(workSpaceList) {
    try {
      checkFile();
      fs.writeFileSync(dbPath, JSON.stringify(workSpaceList || []), { encoding: 'utf-8' });
    } catch (err) {
      throw err;
    }
  },
  save(params) {
    try {
      checkFile();
      const workSpaceList = this.query();
      const maxId =
        Array.isArray(workSpaceList) && workSpaceList.length > 0
          ? Math.max(...workSpaceList.map(({ id }) => id))
          : 0;
      this.write([...workSpaceList, { id: maxId + 1, ...params }]);
      return maxId + 1;
    } catch (err) {
      throw err;
    }
  },
  query() {
    try {
      checkFile();
      const ctx = fs.readFileSync(dbPath);
      const workSpaceList = JSON.parse(ctx || JSON.stringify([]));
      return workSpaceList;
    } catch (err) {
      throw err;
    }
  },
  delete(id) {
    try {
      let workSpaceList = this.query();
      workSpaceList = workSpaceList.filter(({ id: wId }) => wId !== id);
      this.write(workSpaceList);
    } catch (err) {
      throw err;
    }
  },

  edite(params = {}) {
    try {
      const workSpaceList = this.query();
      const { id } = params;
      const index = workSpaceList.findIndex(({ id: wId }) => wId !== id);
      if (index !== -1) {
        const workSpace = workSpaceList[index];
        Object.assign(workSpace, params);
        workSpaceList.splice(index, workSpace, 1);
        this.write(workSpaceList);
      } else {
        throw new Error('未查找到工作空间数据！');
      }
    } catch (err) {
      throw err;
    }
  },
};
