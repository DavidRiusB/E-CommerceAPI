import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './category.dto';
import { skip } from 'node:test';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Retrieves all categories from the database.
   *
   * @returns {Promise<Category[]>} - A promise that resolves to an array of Category entities.
   */
  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  /**
   * Retrieves categories with pagination.
   *
   * @param {Object} pagination - Pagination parameters.
   * @param {number} pagination.page - The page number.
   * @param {number} pagination.limit - The number of items per page.
   * @returns {Promise<Category[]>} - A promise that resolves to an array of Category entities.
   */
  findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    return this.categoryRepository.find({
      skip: offset,
      take: limit,
    });
  }
  /**
   * Finds a category by its name.
   *
   * @param {string} name - The name of the category.
   * @returns {Promise<Category | undefined>} - A promise that resolves to the Category entity or undefined if not found.
   */
  async findByName(name: string) {
    return this.categoryRepository.findOne({ where: { name } });
  }

  /**
   * Adds a new category to the database.
   *
   * @param {Partial<Category>} categoryData - The data for the new category.
   * @returns {Promise<Category>} - A promise that resolves to the created Category entity.
   */
  async addCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  /**
   * Finds a category by its ID, including related products.
   *
   * @param {string} id - The ID of the category.
   * @returns {Promise<Category | undefined>} - A promise that resolves to the Category entity or undefined if not found.
   */
  async find(id: string) {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  /**
   * Creates a new category.
   *
   * @param {CategoryDto} category - The data for the new category.
   * @returns {Promise<Category>} - A promise that resolves to the created Category entity.
   */
  async create(category: CategoryDto): Promise<Category> {
    const { name, description } = category;
    const newCategory = new Category();
    newCategory.name = name;
    newCategory.description = description;
    newCategory.product = [];

    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  /**
   * Updates an existing category with new data.
   *
   * @param {string} id - The ID of the category to update.
   * @param {CategoryDto} update - The new data for the category.
   * @returns {Promise<Category>} - A promise that resolves to the updated Category entity.
   */
  async update(id: string, update: CategoryDto): Promise<Category> {
    await this.categoryRepository.update(id, update);
    return this.categoryRepository.findOneBy({ id });
  }
}
