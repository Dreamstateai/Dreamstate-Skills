import { cpSync, mkdirSync } from 'node:fs';

export function copySkillPackage(source: string, destination: string): void {
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true, force: true, errorOnExist: false });
}
