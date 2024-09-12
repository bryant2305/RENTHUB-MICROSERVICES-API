import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('properties')
@Controller()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('properties')
  create(@Payload() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }
  @Get('get/properties')
  @CacheKey('properties') // Clave en el caché
  @CacheTTL(60)
  getAll() {
    return this.propertiesService.getAll();
  }
  @Get('properties/:id')
  find(@Param('id') id: string) {
    return this.propertiesService.findProperty(id);
  }
  @Patch('properties/:id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto);
  }
  @Delete('properties/:id')
  delete(@Param('id') id: string) {
    return this.propertiesService.deleteProperty(id);
  }
}
