import * as fs from 'fs';
import * as path from 'path';
import { AI } from './ai';
import { DB } from './db';
import { STEPS } from './steps';

import { program } from 'commander';

// instead of typer
program
  .version('1.0.0')
  // .command('chat')
  .option('-p --projectPath <string>')
  .option('-r --runPrefix <string>')
  .option('-m --model <string>')
  .option('-t --temperature <number>')  
  .description('Chat to GPT-engineer and have him/her generate your application')

// program.parse(process.argv);

const run = async (options: Record<string, any>) => {
  const dirPath = options.projectPath || process.cwd();
  const projectPath = path.join(dirPath, 'example');
  const runPrefix = options.runPrefix ?? '';
  const model = options.model ?? 'gpt-3.5-turbo'; //  "gpt-3.5-turbo"; // 'gpt-4' does not work ;
  const temperature = options.temperature ?? 0.1;
  const inputPath = projectPath;
  const memoryPath = path.join(projectPath, runPrefix + 'memory');
  const workspacePath = path.join(projectPath, runPrefix + 'workspace');
  const identityPath = path.join(dirPath, 'identity');
  const logsPath =path.join(memoryPath, 'logs')

  console.log('paths', {
    options,
    dirPath,
    projectPath,
    inputPath,
    memoryPath,
    workspacePath,
    identityPath
  });

  const ai = new AI({
    model,
    temperature,
  });

  const dbs = {
    memory: new DB(memoryPath),
    logs: new DB(logsPath),
    input: new DB(inputPath),
    workspace: new DB(workspacePath),
    identity: new DB(identityPath),
  };

  console.log('processing steps')

  for (const step of STEPS) {
    const messages = await step(ai, dbs);
    dbs.logs.setItem(step.name, JSON.stringify(messages));
  }
}


async function main() {
  program
    // .command('run')
    .action(run);
  await program.parseAsync(process.argv);
}

(async () => {
  try {
      await main();
  } catch (e) {
      // Deal with the fact the chain failed
      console.error('main',e);
  }
  // `text` is not available here
})();
