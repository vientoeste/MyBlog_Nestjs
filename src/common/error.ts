export class NoMoreContentError extends Error {
  constructor(message?: string) {
    super(message || 'No more content available');
    this.name = 'NoMoreContentError';
  }
}
