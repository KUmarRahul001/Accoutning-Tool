import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { CustomersModule } from './modules/customers/customers.module';
import { VendorsModule } from './modules/vendors/vendors.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    CustomersModule,
    VendorsModule,
  ],
})
export class AppModule {}
