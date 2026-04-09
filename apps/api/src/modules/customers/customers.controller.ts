import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles('Super Admin', 'Accountant', 'Field Staff')
  @ApiOperation({ summary: 'Create a new customer' })
  create(
    @Request() req: Request & { user: { id: string } },
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customersService.create(req.user.id, dto);
  }

  @Get()
  @Roles('Super Admin', 'Accountant', 'Field Staff')
  @ApiOperation({ summary: 'List all customers with pagination and search' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Request() req: Request & { user: { id: string } },
    @Query('organizationId') organizationId: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.customersService.findAll(
      req.user.id,
      organizationId,
      search,
      page || 1,
      limit || 10,
    );
  }

  @Get(':id')
  @Roles('Super Admin', 'Accountant', 'Field Staff')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiQuery({ name: 'organizationId', required: true })
  findOne(
    @Request() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.customersService.findOne(req.user.id, id, organizationId);
  }

  @Patch(':id')
  @Roles('Super Admin', 'Accountant')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiQuery({ name: 'organizationId', required: true })
  update(
    @Request() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(req.user.id, id, organizationId, dto);
  }

  @Delete(':id')
  @Roles('Super Admin', 'Accountant')
  @ApiOperation({ summary: 'Soft delete a customer' })
  @ApiQuery({ name: 'organizationId', required: true })
  remove(
    @Request() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.customersService.remove(req.user.id, id, organizationId);
  }
}
