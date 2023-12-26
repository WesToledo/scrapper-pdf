import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

import * as path from 'path';

import { Options, PythonShell } from 'python-shell';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class AppService {
  async uploadFile(file: Express.Multer.File) {
    
    const uploadedFilesKeyListTest = [
      '3001117181-10-2023.pdf',
      '3001165684-11-2023.pdf',
    ];

    function runPy() {
      return new Promise(async function (resolve, reject) {
        let options: Options = {
          mode: 'text',
          pythonOptions: ['-u'],
          scriptPath: path.resolve(__dirname, '../', 'src/scrapper'), //Path to your script
          args: [JSON.stringify({ name: ['xyz', 'abc'], age: ['28', '26'] })], //Approach to send JSON as when I tried 'json' in mode I was getting error.
        };

        await PythonShell.run('script.py', options).then((results) => {
          console.log('results: ');
          for (let i of results) {
            console.log(i, '---->', typeof i);
          }

          try {
            console.log(results[0]);
          } catch (err) {
            console.log('err = ', err);
          }
          resolve(results[0]);
        });
      });
    }

    function runMain() {
      return new Promise(async function (resolve, reject) {
        let r = await runPy();
        console.log(JSON.parse(JSON.stringify(r.toString())), 'Done...!@'); //Approach to parse string to JSON.
      });
    }

    runMain(); //run main function
  }
}
