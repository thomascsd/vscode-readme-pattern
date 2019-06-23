import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';

export async function insertReadme() {
  const readAsync = util.promisify(fs.readFile);
  const writeAsync = util.promisify(fs.writeFile);
  const items: string[] = ['Bot', 'Hackathon', 'Minimal', 'Standard'];
  const selectedItem = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select readme pattern that you want'
  });

  if (selectedItem) {
  }
}
