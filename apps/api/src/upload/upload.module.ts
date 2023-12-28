import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';
import { FaturaService } from 'src/fatura/fatura.service';
import { FaturaModule } from 'src/fatura/fatura.module';

@Module({
  providers: [UploadService, FaturaService],
  controllers: [UploadController],
  imports: [PrismaModule],
})
export class UploadModule {}
