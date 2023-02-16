
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile-run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = activeEditor.document.fileName;
		if (file.substring(file.length - 4, file.length) != ".cpp") return;
		const file_address = file.substring(0, file.lastIndexOf('\\'));
		const file_name = file.substring(file.lastIndexOf('\\') + 1, file.length - 4);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('compile /f \"' + file_name + '.cpp\"');
		Terminal.sendText('.\\"' + file_name + '.exe\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = activeEditor.document.fileName;
		if (file.substring(file.length - 4, file.length) != ".cpp") return;
		const file_address = file.substring(0, file.lastIndexOf('\\'));
		const file_name = file.substring(file.lastIndexOf('\\') + 1, file.length - 4);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('compile /f \"' + file_name + '.cpp\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		const file = activeEditor.document.fileName;
		if (file.substring(file.length - 4, file.length) != ".cpp") return;
		const file_address = file.substring(0, file.lastIndexOf('\\'));
		const file_name = file.substring(file.lastIndexOf('\\') + 1, file.length - 4);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('.\\"' + file_name + '.exe\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.inst-run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = activeEditor.document.fileName;
		if (file.substring(file.length - 4, file.length) != ".cpp") return;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('run /f \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.inst-chdata-in', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = activeEditor.document.fileName;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('chdata /if \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.inst-chdata-out', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = activeEditor.document.fileName;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('chdata /of \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.enter-address', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		const file = activeEditor.document.fileName;
		const file_address = file.substring(0, file.lastIndexOf('\\'));
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
	}));

}

export function deactivate() { }
