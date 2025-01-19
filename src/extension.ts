import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Cursor Prompt extension is now active!');

    let disposable = vscode.commands.registerCommand('cursor-prompt.showPrompts', () => {
        vscode.window.showInformationMessage('Hello from Cursor Prompt!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {} 