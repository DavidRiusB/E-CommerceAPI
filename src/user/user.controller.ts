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
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';

import { CustomParseUUIDPipe } from 'src/common/validation';
import { UserDto } from './user.dto';
import { AuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Admin } from 'typeorm';
import { Role } from 'src/common/enums';
import { RemovePropertiesInterceptor } from 'src/common/interceptor/remove-properties.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieve a paginated list of users.
   * @param page - The page number (default: 1).
   * @param limit - The number of items per page (default: 5).
   * @returns A paginated list of users.
   */
  @Get()
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve a paginated list of users' })
  @ApiBearerAuth()
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
  @ApiResponse({ status: 200, description: 'A paginated list of users.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.userService.getAllUsers({ page, limit });
  }

  /**
   * Retrieve a user by ID.
   * @param id - The UUID of the user to retrieve.
   * @returns The user with the given ID.
   */
  @Get(':id')
  @UseInterceptors(new RemovePropertiesInterceptor(['deletedAt', 'role']))
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the user to retrieve',
    example: 'e7da6a08-7992-4f29-9df6-29daab9fba74',
  })
  @ApiResponse({ status: 200, description: 'The user with the given ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  getUserById(@Param('id', CustomParseUUIDPipe) id: string) {
    console.log('controller', id);
    return this.userService.getUserById(id);
  }

  /* @Post()
  @UsePipes(GlobalValidationPipe)
  createUser(@Body() user: UserDto) {
    return this.userService.createUser(user);
  } */

  /**
   * Update a user by ID.
   * @param id - The UUID of the user to update.
   * @param user - The new user data.
   * @returns The updated user.
   */
  @Put(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the user to update',
    example: 'e7da6a08-7992-4f29-9df6-29daab9fba74',
  })
  @ApiResponse({ status: 200, description: 'The updated user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  updateUser(
    @Param('id', CustomParseUUIDPipe)
    id: string,
    @Body() user: UserDto,
  ) {
    return this.userService.updateUser(id, user);
  }

  /**
   * Soft delete a user by ID.
   * @param id - The UUID of the user to delete.
   * @returns The deleted user.
   */
  @Delete(':id')
  @Roles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(new RemovePropertiesInterceptor(['deletedAt']))
  @UseInterceptors(new RemovePropertiesInterceptor(['deletedAt']))
  @ApiOperation({ summary: 'Soft delete a user by ID' })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the user to delete',
    example: 'e7da6a08-7992-4f29-9df6-29daab9fba74',
  })
  @ApiResponse({ status: 200, description: 'The deleted user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  deleteUser(@Param('id', CustomParseUUIDPipe) id: string) {
    console.log(id);
    return this.userService.deleteUser(id);
    //mising correct succes messege
  }

  @Patch('admin/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Upgrade a user to admin role' })
  @ApiResponse({ status: 200, description: 'User role upgraded to admin.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Failed to upgrade user role.' })
  async upgradeRol(@Param('id', CustomParseUUIDPipe) id: string) {
    return await this.userService.upgradeRol(id);
  }
}
