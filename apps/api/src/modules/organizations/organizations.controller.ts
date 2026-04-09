import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  InviteMemberDto,
  SwitchOrganizationDto,
} from './dto/org.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an organization' })
  create(
    @Request() req: Request & { user: { id: string } },
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user organizations' })
  findAll(@Request() req: Request & { user: { id: string } }) {
    return this.organizationsService.findAllForUser(req.user.id);
  }

  @Post(':id/invite')
  @Roles('Super Admin')
  @ApiOperation({ summary: 'Invite a member to the organization' })
  invite(@Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.organizationsService.invite(id, dto);
  }

  @Post('switch')
  @ApiOperation({
    summary:
      'Switch context to another organization (Returns new JWT if multi-tenant context required)',
  })
  switch(
    @Request() req: Request & { user: { id: string } },
    @Body() dto: SwitchOrganizationDto,
  ) {
    // In MVP, this might just validate membership and return success.
    return { success: true, organizationId: dto.organizationId };
  }
}
