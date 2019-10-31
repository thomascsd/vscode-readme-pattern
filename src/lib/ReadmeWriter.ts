import * as vscode from 'vscode';
import * as path from 'path';
import { JsonContentReader } from './JsonContentReader';

export class ReadmeWriter {
  fs = vscode.workspace.fs;
  constructor(private context: vscode.ExtensionContext) {}

  async insertReadme() {
    const items: string[] = ['Bot', 'Hackathon', 'Minimal', 'Standard'];
    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select readme pattern that you want'
    });

    if (selectedItem) {
      await this.createFile(selectedItem);
    }
  }

  private async createFile(selectedItem: string) {
    const tempPath = this.context.asAbsolutePath(
      path.join('templates', `${selectedItem}.md`)
    );
    const buffer = await this.fs.readFile(vscode.Uri.file(tempPath));
    const folders = vscode.workspace.workspaceFolders;
    const reader = new JsonContentReader();
    let content = '';

    console.log(`folders:${JSON.stringify(folders)}`);
    console.log(`selectedItem:${selectedItem}`);

    if (folders) {
      const url = folders[0].uri;
      const filePath = path.join(url.fsPath, 'README.md');

      console.log(`url:${filePath}`);

      content = await reader.replaceContent(buffer.toString());
      await this.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(content));
    }
  }
}
