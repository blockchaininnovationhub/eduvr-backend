export default class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.name = "ValidationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}
