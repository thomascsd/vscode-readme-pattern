import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

export class ReadmeWriter {
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
    const readAsync = util.promisify(fs.readFile);
    const writeAsync = util.promisify(fs.writeFile);
    const tempPath = this.context.asAbsolutePath(path.join('templates', `${selectedItem}.md`));
    const buffer = await readAsync(tempPath);
    const edit = new vscode.WorkspaceEdit();
    const folders = vscode.workspace.workspaceFolders;

    console.log(`textEditor:${folders}`);

    if (folders) {
      const url = folders[0].uri;
      const filePath = `${url.fsPath}/README.md`;

      console.log(`url:${url.fsPath}`);

      /*edit.createFile(url, {
        overwrite: true
      });
      edit.set(url, [vscode.TextEdit.insert(new vscode.Position(0, 0), buffer.toString())]);

      await vscode.workspace.applyEdit(edit);*/
      await writeAsync(filePath, buffer.toString());
    }
  }
}
