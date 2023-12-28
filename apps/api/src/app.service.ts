import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

import * as path from 'path';

import { Options, PythonShell } from 'python-shell';
import { StringDecoder } from 'string_decoder';

@Injectable()
export class AppService {}
