import { test } from '@/service/work';

export default {
  namespace: 'work',

  state: {},

  effects: {
    *test({ payload }, { call }) {
      return yield call(test, payload);
    },
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
