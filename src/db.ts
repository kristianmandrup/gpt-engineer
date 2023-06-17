import fs from 'fs';
import path from 'path';

export class DB {
  private path: string;

  constructor(path: string) {
    this.path = path;
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

export const dbs: DBs = {
  memory: new DB('/path/to/memory'),
  logs: new DB('/path/to/logs'),
  identity: new DB('/path/to/identity'),
  input: new DB('/path/to/input'),
  workspace: new DB('/path/to/workspace'),
};

export default dbs;
