import AI from './ai';
import { toFiles } from './chat_to_files';
import { DBs } from './db';
import * as fs from 'fs';

function setupSysPrompt(dbs: DBs): string {
  return dbs.identity['setup'] + '\nUseful to know:\n' + dbs.identity['philosophy'];
}

async function run(ai: AI, dbs: DBs) {
  const messages = ai.start(setupSysPrompt(dbs), dbs.input['main_prompt']);
  await toFiles(messages[messages.length - 1]['content'], dbs.workspace);
  return messages;
}

async function clarify(ai: AI, dbs: DBs) {
  const messages = [ai.fsystem(dbs.identity['qa'])];
  let user = dbs.input['main_prompt'];
  while (true) {
    const response = await ai.next(messages, user);
    const lastMessage = response[response.length - 1];
    const content = lastMessage['content'].trim().toLowerCase();
    if (content === 'no') {
      break;
    }
    console.log();
    user = prompt('(answer in text, or "q" to move on)\n');
    console.log();
    if (!user || user === 'q') {
      break;
    }
    user += '\n\n' + 'Is anything else unclear? If yes, only answer in the form:\n' + '{remaining unclear areas} remaining questions.\n' + '{Next question}\n' + 'If everything is sufficiently clear, only answer "no".';
    messages.push({ role: 'user', content: user });
  }
  console.log();
  return messages;
}

async function runClarified(ai: AI, dbs: DBs) {
  const messages = JSON.parse(dbs.logs[clarify.name]);
  messages[0] = ai.fsystem(setupSysPrompt(dbs));
  const response = await ai.next(messages, dbs.identity['use_qa']);
  await toFiles(response[response.length - 1]['content'], dbs.workspace);
  return response;
}

const STEPS = [clarify, runClarified];

// Future steps that can be added:
// improveFiles,
// addTests
// runTestsAndFixFiles,
// improveBasedOnInFileFeedbackComments