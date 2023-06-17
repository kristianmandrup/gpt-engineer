import fs from 'fs';
import path from 'path';

export class DB {
  private path: string;

  constructor(path: string) {
    this.path = path;
    console.log('mkdirsync', path);
    fs.mkdirSync(this.path, { recursive: true });
  }

  getItem(key: string): string {
    const filePath = path.join(this.path, key);
    return fs.readFileSync(filePath, 'utf8');
  }

  setItem(key: string, val: string): void {
    const filePath = path.join(this.path, key);
    fs.writeFileSync(filePath, val);
  }
}

export interface DBs {
  memory: DB;
  logs: DB;
  identity: DB;
  input: DB;
  workspace: DB;
}

export let dbs: DBs;

export const createDbs =(basePath: string = process.cwd()) => {
  dbs = {  
    memory: new DB(path.join(basePath, 'memory')),
    logs: new DB(path.join(basePath, 'logs')),
    identity: new DB(path.join(basePath, 'identity')),
    input: new DB(path.join(basePath, 'input')),
    workspace: new DB(path.join(basePath, 'workspace')),
  };
}

