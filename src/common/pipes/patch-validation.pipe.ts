import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

// [TODO] needs to find a better way than this; must input keys at controller layer currently
export class PatchValidationPipe<T> implements PipeTransform {
  constructor(keys: string[]) {
    this.keys = keys;
  }

  private keys: string[];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: T, _metadata: ArgumentMetadata) {
    if (this.keys.length === Object.keys(value).length) {
      throw new BadRequestException('inappropriate req body');
    } else {
      return value;
    }
  }
}
