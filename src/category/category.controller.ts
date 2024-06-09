import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import { CustomParseUUIDPipe } from 'src/common/validation';
import { CategoryDto } from './category.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  /**
   * Seed categories from a JSON file.
   *
   * @returns {Promise<void>} A promise indicating the completion of seeding process.
   */
  @Post('seeder')
  @ApiOperation({ summary: 'Seed categories from a JSON file' })
  async seedCategories() {
    return this.categoriesService.seedCategories();
  }

  /**
   * Add a new category.
   *
   * @param {CategoryDto} category - The data for the new category.
   * @returns {Promise<Category>} The created Category entity.
   */
  @Post('add')
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Add a new category' })
  @ApiResponse({
    status: 201,
    description: 'The created category.',
    type: Category,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async addCategory(@Body() category: CategoryDto) {
    return this.categoriesService.addCategory(category);
  }

  /**
   * Update an existing category by ID.
   *
   * @param {string} id - The ID of the category to update.
   * @param {CategoryDto} category - The new data for the category.
   * @returns {Promise<Category>} The updated Category entity.
   */
  @Put('update/:id')
  @ApiOperation({ summary: 'Update an existing category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category' })
  @ApiResponse({
    status: 200,
    description: 'The updated category.',
    type: Category,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  async updateCategory(
    @Param('id', CustomParseUUIDPipe) id: string,
    @Body() category: CategoryDto,
  ) {
    return this.categoriesService.update(id, category);
  }

  /**
   * Retrieve all categories with pagination.
   *
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<Category[]>} An array of Category entities.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all categories with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of categories.',
    type: Category,
    isArray: true,
  })
  async getAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.categoriesService.getAll({ page, limit });
  }

  /**
   * Retrieve a category by its ID.
   *
   * @param {string} id - The ID of the category to retrieve.
   * @returns {Promise<Category>} The Category entity.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiParam({ name: 'id', description: 'ID of the category' })
  @ApiResponse({
    status: 200,
    description: 'The requested category.',
    type: Category,
  })
  async getCategoryById(@Param('id', CustomParseUUIDPipe) id: string) {
    return await this.categoriesService.findById(id);
  }
}
