import { signin, signup } from '@/service/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {
      userName: null,
      role: 'admin',
      roleList: [],
    },
  },

  effects: {
    *signin({ payload }, { call }) {
      const ret = yield call(signin, payload);
      return ret;
    },
    *signup({ payload }, { call }) {
      const ret = yield call(signup, payload);
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
  },
};
