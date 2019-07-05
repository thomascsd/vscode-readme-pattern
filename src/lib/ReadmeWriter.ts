import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ReadmeWriter {
  constructor(private context: vscode.ExtensionContext) {}

  async insertReadme() {
    const items: string[] = ['Bot', 'Hackathon', 'Minimal', 'Standard'];
    const selectedItem = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select readme pattern that you want'
    });

    if (selectedItem) {
      this.createFile(selectedItem);
    }
  }

  private createFile(selectedItem: string) {
    const tempPath = this.context.asAbsolutePath(path.join('templates', `${selectedItem}.md`));
    const buffer = fs.readFileSync(tempPath);
    const folders = vscode.workspace.workspaceFolders;
    let content = '';

    console.log(`folders:${JSON.stringify(folders)}`);
    console.log(`selectedItem:${selectedItem}`);

    if (folders) {
      const url = folders[0].uri;
      const filePath = `${url.fsPath}\\README.md`;

      console.log(`url:${filePath}`);

      content = this.replaceContent(buffer.toString());
      fs.writeFileSync(filePath, content);
    }
  }

  getProjectTitle() {
    const folders = vscode.workspace.workspaceFolders;
    let projectTitle = 'Project Title';

    if (folders) {
      const url = folders[0].uri;
      const pkgUrl = `${url.fsPath}\\package.json`;

      if (fs.existsSync(pkgUrl)) {
        const packageBuff = fs.readFileSync(pkgUrl);
        const pkg = JSON.parse(packageBuff.toString());
        projectTitle = pkg.name;
      }
    }

    return projectTitle;
  }

  replaceContent(content: string) {
    const projectTitle = this.getProjectTitle();

    content = content.replace(/@Project Title@/gi, projectTitle);

    return content;
  }
}
