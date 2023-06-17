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
  .option('-p --projectPath')
  .option('-r --runPrefix')
  .option('-m --model')
  .option('-t --temperature <number>')  
  .description('Chat to GPT-engineer and have him/her generate your application')

// program.parse(process.argv);

const run = async (options: Record<string, any>) => {
  console.log('running...', options);

  const dirName = process.cwd();
  options.projectPath = options.projectPath || './'
  const projectPath = options.projectPath ?? path.join(dirName, 'example');
  const runPrefix = options.runPrefix ?? '';
  const model = options.model ?? 'gpt-4';
  const temperature = options.temperature ?? 0.1;

  const inputPath = projectPath;
  const memoryPath = path.join(projectPath, runPrefix + 'memory');
  const workspacePath = path.join(projectPath, runPrefix + 'workspace');

  console.log('paths', {
    options,
    dirName,
    projectPath,
    inputPath,
    memoryPath,
    workspacePath
  });

  const ai = new AI({
    model,
    temperature,
  });

  const dbs = {
    memory: new DB(memoryPath),
    logs: new DB(path.join(memoryPath, 'logs')),
    input: new DB(inputPath),
    workspace: new DB(workspacePath),
    identity: new DB(path.join(dirName, 'identity')),
  };

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
  }
  // `text` is not available here
})();
