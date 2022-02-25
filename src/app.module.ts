import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/requests.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferorsModule } from './offerors/offerors.module';
import { OffereesModule } from './offerees/offerees.module';
import { ProhibitionsModule } from './prohibitions/prohibitions.module';

@Module({
  imports: [
    AuthModule,
    RequestsModule,
    ReservationsModule,
    ComplaintsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'preserve',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OfferorsModule,
    OffereesModule,
    ProhibitionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
