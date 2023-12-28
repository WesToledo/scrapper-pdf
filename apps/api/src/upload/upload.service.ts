import {
  PutObjectAclCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';

import * as path from 'path';

import { Options, PythonShell } from 'python-shell';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

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
        let r = await runPy();
        const response = JSON.parse(JSON.stringify(r.toString()));
        // console.log(JSON.parse(JSON.stringify(r.toString())));
        resolve(response);
      });
    }

    return runMain();
  }

  async computeData() {}
}
