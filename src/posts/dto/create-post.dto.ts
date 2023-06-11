import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(60)
  readonly title: string;

  @IsString()
  @MaxLength(8000)
  readonly content: string;

  @IsInt()
  readonly categoryId: number;
}
