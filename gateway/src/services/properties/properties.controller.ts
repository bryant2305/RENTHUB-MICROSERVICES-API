import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('properties')
@Controller()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post('properties')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(@Payload() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }
  @Get('get/properties')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @CacheKey(process.env.PROPERTIES_CACHE_KEY) // Clave en el caché
  @CacheTTL(60)
  getAll() {
    return this.propertiesService.getAll();
  }
  @Get('properties/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'find a property' })
  @CacheKey(process.env.PROPERTIES_CACHE_KEY) // Clave en el caché
  @CacheTTL(60)
  find(@Param('id') id: string) {
    return this.propertiesService.findProperty(id);
  }
  @Patch('properties/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.updateProperty(id, updatePropertyDto);
  }
  @Delete('properties/:id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  delete(@Param('id') id: string) {
    return this.propertiesService.deleteProperty(id);
  }
}
