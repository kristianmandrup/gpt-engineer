import { AI}  from './ai';
import { toFiles } from './chat_to_files';
import { DBs } from './db';
import * as fs from 'fs';

function setupSysPrompt(dbs: DBs): string {
  return dbs.identity.getItem('setup') + '\nUseful to know:\n' + dbs.identity.getItem('philosophy');
}

async function run(ai: AI, dbs: DBs) {
  const messages = await ai.start(setupSysPrompt(dbs), dbs.input.getItem('main_prompt'));
  await toFiles(messages[messages.length - 1]['content'], dbs.workspace);
  return messages;
}

async function clarify(ai: AI, dbs: DBs) {
  const messages = [ai.fsystem(dbs.identity.getItem('qa'))];
  let user: any = dbs.input.getItem('main_prompt');
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
  const messages = JSON.parse(dbs.logs.getItem(clarify.name));
  messages[0] = ai.fsystem(setupSysPrompt(dbs));
  const response = await ai.next(messages, dbs.identity.getItem('use_qa'));
  await toFiles(response[response.length - 1]['content'], dbs.workspace);
  return response;
}

export const STEPS = [clarify, runClarified];

// Future steps that can be added:
// improveFiles,
// addTests
// runTestsAndFixFiles,
// improveBasedOnInFileFeedbackComments