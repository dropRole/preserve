import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffereesModule } from 'src/offerees/offerees.module';
import { OffereesRepository } from 'src/offerees/offerees.repository';
import { AccountsRepository } from './accounts.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { OfferorsModule } from 'src/offerors/offerors.module';
import { OfferorsRepository } from 'src/offerors/offerors.repository';
import { PrivilegesGuard } from './privileges.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      AccountsRepository,
      OfferorsRepository,
      OffereesRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    forwardRef(() => OfferorsModule),
    forwardRef(() => OffereesModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrivilegesGuard],
  exports: [JwtStrategy, PassportModule, PrivilegesGuard],
})
export class AuthModule {}
