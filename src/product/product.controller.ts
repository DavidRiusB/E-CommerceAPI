import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CustomParseUUIDPipe } from 'src/common/validation';
import { ProductDto } from './product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidator } from 'src/common/validation/imageValidator.decorator';
import { RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RemovePropertiesInterceptor } from 'src/common/interceptor/remove-properties.interceptor';

@ApiTags('products')
@Controller('products')
export class ProducController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Retrieves all products with pagination.
   *
   * @param {number} page - The page number (default is 1).
   * @param {number} limit - The number of items per page (default is 5).
   * @returns {Promise<{ data: Product[], total: number, page: number, limit: number }>} The paginated products and total count.
   */
  @Get()
  @ApiOperation({
    summary: 'Retrieve all products with stock > 0, with pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The number of items per page',
    example: 5,
  })
  @ApiResponse({ status: 200, description: 'A paginated list of products.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.productService.getAll({ page, limit });
  }

  /**
   * Retrieves all products with a stock of 0.
   *
   * @returns {Promise<Product[]>} A list of products with stock 0.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('/stock0')
  @ApiOperation({ summary: 'Retrieve all products, including stock 0' })
  async getAllProductsAndSrock0() {
    return await this.productService.getdAllAndStock0();
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {string} id - The ID of the product to fetch.
   * @returns {Promise<Product>} The product with the specified ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product',
    example: '5d35adbc-8e88-4760-8530-91b4a4944ead',
  })
  @ApiResponse({ status: 200, description: 'The product.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProducById(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.productService.getProductById(id);
  }

  /**
   * Creates a new product.
   *
   * @param {ProductDto} product - The data for the new product.
   * @returns {Promise<Product>} The newly created product.
   */
  /* @UseGuards(AuthGuard, RolesGuard) */
  /* @Roles(Role.Admin, Role.SuperAdmin) */
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The created product.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(new RemovePropertiesInterceptor(['product']))
  async createProduct(@Body() product: ProductDto) {
    return this.productService.createProduct(product);
  }

  /**
   * Seeds products from a data file if the database is empty.
   *
   * @returns {Promise<{ message: string }>} A message indicating the seeding result.
   */
  @Post('seeder')
  @ApiOperation({ summary: 'Seed products from data file' })
  @ApiResponse({ status: 201, description: 'Products seeded successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async seedProducts() {
    return this.productService.seedProducts();
  }

  /**
   * Updates an existing product with the provided ID.
   *
   * @param {string} id - The ID of the product to update.
   * @param {ProductDto} product - The DTO containing updated product information.
   * @returns {Promise<Product>} The updated product entity.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the product',
    example: '5d35adbc-8e88-4760-8530-91b4a4944ead',
  })
  @ApiResponse({ status: 200, description: 'The updated product.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async updateProduct(
    @Param('id', CustomParseUUIDPipe)
    id: string,
    @Body() product: ProductDto,
  ) {
    return this.productService.updateProduct(id, product);
  }

  /**
   * Updates the image of a product with the given ID.
   *
   * @param {string} id - The ID of the product to update.
   * @param {Express.Multer.File} image - The new image file.
   * @returns {Promise<Product>} The product with the updated image.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id/uploadImage')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload an image for a product' })
  @ApiParam({ name: 'id', description: 'ID of the product' })
  @ApiResponse({
    status: 200,
    description: 'The product with the updated image.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async uploadProductImage(
    @Param('id', CustomParseUUIDPipe) id: string,
    @UploadedFile(new ImageValidator()) image: Express.Multer.File,
  ) {
    return await this.productService.updateProductImage(id, image);
  }

  /**
   * Deletes a product with the specified ID.
   *
   * @param {string} id - The ID of the product to delete.
   * @returns {Promise<Product>} The deleted product.
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product' })
  @ApiResponse({ status: 200, description: 'The deleted product.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':id')
  async deleteProduct(@Param('id', CustomParseUUIDPipe) id: string) {
    return this.productService.deleteProduct(id);
  }
}
