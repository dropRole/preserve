import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffereesModule } from 'src/offerees/offerees.module';
import { OffereesRepository } from 'src/offerees/offerees.repository';
import { OffereesService } from 'src/offerees/offerees.service';
import { AccountsRepository } from './accounts.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'preserveapp',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    OffereesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OffereesService, OffereesRepository],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
