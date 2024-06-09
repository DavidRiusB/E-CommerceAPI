import * as fs from 'fs';
import * as path from 'path';

export function loadData<T>(filePath: string): T {
  const fullPath = path.join(__dirname, filePath);
  console.log('fullpath', fullPath);
  const rawData = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(rawData);
}
