import { HttpException } from '@nestjs/common';

export class NoMoreContentException extends HttpException {
  constructor(message?: string) {
    super(message || 'No more content available', 404);
    this.name = 'NoMoreContentException';
  }
}

export class NotUpdatedException extends HttpException {
  constructor() {
    super('Not updated', 304);
    this.name = 'NotUpdatedException';
  }
}
