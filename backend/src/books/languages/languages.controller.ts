import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LanguagesService } from './languages.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { LocalizedLanguageNames } from '@cospired/i18n-iso-languages';
import { Language } from './entites/language.entity';

@ApiTags('Books/Languages')
@Public()
@Controller()
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  // ~ Static ~
  // * ######  GET /books/languages/static ######
  @ApiOperation({
    summary: 'Get all the static languages',
    description: 'Get all the static languages (all the world languages).',
  })
  @ApiOkResponse({
    description: 'All the languages.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ES: { type: 'string', example: 'spanish' },
          EN: { type: 'string', example: 'english' },
          CA: { type: 'string', example: 'catalan' },
          GL: { type: 'string', example: 'galician' },
          EU: { type: 'string', example: 'basque' },
          FR: { type: 'string', example: 'french' },
          DE: { type: 'string', example: 'german' },
          IT: { type: 'string', example: 'italian' },
          PT: { type: 'string', example: 'portuguese' },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('static')
  getAllStatic(): LocalizedLanguageNames {
    return this.languagesService.getAllStatic();
  }

  // * ######  GET /books/languages/static/top ######
  @ApiOperation({
    summary: 'Get the main static languages',
    description: 'Get the main static languages.',
  })
  @ApiOkResponse({
    description: 'The main languages.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ES: { type: 'string', example: 'spanish' },
          EN: { type: 'string', example: 'english' },
          CA: { type: 'string', example: 'catalan' },
          GL: { type: 'string', example: 'galician' },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('static/top')
  getMostUsedStatic(): LocalizedLanguageNames {
    return this.languagesService.getMostUsedStatic();
  }

  // * ######  GET /books/languages/static/:alpha2 ######
  @ApiOperation({
    summary: 'Get a language by its alpha2 code',
    description: 'Get a language by its alpha2 code.',
  })
  @ApiParam({ name: 'alpha2', example: 'ES' })
  @ApiOkResponse({
    description: 'The language.',
    schema: {
      type: 'object',
      properties: {
        ES: { type: 'string', example: 'spanish' },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('static/:alpha2')
  getOneStatic(@Param('alpha2') alpha2: string): string | undefined {
    return this.languagesService.getOneStatic(alpha2);
  }

  // ~ CRUD ~
  // * ######  GET /books/languages/:id ######
  @ApiOperation({
    summary: 'Get a language by id',
    description: 'Get a language by id.',
  })
  @ApiOkResponse({
    description: 'The language.',
    type: Language,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Language> {
    return this.languagesService.findOneById(+id);
  }

  // * ######  DELETE /books/languages/:id ######
  @ApiOperation({
    summary: 'Delete a language by id',
    description: 'Delete a language by id.',
  })
  @ApiNoContentResponse({
    description: 'The language has been deleted.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.languagesService.delete(+id);
  }
}
