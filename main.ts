import * as fs from 'fs';
import * as path from 'path';
import AI from './ai';
import DB from './db';
import { STEPS } from './steps';
import { toFiles } from './chat_to_files';

import { program } from 'commander';

// instead of typer
program
  .version('1.0.0')
  .command('greet <name>')
  .description('Greet a person')

program.parse(process.argv);

type Opts = { projectPath?: string; runPrefix?: string; model?: string; temperature?: number }

const processChatPrompt = async () => {
    const options: Opts = program.parse(process.argv); 
    const dirName = window.location.pathname;
    const projectPath = options.projectPath ?? path.join(dirName, 'example');
    const runPrefix = options.runPrefix ?? '';
    const model = options.model ?? 'gpt-4';
    const temperature = options.temperature ?? 0.1;
  
    const inputPath = projectPath;
    const memoryPath = path.join(projectPath, runPrefix + 'memory');
    const workspacePath = path.join(projectPath, runPrefix + 'workspace');
  
    const ai = new AI({
      model,
      temperature,
    });
  
    const dbs = new DBs({
      memory: new DB(memoryPath),
      logs: new DB(path.join(memoryPath, 'logs')),
      input: new DB(inputPath),
      workspace: new DB(workspacePath),
      identity: new DB(path.join(__dirname, 'identity')),
    });
  
    for (const step of STEPS) {
      const messages = await step(ai, dbs);
      dbs.logs.setItem(step.name, JSON.stringify(messages));
    }
  }

program.action('chat', processChatPrompt);

program();
