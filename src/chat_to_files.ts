import { DB } from "./db";

export function parseChat(chat: string): [string, string][] {
    const regex = /```(.*?)```/gs;
    const matches = chat.matchAll(regex);
  
    const files: [string, string][] = [];
    for (const match of matches) {
      const path = match[1].split('\n')[0];
      const code = match[1].split('\n').slice(1).join('\n');
      files.push([path, code]);
    }
  
    return files;
  }
  
  export function toFiles(chat: string, workspace: DB): void {
    workspace.setItem('all_output.txt', chat);
  
    const files = parseChat(chat);
    for (const [fileName, fileContent] of files) {
      workspace.setItem(fileName, fileContent);
    }
  }