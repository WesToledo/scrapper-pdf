import { Module } from '@nestjs/common';
import { FaturaService } from './fatura.service';
import { FaturaController } from './fatura.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [FaturaService],
  controllers: [FaturaController],
  imports: [PrismaModule],
})
export class FaturaModule {}
