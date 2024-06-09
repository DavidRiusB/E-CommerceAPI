import { HttpStatus, ParseUUIDPipe } from '@nestjs/common';

export const CustomParseUUIDPipe = new ParseUUIDPipe({
  errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
});
