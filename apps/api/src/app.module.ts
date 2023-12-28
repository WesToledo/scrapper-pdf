import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadModule } from './upload/upload.module';
import { PrismaService } from './database/prisma.service';
import { PrismaModule } from './database/prisma.module';
import { UploadService } from './upload/upload.service';
import { FaturaModule } from './fatura/fatura.module';
import { FaturaService } from './fatura/fatura.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
      exclude: ['api/*'],
    }),
    UploadModule,
    PrismaModule,
    FaturaModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadService, PrismaService, FaturaService],
})
export class AppModule {}
