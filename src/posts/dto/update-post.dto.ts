export class UpdatePostDto {
  // [TODO] check if constructor may occur error
  constructor(obj?: { title?: string, content?: string, categoryId?: number }) {
    if (typeof obj !== 'undefined' && obj.title !== undefined) {
      console.log(obj);
      this.title = obj.title;
    }
    if (typeof obj !== 'undefined' && obj.categoryId !== undefined) {
      this.categoryId = obj.categoryId;
    }
    if (typeof obj !== 'undefined' && obj.content !== undefined) {
      this.content = obj.content;
    }
  }

  readonly title?: string;

  readonly content?: string;

  readonly categoryId?: number;
}
