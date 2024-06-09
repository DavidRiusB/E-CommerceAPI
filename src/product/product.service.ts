import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { ProductDto } from './product.dto';
import { CategoryService } from 'src/category/category.service';
import { loadData } from 'src/utils';
import { CloudinaryService } from 'src/cloudinary/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  /**
   * Seeds products from a data file if the database is empty.
   *
   * @returns {Promise<{ message: string }>} A message indicating the seeding result.
   * @throws Error if there is an issue during the seeding process.
   */
  async seedProducts() {
    try {
      const productsOnDB = await this.productRepository.findAllSeeder();

      if (productsOnDB.length === 0) {
        const data = loadData<any[]>('data.json');

        // First seed categories
        await this.categoryService.seedCategories();

        // Check for duplicates
        const productMap = new Map<string, any>();
        data.forEach((product) => {
          if (!productMap.has(product.name)) {
            productMap.set(product.name, product);
          }
        });

        const uniqueProducts = Array.from(productMap.values());

        // Seed Products
        for (const productData of uniqueProducts) {
          const category = await this.categoryService.findByName(
            productData.category,
          );

          if (category) {
            await this.productRepository.addProduct({
              ...productData,
              category,
            });
          }
        }
        console.log('Products seeded successfully');
        return { message: 'Products seeded successfully' };
      }
      console.log('DB contains products');
      return { message: 'DB contains products' };
    } catch (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  }

  /**
   * Retrieves all products with stock > 0, and with pagination.
   *
   * @param {Object} pagination - Pagination details.
   * @param {number} pagination.page - The page number.
   * @param {number} pagination.limit - The number of items per page.
   * @returns {Promise<Product[]>} A list of products.
   */
  getAll(pagination: { page: number; limit: number }) {
    return this.productRepository.findAll(pagination);
  }

  /**
   * Retrieves all products including stock of 0.
   *
   * @returns {Promise<Product[]>} A list of products with stock 0.
   */
  async getdAllAndStock0() {
    return await this.productRepository.findAllAndStock0();
  }

  /**
   * Creates a new product.
   *
   * @param {ProductDto} productData - The data for the new product.
   * @returns {Promise<Product>} The newly created product.
   */
  async createProduct(productData: ProductDto): Promise<Product> {
    try {
      const category = await this.categoryService.findById(
        productData.category,
      );

      const newProduct = await this.productRepository.create(
        productData,
        category,
      );
      return newProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23514') {
        throw new BadRequestException('Invalid stock amount');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  /**
   * Updates an existing product with the provided ID.
   *
   * @param {string} id - The ID of the product to update.
   * @param {ProductDto} update - The DTO containing updated product information.
   * @returns {Promise<Product>} The updated product entity.
   * @throws NotFoundException if the product or category is not found.
   */
  async updateProduct(id: string, update: ProductDto): Promise<Product> {
    try {
      // Retrieve the existing product
      const product = await this.productRepository.findById(id);

      // Retrieve the new category by its ID
      const category = await this.categoryService.findById(update.category);

      //Mising habdle updte image

      // Update the product using the repository method
      return await this.productRepository.update(product, update, category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23514') {
        throw new BadRequestException('Invalid stock amount');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  /**
   * Deletes a product with the specified ID.
   *
   * @param {string} id - The ID of the product to delete.
   * @returns {Promise<Product>} The deleted product.
   * @throws InternalServerErrorException if the product deletion fails.
   */
  async deleteProduct(id: string): Promise<Product> {
    const product = await this.getProductById(id);

    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Failed to delete product with ID ${id}`,
      );
    }

    return product;
  }

  /**
   * Retrieves products by their IDs.
   *
   * @param {string[]} ids - The IDs of the products to fetch.
   * @returns {Promise<Product[]>} A list of products.
   */
  async getProductsByIds(ids: string[]) {
    return await this.productRepository.fetchProductsByIds(ids);
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {string} id - The ID of the product to fetch.
   * @returns {Promise<Product>} The product with the specified ID.
   * @throws NotFoundException if the product is not found.
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product ID ${id} not foud.`);
    }

    return product;
  }

  /**
   * Updates the image of a product.
   *
   * @param {string} id - The ID of the product to update.
   * @param {Express.Multer.File} image - The new image file.
   * @returns {Promise<Product>} The product with the updated image.
   * @throws Error if the image update fails.
   */
  async updateProductImage(
    id: string,
    image: Express.Multer.File,
  ): Promise<Product> {
    try {
      const result: UploadApiResponse =
        await this.cloudinaryService.uploadImage(image);
      const newImage = result.secure_url;

      return await this.productRepository.updateImage(newImage, id);
    } catch (error) {
      // Handle specific errors, log them, or re-throw if needed
      throw new Error(`Failed to update product image: ${error.message}`);
    }
  }
}
