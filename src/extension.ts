// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ReadmeWriter } from './lib/ReadmeWriter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "readme-pattern" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.readme', () => insertReadMe(context))
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.readmeOnExplorer', (e) =>
      insertReadmeOnExplorer(context, e.path)
    )
  );

  function insertReadMe(context: vscode.ExtensionContext) {
    const writer = new ReadmeWriter(context);
    writer.insertReadme();
  }

  function insertReadmeOnExplorer(context: vscode.ExtensionContext, url: string) {
    const writer = new ReadmeWriter(context);
    writer.insertReadmeOnExplorer(url);
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
