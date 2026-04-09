import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto, InviteMemberDto } from './dto/org.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrganizationDto) {
    let role = await this.prisma.role.findUnique({
      where: { name: 'Super Admin' },
    });
    if (!role) {
      role = await this.prisma.role.create({ data: { name: 'Super Admin' } });
    }

    const org = await this.prisma.organization.create({
      data: {
        name: dto.name,
        legalName: dto.legalName,
        gstin: dto.gstin,
        stateCode: dto.stateCode,
        members: {
          create: {
            userId,
            roleId: role.id,
          },
        },
      },
    });

    return org;
  }

  async findAllForUser(userId: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      include: { organization: true, role: true },
    });
    return memberships.map((m) => ({
      ...m.organization,
      role: m.role.name,
    }));
  }

  async invite(organizationId: string, dto: InviteMemberDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({
      where: { name: dto.roleName },
    });
    if (!role) throw new NotFoundException('Role not found');

    const existing = await this.prisma.organizationMember.findUnique({
      where: { userId_organizationId: { userId: user.id, organizationId } },
    });
    if (existing) throw new BadRequestException('User already in organization');

    await this.prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId,
        roleId: role.id,
      },
    });

    return { success: true };
  }
}
