import * as vscode from 'vscode';
import * as path from 'path';
import { JsonContentReader } from './JsonContentReader';

export class ReadmeWriter {
  fs = vscode.workspace.fs;
  constructor(private context: vscode.ExtensionContext) {}

  async insertReadme() {
    const selectedItem = await this.getQuickPickItem();

    if (selectedItem) {
      await this.createFile(selectedItem);
    }
  }

  async insertReadmeOnExplorer(url: string) {
    const selectedItem = await this.getQuickPickItem();

    if (selectedItem) {
      await this.createFile(selectedItem, url);
    }
  }

  private async createFile(selectedItem: string, url?: string) {
    const tempPath = this.context.asAbsolutePath(path.join('templates', `${selectedItem}.md`));
    const buffer = await this.fs.readFile(vscode.Uri.file(tempPath));
    const reader = new JsonContentReader();
    let content = '';
    const filePath = this.getFilePath(url);

    console.log(`selectedItem:${selectedItem}`);
    console.log(`url:${filePath}`);

    if (filePath) {
      content = await reader.replaceContent(buffer.toString());
      await this.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(content));
    }
  }

  private async getQuickPickItem() {
    const items: string[] = ['Bot', 'Hackathon', 'Minimal', 'Standard'];
    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select readme pattern that you want',
    });
    return selectedItem;
  }

  private getFilePath(url?: string) {
    const folders = vscode.workspace.workspaceFolders;
    const fileName = 'README.md';
    let filePath = '';

    if (url) {
      filePath = path.join(url, fileName);
    } else if (folders) {
      console.log(`folders:${JSON.stringify(folders)}`);

      const folderUrl = folders[0].uri;
      filePath = path.join(folderUrl.fsPath, fileName);
    }

    return filePath;
  }
}
