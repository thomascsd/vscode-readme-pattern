import * as vscode from 'vscode';
import * as path from 'path';

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
    const tempPath = this.context.asAbsolutePath(path.join('templates', `${selectedItem}.md`));
    const buffer = await this.fs.readFile(vscode.Uri.file(tempPath));
    const folders = vscode.workspace.workspaceFolders;
    let content = '';

    console.log(`folders:${JSON.stringify(folders)}`);
    console.log(`selectedItem:${selectedItem}`);

    if (folders) {
      const url = folders[0].uri;
      const filePath = path.join(url.fsPath, 'README.md');

      console.log(`url:${filePath}`);

      content = await this.replaceContent(buffer.toString());
      await this.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(content));
    }
  }

  async getProjectTitle() {
    const folders = vscode.workspace.workspaceFolders;
    let projectTitle = 'Project Title';

    if (folders) {
      const url = folders[0].uri;
      const pkgUrl = path.join(url.fsPath, 'package.json');
      const pkgUri = vscode.Uri.file(pkgUrl);
      const state = await this.fs.stat(pkgUri);

      if (state.size) {
        const packageBuff = await this.fs.readFile(pkgUri);
        const pkg = JSON.parse(packageBuff.toString());
        projectTitle = pkg.name;
      }
    }

    return projectTitle;
  }

  async replaceContent(content: string) {
    const projectTitle = await this.getProjectTitle();

    content = content.replace(/@Project Title@/gi, projectTitle);

    return content;
  }
}
