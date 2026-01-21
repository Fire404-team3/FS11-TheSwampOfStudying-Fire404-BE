import { HttpExeption } from './http.exception.js';
import { ERROR_MESSAGE } from '#constants';

export class UnauthorizedException extends HttpExeption {
  constructor(message = ERROR_MESSAGE.UNAUTHORIZED, details = null) {
    super(401, message, details);
  }
}
