import {
  saveWorkSpace,
  getWorkSpacePath,
  queryWorkList,
  checkWorkName,
  runWorkCode,
  updateWorkSpace,
  killWork,
} from '@/service/work';

export default {
  namespace: 'work',

  state: {
    tabWorkList: [],
    allWorkList: [],
    activeKey: undefined,
  },

  effects: {
    *getWorkSpacePath(_, { call }) {
      const ret = yield call(getWorkSpacePath);
      return ret;
    },
    *saveWorkSpace({ payload }, { call }) {
      const ret = yield call(saveWorkSpace, payload);
      return ret;
    },
    *queryWorkList({ payload }, { call }) {
      const ret = yield call(queryWorkList, payload);
      return ret;
    },
    *checkWorkName({ payload }, { call }) {
      const ret = yield call(checkWorkName, payload);
      return ret;
    },
    *runWorkCode({ payload }, { call }) {
      const ret = yield call(runWorkCode, payload);
      return ret;
    },
    *updateWorkSpace({ payload }, { call }) {
      const ret = yield call(updateWorkSpace, payload);
      return ret;
    },
    *killWork({ payload }, { call }) {
      const ret = yield call(killWork, payload);
      return ret;
    },
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    addWorkSpace(state, { payload }) {
      let { tabWorkList } = state;
      const index = tabWorkList.findIndex(({ _id }) => payload._id === _id);
      if (index === -1) tabWorkList = [...tabWorkList, payload];
      else {
        tabWorkList[index] = payload;
        tabWorkList = [...tabWorkList];
      }
      return {
        ...state,
        tabWorkList,
        activeKey: payload._id,
      };
    },
  },
};
