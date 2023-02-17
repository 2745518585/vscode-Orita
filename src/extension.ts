
import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile-runs', function () {
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

	context.subscriptions.push(vscode.commands.registerCommand('orita.runs', function () {
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

	context.subscriptions.push(vscode.commands.registerCommand('orita.run', function () {
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

	context.subscriptions.push(vscode.commands.registerCommand('orita.chdata-in', function () {
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

	context.subscriptions.push(vscode.commands.registerCommand('orita.chdata-out', function () {
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
	context.subscriptions.push(vscode.commands.registerCommand('orita.compare-run-data', function () {
		if (!fs.existsSync(process.env.APPDATA + '\\Orita\\data\\data.in')) return;
		if (!fs.existsSync(process.env.APPDATA + '\\Orita\\data\\data.out')) return;
		if (!fs.existsSync(process.env.APPDATA + '\\Orita\\data\\data.ans')) return;
		const data_in = vscode.Uri.file(process.env.APPDATA + '\\Orita\\data\\data.in');
		const data_out = vscode.Uri.file(process.env.APPDATA + '\\Orita\\data\\data.out');
		const data_ans = vscode.Uri.file(process.env.APPDATA + '\\Orita\\data\\data.ans');
		vscode.workspace.openTextDocument(data_in).then((document) => {
			vscode.window.showTextDocument(document, { preview: false });
		});
		vscode.commands.executeCommand('vscode.diff', data_out, data_ans);
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
