import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import * as path from 'path';

import * as fs from 'fs';
import { Options, PythonShell } from 'python-shell';
import { CreateFaturaDTO } from 'src/fatura/dto/fatura.dto';
import { FaturaService } from 'src/fatura/fatura.service';
import { ResponseOCR } from './upload.controller';

@Injectable()
export class UploadService {
  constructor(private faturaService: FaturaService) {}

  async runOCRScript(filesNames: string[]) {
    function runPy() {
      return new Promise(async function (resolve, reject) {
        const options: Options = {
          mode: 'text',
          pythonOptions: ['-u'],
          scriptPath: path.resolve(__dirname, '../../', 'src/scrapper'), //Path to your script
          args: [JSON.stringify(filesNames)], //Approach to send JSON as when I tried 'json' in mode I was getting error.
        };

        await PythonShell.run('script.py', options).then((results) => {
          // DEBUG
          // for (let i of results) {
          //   console.log(i, '---->', typeof i);
          // }

          // try {
          //   console.log(results[0]);
          // } catch (err) {
          //   console.log('err = ', err);
          // }
          resolve(results[0]);
        });
      });
    }

    function runMain() {
      return new Promise(async function (resolve, reject) {
        const r = await runPy();
        const response = JSON.parse(JSON.stringify(r.toString()));
        // console.log(JSON.parse(JSON.stringify(r.toString())));
        resolve(response);
      });
    }

    return runMain();
  }

  async computeData(response: ResponseOCR[]) {
    const s3 = new S3();

    const service = this.faturaService;

    await Promise.all(
      response.map(({ pdf_name, result }) => {
        return new Promise(async function (resolve, reject) {
          try {
            const buffer = await fs.readFileSync(
              path.resolve(__dirname, '../../', 'src/arquives', pdf_name),
            );

            const uploadResult = await s3
              .upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: buffer,
                Key: `${pdf_name}`,
              })
              .promise();

            const {
              energia_SCEE,
              energia_compensada,
              energia_eletrica,
              iluminacao_publica,
              numero_cliente,
              numero_instalacao,
              referente,
            } = result;

            const referenceMonth =
              referente.indexOf('I') !== -1
                ? referente.substring(0, referente.indexOf('I'))
                : referente.substring(0, referente.indexOf('/'));

            const referenceYear =
              referente.indexOf('I') !== -1
                ? referente.substring(
                    referente.indexOf('I') + 1,
                    referente.length,
                  )
                : referente.substring(
                    referente.indexOf('/') + 1,
                    referente.length,
                  );

            const fatura = {
              fileName: pdf_name,
              fileUrl: uploadResult.Location,
              key: uploadResult.Key,
              clientNumber: numero_cliente,
              instalationNumber: numero_instalacao,
              referenceMonth,
              referenceYear,
              eletric_energy_amount: parseFloat(energia_eletrica.quantidade),
              eletric_energy_value: parseFloat(energia_eletrica.valor),
              sceee_energy_amount: parseFloat(energia_SCEE.quantidade),
              sceee_energy_value: parseFloat(energia_SCEE.valor),
              compensated_energy_amount: parseFloat(
                energia_compensada.quantidade,
              ),
              compensated_energy_value: parseFloat(energia_compensada.valor),
              public_ilumination_contrib: parseFloat(iluminacao_publica.valor),
            } as CreateFaturaDTO;

            const storage = await service.create(fatura);

            await fs.unlinkSync(
              path.resolve(__dirname, '../../', 'src/arquives', pdf_name),
            );

            console.log('storage', storage);
          } catch (err) {
            console.log(err);
          }

          resolve(1);
        });
      }),
    );
  }
}
