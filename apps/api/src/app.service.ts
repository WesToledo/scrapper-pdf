import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

import * as path from 'path';

import { Options, PythonShell } from 'python-shell';

@Injectable()
export class AppService {
  uploadFile(file: Express.Multer.File) {
    console.log(file);
    const options: Options = {
      mode: 'text',
      // pythonPath: 'path/to/python',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: path.resolve(__dirname, '../src'),
    };

    PythonShell.run('script.py', options).then((messages) => {
      // results is an array consisting of messages collected during execution
      console.log('results: %j', messages);
    });
  }
}
