import * as vscode from 'vscode';
import * as path from 'path';
import { existsSync } from 'fs';

export class JsonContentReader {
  async getProjectTitle() {
    let projectTitle = 'Project Title';
    let content = '';
    const names = ['package.json', 'composer.json'];

    for (let name of names) {
      content = await this.getPackageContent(name);

      if (content) {
        break;
      }
    }

    if (content) {
      const pkg = JSON.parse(content);
      projectTitle = pkg.name;
    }
    return projectTitle;
  }

  async getPackageContent(packageName: string) {
    const fs = vscode.workspace.fs;
    const folders = vscode.workspace.workspaceFolders;
    let content = '';

    if (folders) {
      const url = folders[0].uri;
      const pkgUrl = path.join(url.fsPath, packageName);
      const hasFile = existsSync(pkgUrl);

      if (hasFile) {
        const pkgUri = vscode.Uri.file(pkgUrl);
        const packageBuff = await fs.readFile(pkgUri);
        content = packageBuff.toString();
      }
    }

    return content;
  }

  async replaceContent(content: string) {
    const projectTitle = await this.getProjectTitle();

    content = content.replace(/@Project Title@/gi, projectTitle);

    return content;
  }
}
