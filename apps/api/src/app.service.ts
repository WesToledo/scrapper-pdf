import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

import * as path from 'path';

import { Options, PythonShell } from 'python-shell';

@Injectable()
export class AppService {
  async uploadFile(file: Express.Multer.File) {
    const py = spawn('python3', [
      path.resolve(__dirname, '../', 'src/scrapper/script.py'),
    ]);
    const uploadedFilesKeyList = [
      '3001117181-10-2023.pdf',
      '3001165684-11-2023.pdf',
    ];

    py.stdout.on('data', function (data) {
      console.log('data', data.toString());
    });

    py.stdout.on('end', function () {
      console.log('End =');
    });
    py.stdin.write(JSON.stringify(uploadedFilesKeyList));
    py.stdin.end();

    // let options: Options = {
    //   mode: 'text',
    //   pythonOptions: ['-u'], // get print results in real-time
    //   args: ['value1', 'value2', 'value3'],
    // };

    // const pyshell = new PythonShell(
    //   path.resolve(__dirname, '../', 'src/scrapper/script.py'),
    //   options,
    // );

    // pyshell.on('message', function (message) {
    //   // received a message sent from the Python script (a simple "print" statement)
    //   console.log(message);
    // });

    // pyshell.end(function (err, code, signal) {
    //   if (err) throw err;
    //   console.log('The exit code was: ' + code);
    //   console.log('The exit signal was: ' + signal);
    //   console.log('finished');
    // });

    // console.log('pyshell');
  }
}
