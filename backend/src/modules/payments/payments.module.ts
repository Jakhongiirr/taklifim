import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftsModule } from '../gifts/gifts.module';
import { Taklif } from '../taklif/taklif.entity';
import { Order } from './order.entity';
import { PaymeTransaction } from './payme-transaction.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymeService } from './payme.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, PaymeTransaction, Taklif]),
    GiftsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymeService],
})
export class PaymentsModule {}
