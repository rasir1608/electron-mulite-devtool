module.exports = {
  error(msg = null) {
    return {
      ok: false,
      msg,
      data: null,
    };
  },
  success(data = null) {
    return {
      ok: true,
      data,
      msg: null,
    };
  },
  handler(ok = false, data = null, msg = null) {
    return {
      ok,
      data,
      msg,
    };
  },
};
