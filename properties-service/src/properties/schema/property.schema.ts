import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PropertyType } from 'src/enums/property.enum';

@Schema()
export class Property {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, enum: PropertyType })
  propertyType: PropertyType;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  bedrooms: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  availability: boolean;

  // @Prop([String]) // Implementar las imágenes según sea necesario
  // images: string[];

  @Prop({ required: true })
  hostId: number;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
