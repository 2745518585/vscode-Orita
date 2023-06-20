
import * as vscode from 'vscode';
import * as fs from 'fs';

const sys = require('os').platform();

const PS = (function (): string {
	if (sys == 'win32') return '\\';
	if (sys == 'linux') return '/';
	return '';
})();

const exe_suf = (function (): string {
	if (sys == 'win32') return '.exe';
	if (sys == 'linux') return '';
	return '';
})();

const appdata_path = (function (): string {
	if (sys == 'win32') if (process.env.APPDATA) return process.env.APPDATA + PS + 'Orita';
	if (sys == 'linux') if (process.env.HOME) return process.env.HOME + PS + '.Orita';
	return '';
})();

function check_filename(file: string | undefined): string | undefined {
	if (file == undefined) return undefined;
	let pos = file.indexOf('%');
	while (pos != -1) {
		file = file.substring(0, pos) + '%' + file.substring(pos, file.length);
		pos = file.indexOf('%', pos + 2);
	}
	return file;
}

function get_activefile(default_file: string | undefined = undefined): string | undefined {
	const activeEditor = vscode.window.activeTextEditor;
	return check_filename(activeEditor ? activeEditor.document.fileName : default_file);
}

function save_activefile(): void {
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) activeEditor.document.save();
}

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile-run', function () {
		const file = get_activefile(context.workspaceState.get('last_compile'));
		if (file == undefined || file.substring(file.length - 4, file.length) != '.cpp') return;
		save_activefile();
		context.workspaceState.update('last_compile', file);
		const file_address = file.substring(0, file.lastIndexOf(PS));
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('orita compile /r \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile', function () {
		const file = get_activefile(context.workspaceState.get('last_compile'));
		if (file == undefined || file.substring(file.length - 4, file.length) != '.cpp') return;
		save_activefile();
		context.workspaceState.update('last_compile', file);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.sendText('orita compile /f \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.run', function () {
		const file = get_activefile(context.workspaceState.get('last_compile'));
		if (file == undefined || file.substring(file.length - 4, file.length) != '.cpp') return;
		save_activefile();
		context.workspaceState.update('last_compile', file);
		const file_address = file.substring(0, file.lastIndexOf(PS));
		const file_name = file.substring(file.lastIndexOf(PS) + 1, file.length - 4);
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
		Terminal.sendText('orita compile /t \"' + file_address + PS + file_name + exe_suf + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file', function () {
		const file = get_activefile();
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		if (file == undefined) { Terminal.sendText('orita run'); return; }
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') {
			save_activefile();
			Terminal.sendText('orita run /f \"' + file + '\"');
		}
		else if (file.substring(file.length - 3, file.length) == '.in') Terminal.sendText('orita chdata /if \"' + file + '\"');
		else if (file.substring(file.length - 4, file.length) == '.out' || file.substring(file.length - 4, file.length) == '.ans') Terminal.sendText('orita chdata /of \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file1', function () {
		const file = get_activefile();
		if (file == undefined) return;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') Terminal.sendText('orita check /if \"' + file + '\"');
		else Terminal.sendText('orita chdata /if \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file2', function () {
		const file = get_activefile();
		if (file == undefined) return;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') Terminal.sendText('orita check /of \"' + file + '\"');
		else Terminal.sendText('orita chdata /of \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file3', function () {
		const file = get_activefile();
		if (file == undefined) return;
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.show();
		if (file.substring(file.length - 4, file.length) == '.cpp') Terminal.sendText('orita check /af \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.show-run-data', function () {
		if (!fs.existsSync(appdata_path + PS + 'data' + PS + 'data.in')) return;
		const data_in = vscode.Uri.file(appdata_path + PS + 'data' + PS + 'data.in');
		vscode.workspace.openTextDocument(data_in).then((document) => {
			vscode.window.showTextDocument(document, { preview: false });
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.compare-run-data', function () {
		if (!fs.existsSync(appdata_path + PS + 'data' + PS + 'data.out')) return;
		if (!fs.existsSync(appdata_path + PS + 'data' + PS + 'data.ans')) return;
		const data_out = vscode.Uri.file(appdata_path + PS + 'data' + PS + 'data.out');
		const data_ans = vscode.Uri.file(appdata_path + PS + 'data' + PS + 'data.ans');
		vscode.commands.executeCommand('vscode.diff', data_out, data_ans);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.enter-address', function () {
		const file = get_activefile();
		if (file == undefined) return;
		const file_address = file.substring(0, file.lastIndexOf(PS));
		let Terminal = vscode.window.activeTerminal;
		if (!Terminal) Terminal = vscode.window.createTerminal('powershell');
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
	}));

}

export function deactivate() { }
