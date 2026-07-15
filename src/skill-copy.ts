import { cpSync, mkdirSync, rmSync } from 'node:fs';

export function copySkillPackage(source: string, destination: string): void {
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true, force: true, errorOnExist: false });
}
