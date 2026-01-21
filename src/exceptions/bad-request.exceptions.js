import { HttpExeption } from './http.exception.js';
import { ERROR_MESSAGE } from '#constants';

export class BadRequestException extends HttpExeption {
  constructor(message = ERROR_MESSAGE.BAD_REQUEST, details = null) {
    super(400, message, details);
  }
}
