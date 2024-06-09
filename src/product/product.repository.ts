import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ProductDto } from './product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/category/category.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Adds a new product to the repository.
   *
   * @param {Partial<Product>} productData - The data for the new product.
   * @returns {Promise<Product>} The newly added product.
   */
  addProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  /**
   * Finds a product by its ID.
   *
   * @param {string} id - The ID of the product to find.
   * @returns {Promise<Product>} The found product.
   */
  async findById(id: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  /**
   * Finds all products with pagination.
   *
   * @param {Object} pagination - Pagination details.
   * @param {number} pagination.page - The page number.
   * @param {number} pagination.limit - The number of items per page.
   * @returns {Promise<{ data: Product[], total: number, page: number, limit: number }>} The paginated products and total count.
   */
  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [products, total] = await this.productRepository
      .createQueryBuilder('product')
      .where('product.stock > 0')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data: products, total, page, limit };
  }

  /**
   * Finds all products including those with zero stock.
   *
   * @returns {Promise<Product[]>} A list of all products.
   */
  async findAllAndStock0() {
    return await this.productRepository.find();
  }

  /**
   * Creates a new product with the given data and category.
   *
   * @param {ProductDto} productData - The data for the new product.
   * @param {Category} category - The category to assign to the new product.
   * @returns {Promise<Product>} The newly created product.
   * @throws ConflictException if a product with the same name already exists.
   * @throws InternalServerErrorException if product creation fails.
   */
  async create(productData: ProductDto, category: Category): Promise<Product> {
    const { name, description, price, stock, imgUrl } = productData;
    try {
      const newProduct = new Product();
      newProduct.name = name;
      newProduct.description = description;
      newProduct.price = price;
      newProduct.stock = stock;
      newProduct.imgUrl = imgUrl;
      newProduct.category = category;
      await this.productRepository.save(newProduct);
      return newProduct;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Product with this name already exists');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  /**
   * Updates the image of a product with the given ID.
   *
   * @param {string} newImage - The new image URL.
   * @param {string} id - The ID of the product to update.
   * @returns {Promise<Product>} The updated product.
   * @throws Error if the product is not found.
   */
  async updateImage(newImage: string, id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error('Product not found');
    }
    product.imgUrl = newImage;
    await this.productRepository.save(product);
    return product;
  }

  /**
   * Finds all products for seeding purposes.
   *
   * @returns {Promise<Product[]>} A list of all products.
   */
  async findAllSeeder(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  /**
   * Updates an existing product with new data and category.
   * @param product - The existing product entity to be updated.
   * @param update - The DTO containing updated product information.
   * @param category - The new category entity to assign to the product.
   * @returns Promise<Product> - The updated product entity.
   */
  async update(
    product: Product,
    update: ProductDto,
    category: Category,
  ): Promise<Product> {
    const { name, description, price, stock, imgUrl } = update;

    // Update fields with new values
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.imgUrl = imgUrl;
    product.category = category;

    return await this.productRepository.save(product);
  }

  /**
   * Soft deletes a product with the given ID.
   *
   * @param {string} id - The ID of the product to delete.
   * @returns {Promise<DeleteResult>} The result of the soft delete operation.
   */
  async delete(id: string) {
    const result = await this.productRepository.softDelete(id);

    return result;
  }

  /**
   * Fetches products by their IDs.
   *
   * @param {string[]} ids - The IDs of the products to fetch.
   * @returns {Promise<{ products: Product[] }>} The fetched products.
   */
  async fetchProductsByIds(ids: string[]) {
    // Fetch product details
    const products = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.stock',
        'product.imgUrl',
        'product.categoryId',
      ])
      .where('product.id IN (:...ids)', { ids })
      .andWhere('product.stock > 0')
      .getMany();

    return { products };
  }
}
