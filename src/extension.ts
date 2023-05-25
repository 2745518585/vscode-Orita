
import * as vscode from 'vscode';
import * as fs from 'fs';

let sys = require('os').platform();

let PATH_SE = "";
if (sys == 'win32') PATH_SE = '\\';
if (sys == 'linux') PATH_SE = '/';

let appdata_path = "";
if (sys == 'win32') if (process.env.APPDATA) appdata_path = process.env.APPDATA + PATH_SE + "Orita";
if (sys == 'linux') if (process.env.HOME) appdata_path = process.env.HOME + PATH_SE + ".Orita";

function check_filename(file: string): string {
	let pos = file.indexOf('%');
	while (pos != -1) {
		file = file.substring(0, pos) + '%' + file.substring(pos, file.length);
		pos = file.indexOf('%', pos + 2);
	}
	return file;
}

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile-run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = check_filename(activeEditor.document.fileName);
		if (file.substring(file.length - 4, file.length) != '.cpp') return;
		const file_address = file.substring(0, file.lastIndexOf(PATH_SE));
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('orita compile /r \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = check_filename(activeEditor.document.fileName);
		if (file.substring(file.length - 4, file.length) != '.cpp') return;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.sendText('orita compile /f \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		const file = check_filename(activeEditor.document.fileName);
		if (file.substring(file.length - 4, file.length) != '.cpp') return;
		const file_address = file.substring(0, file.lastIndexOf(PATH_SE));
		const file_name = file.substring(file.lastIndexOf(PATH_SE) + 1, file.length - 4);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('orita compile /t \"' + file_address + PATH_SE + file_name + '.exe\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file', function () {
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			Terminal.sendText('orita run');
			return;
		}
		activeEditor.document.save();
		const file = check_filename(activeEditor.document.fileName);
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') {
			Terminal.sendText('orita run /f \"' + file + '\"');
		}
		else if (file.substring(file.length - 3, file.length) == '.in') {
			Terminal.sendText('orita chdata /if \"' + file + '\"');
		}
		else if (file.substring(file.length - 4, file.length) == '.out' || file.substring(file.length - 4, file.length) == '.ans') {
			Terminal.sendText('orita chdata /of \"' + file + '\"');
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file1', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = check_filename(activeEditor.document.fileName);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') {
			Terminal.sendText('orita check /if \"' + file + '\"');
		}
		else {
			Terminal.sendText('orita chdata /if \"' + file + '\"');
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file2', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = check_filename(activeEditor.document.fileName);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') {
			Terminal.sendText('orita check /of \"' + file + '\"');
		}
		else {
			Terminal.sendText('orita chdata /of \"' + file + '\"');
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file3', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		activeEditor.document.save();
		const file = check_filename(activeEditor.document.fileName);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') {
			Terminal.sendText('orita check /af \"' + file + '\"');
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.show-run-data', function () {
		if (!fs.existsSync(appdata_path + PATH_SE + 'data' + PATH_SE + 'data.in')) return;
		const data_in = vscode.Uri.file(appdata_path + PATH_SE + 'data' + PATH_SE + 'data.in');
		vscode.workspace.openTextDocument(data_in).then((document) => {
			vscode.window.showTextDocument(document, { preview: false });
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.compare-run-data', function () {
		if (!fs.existsSync(appdata_path + PATH_SE + 'data' + PATH_SE + 'data.out')) return;
		if (!fs.existsSync(appdata_path + PATH_SE + 'data' + PATH_SE + 'data.ans')) return;
		const data_out = vscode.Uri.file(appdata_path + PATH_SE + 'data' + PATH_SE + 'data.out');
		const data_ans = vscode.Uri.file(appdata_path + PATH_SE + 'data' + PATH_SE + 'data.ans');
		vscode.commands.executeCommand('vscode.diff', data_out, data_ans);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.enter-address', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) return;
		const file = check_filename(activeEditor.document.fileName);
		const file_address = file.substring(0, file.lastIndexOf(PATH_SE));
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) {
			Terminal = vscode.window.createTerminal('powershell');
		}
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
	}));

}

export function deactivate() { }
