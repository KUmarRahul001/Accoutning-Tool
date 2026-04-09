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
import { VendorsService } from './vendors.service';
import { CreateVendorDto, UpdateVendorDto } from './dto/vendor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles('Super Admin', 'Accountant', 'Field Staff')
  @ApiOperation({ summary: 'Create a new vendor' })
  create(
    @Request() req: Request & { user: { id: string } },
    @Body() dto: CreateVendorDto,
  ) {
    return this.vendorsService.create(req.user.id, dto);
  }

  @Get()
  @Roles('Super Admin', 'Accountant', 'Field Staff')
  @ApiOperation({ summary: 'List all vendors with pagination and search' })
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
    return this.vendorsService.findAll(
      req.user.id,
      organizationId,
      search,
      page || 1,
      limit || 10,
    );
  }

  @Get(':id')
  @Roles('Super Admin', 'Accountant', 'Field Staff')
  @ApiOperation({ summary: 'Get a vendor by ID' })
  @ApiQuery({ name: 'organizationId', required: true })
  findOne(
    @Request() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.vendorsService.findOne(req.user.id, id, organizationId);
  }

  @Patch(':id')
  @Roles('Super Admin', 'Accountant')
  @ApiOperation({ summary: 'Update a vendor' })
  @ApiQuery({ name: 'organizationId', required: true })
  update(
    @Request() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
    @Body() dto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(req.user.id, id, organizationId, dto);
  }

  @Delete(':id')
  @Roles('Super Admin', 'Accountant')
  @ApiOperation({ summary: 'Soft delete a vendor' })
  @ApiQuery({ name: 'organizationId', required: true })
  remove(
    @Request() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ) {
    return this.vendorsService.remove(req.user.id, id, organizationId);
  }
}
