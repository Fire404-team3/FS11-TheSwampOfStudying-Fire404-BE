import { HttpExeption } from './http.exception.js';
import { ERROR_MESSAGE } from '#constants';

export class ConflictExceptions extends HttpExeption {
  constructor(message = ERROR_MESSAGE.RESOURCE_CONFLICT, details = null) {
    super(409, message, details);
  }
}
