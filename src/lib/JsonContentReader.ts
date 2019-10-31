import * as vscode from 'vscode';
import * as path from 'path';
import { existsSync } from 'fs';

export class JsonContentReader {
  async getProjectTitle() {
    const fs = vscode.workspace.fs;
    const folders = vscode.workspace.workspaceFolders;
    let projectTitle = 'Project Title';

    if (folders) {
      const url = folders[0].uri;
      const pkgUrl = path.join(url.fsPath, 'package.json');
      const pkgUri = vscode.Uri.file(pkgUrl);
      const hasFile = existsSync(pkgUrl);

      if (hasFile) {
        const packageBuff = await fs.readFile(pkgUri);
        const pkg = JSON.parse(packageBuff.toString());
        projectTitle = pkg.name;
      }
    }

    return projectTitle;
  }

  getPackage(packageName: string) {}

  async replaceContent(content: string) {
    const projectTitle = await this.getProjectTitle();

    content = content.replace(/@Project Title@/gi, projectTitle);

    return content;
  }
}
