import { HttpException } from '@nestjs/common';

export class NoMoreContentError extends Error {
  constructor(message?: string) {
    super(message || 'No more content available');
    this.name = 'NoMoreContentError';
  }
}

export class NotUpdatedException extends HttpException {
  constructor() {
    super('Not updated', 304);
    this.name = 'NotUpdatedException';
  }
}
