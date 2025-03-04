import { CreatePropertyDto } from './create-property.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  id: string;
}
