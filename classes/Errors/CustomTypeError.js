module.exports = class CustomTypeError extends Error {
  constructor(expected, received) {
    super(`Expected a ${expected} but received "${typeof received}"`);
    this.name = "CustomTypeError";
  }
};
