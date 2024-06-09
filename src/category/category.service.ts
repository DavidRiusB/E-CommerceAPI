import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { loadData } from 'src/utils';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * Seeds categories from a JSON file.
   *
   * Loads category data from a JSON file, extracts unique categories, and adds them to the database.
   */
  async seedCategories() {
    const data = loadData<any[]>('../utils/data.json');
    const categoriesData = [...new Set(data.map((item) => item.category))];
    console.log('categoriesData', categoriesData);

    for (const categoryName of categoriesData) {
      await this.categoryRepository.addCategory({ name: categoryName });
    }
  }

  /**
   * Retrieves all categories with pagination.
   *
   * @param {Object} pagination - Pagination parameters.
   * @param {number} pagination.page - The page number.
   * @param {number} pagination.limit - The number of items per page.
   * @returns {Promise<Category[]>} - A promise that resolves to an array of Category entities.
   */
  async getAll(pagination: { page: number; limit: number }) {
    return await this.categoryRepository.findAll(pagination);
  }

  /**
   * Finds a category by its name.
   *
   * @param {string} name - The name of the category.
   * @returns {Promise<Category>} - A promise that resolves to the Category entity.
   * @throws {NotFoundException} - Throws if the category is not found.
   */
  async findByName(name: string) {
    const category = this.categoryRepository.findByName(name);
    if (!category) {
      throw new NotFoundException(`Category: ${name}, not found.`);
    }
    return category;
  }

  /**
   * Finds a category by its ID.
   *
   * @param {string} id - The ID of the category.
   * @returns {Promise<Category>} - A promise that resolves to the Category entity.
   * @throws {NotFoundException} - Throws if the category is not found.
   */
  async findById(id: string) {
    const category = await this.categoryRepository.find(id);
    if (!category) {
      throw new NotFoundException(`Category ID ${id} not found.`);
    }
    return category;
  }

  /**
   * Adds a new category.
   *
   * @param {CategoryDto} category - The data for the new category.
   * @returns {Promise<Category>} - A promise that resolves to the created Category entity.
   */
  async addCategory(category: CategoryDto) {
    try {
      return await this.categoryRepository.create(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Category alredy register');
      }
      throw new InternalServerErrorException('Failed to create new Category');
    }
  }

  /**
   * Updates an existing category with new data.
   *
   * @param {string} id - The ID of the category to update.
   * @param {CategoryDto} update - The new data for the category.
   * @returns {Promise<Category>} - A promise that resolves to the updated Category entity.
   * @throws {NotFoundException} - Throws if the category is not found.
   * @throws {InternalServerErrorException} - Throws if there is an error during the update.
   */
  async update(id: string, update: CategoryDto) {
    try {
      await this.findById(id);
      const categoryUpdate = this.categoryRepository.update(id, update);
      return categoryUpdate;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Fail to update category');
      }
    }
  }
}
