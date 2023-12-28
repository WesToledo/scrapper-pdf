import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UploadService } from './upload.service';

interface ResponseOCR {
  pdf_path: string;
  img_path: string;
  result: {
    numero_cliente: string;
    numero_instalacao: string;
    referente: string;
    energia_eletrica: {
      quantidade: string;
      valor: string;
    };
    energia_SCEE: {
      quantidade: string;
      valor: string;
    };
    energia_compensada: {
      quantidade: string;
      valor: string;
    };
    iluminacao_publica: {
      valor: string;
    };
  };
}

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/')
  @UseInterceptors(
    FilesInterceptor('files[]', 30, {
      storage: diskStorage({
        destination: path.resolve(__dirname, '../../', 'src/scrapper/uploads'),
        filename: (req, file, callback) => {
          callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadLocalFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    )
    files,
  ) {
    const filesNames = [];

    files.forEach((file) => {
      filesNames.push(file.filename);
    });

    const response = (await this.uploadService.runOCRScript(
      filesNames,
    )) as ResponseOCR[];

    console.log('response', response);
  }
}
