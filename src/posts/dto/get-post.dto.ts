export class PostDTO {
  readonly uuid: string;

  readonly title: string;

  readonly content: string;

  readonly categoryId: number;

  readonly createdAt: string;

  readonly updatedAt: string;

  readonly comments: {
    uuid: string,
    userUuid: string,
    username: string,
    content: string,
    createdAt: string
  }[];
}

export class FetchPostDTO {
  readonly uuid: string;

  readonly title: string;

  readonly content: string;

  readonly category_id: number;

  readonly created_at: string;

  readonly updated_at: string;

  readonly comment_uuid: string;

  readonly comment: string;

  readonly user_uuid: string;

  readonly username: string;

  readonly comment_created_at: string;
}
