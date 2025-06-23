
import * as vscode from 'vscode';
import * as fs from 'fs';
import { execSync } from 'child_process';

const sys = require('os').platform();

const PS = (function (): string {
	if (sys == 'win32') return '\\';
	if (sys == 'linux') return '/';
	return '';
})();

const OP = (function (str: string): string {
	if (sys == 'win32') return '/' + str;
	if (sys == 'linux') return '-' + str;
	return '';
});

const appdata_path = (function (): string {
	if (sys == 'win32') if (process.env.APPDATA) return process.env.APPDATA + PS + 'Orita';
	if (sys == 'linux') if (process.env.HOME) return process.env.HOME + PS + '.Orita';
	return '';
})();

const file_path = function () {
	try {
		execSync('orita ' + OP('path') + ' 2> ' + (sys == 'win32' ? process.env.TEMP + '/path.txt' : '/tmp/path.txt'));
		const path = fs.readFileSync(sys == 'win32' ? process.env.TEMP + '/path.txt' : '/tmp/path.txt').toString();
		return path;
	}
	catch (error) {
		throw error;
	}
}();

const source_file_suf = vscode.workspace.getConfiguration('orita').get<string[]>('source_file_suf') || [];

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

function get_terminal(): vscode.Terminal {
	return vscode.window.activeTerminal ? vscode.window.activeTerminal : vscode.window.createTerminal();
}

function get_fileaddress(file: string): string {
	return file.substring(0, file.lastIndexOf(PS));
}

function get_filename(file: string): string {
	return file.substring(file.lastIndexOf(PS) + 1, file.length);
}

function get_filenamepre(file: string): string {
	const filename = get_filename(file);
	return filename.substring(0, filename.lastIndexOf('.'));
}

function get_filenamesuf(file: string): string {
	const filename = get_filename(file);
	return filename.substring(filename.lastIndexOf('.'), filename.length);
}

function add_include_path(context: vscode.ExtensionContext) {
	if (vscode.workspace.workspaceFolders) {
		for (let i = 0; i < vscode.workspace.workspaceFolders.length; ++i) {
			const path = vscode.workspace.workspaceFolders[i].uri.fsPath;
			try {
				let config = JSON.parse(fs.readFileSync(path + '/.vscode/c_cpp_properties.json').toString());
				let if_change = false;
				for (let j = 0; j < config["configurations"].length; ++j) {
					try {
						if (!config["configurations"][j]["includePath"].includes(file_path)) {
							config["configurations"][j]["includePath"].push(file_path);
							if_change = true;
						}
					}
					catch (error) { }
				}
				if (if_change) {
					let ask_include_path = async function () {
						const settings = vscode.workspace.getConfiguration('orita');
						if (settings.get<boolean>('enable_add_include_path') != true && context.globalState.get('ask_enable_add_include_path') != true) {
							await context.globalState.update('ask_enable_add_include_path', true);
							const result = await vscode.window.showInformationMessage('Enable to add the orita path to the include path', 'Yes', 'No');
							if (result === 'Yes') {
								await settings.update('enable_add_include_path', true, vscode.ConfigurationTarget.Global);
							}
							else if (result === 'No') {
								await settings.update('enable_add_include_path', false, vscode.ConfigurationTarget.Global);
							}
							else await context.globalState.update('ask_enable_add_include_path', false);
						}
						if (settings.get<boolean>('enable_add_include_path') == true) {
							fs.writeFileSync(path + '/.vscode/c_cpp_properties.json', JSON.stringify(config, null, 4));
						}
					};
					ask_include_path();
				}
			}
			catch (error) { }
		}
	}
}

export function activate(context: vscode.ExtensionContext) {

	add_include_path(context);

	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('orita.enable_add_include_path')) {
			add_include_path(context);
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile-run', function () {
		const file = get_activefile(context.workspaceState.get('last_compile'));
		if (file == undefined || !source_file_suf.includes(get_filenamesuf(file))) return;
		context.workspaceState.update('last_compile', file);
		save_activefile();
		const Terminal = get_terminal();
		Terminal.show();
		Terminal.sendText('cd \"' + get_fileaddress(file) + '\"');
		Terminal.sendText('orita compile ' + OP('r') + ' \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.compile', function () {
		const file = get_activefile(context.workspaceState.get('last_compile'));
		if (file == undefined || !source_file_suf.includes(get_filenamesuf(file))) return;
		context.workspaceState.update('last_compile', file);
		save_activefile();
		const Terminal = get_terminal();
		Terminal.sendText('orita compile \"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file', function () {
		const file = get_activefile();
		const Terminal = get_terminal();
		Terminal.show();
		if (file == undefined) Terminal.sendText('orita run');
		else if (source_file_suf.includes(get_filenamesuf(file))) {
			save_activefile();
			Terminal.sendText('orita run ' + OP('f') + ' \"' + file + '\"');
		}
		else if (get_filenamesuf(file) == '.in') Terminal.sendText('orita chdata ' + OP('if') + '=\"' + file + '\"');
		else if (get_filenamesuf(file) == '.out' || get_filenamesuf(file) == '.ans') Terminal.sendText('orita chdata ' + OP('of') + '=\"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file1', function () {
		const file = get_activefile();
		if (file == undefined) return;
		const Terminal = get_terminal();
		Terminal.show();
		if (source_file_suf.includes(get_filenamesuf(file))) Terminal.sendText('orita check ' + OP('if') + ' \"' + file + '\"');
		else Terminal.sendText('orita chdata ' + OP('if') + '=\"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file2', function () {
		const file = get_activefile();
		if (file == undefined) return;
		const Terminal = get_terminal();
		Terminal.show();
		if (source_file_suf.includes(get_filenamesuf(file))) Terminal.sendText('orita check ' + OP('of') + ' \"' + file + '\"');
		else Terminal.sendText('orita chdata ' + OP('of') + '=\"' + file + '\"');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('orita.add-file3', function () {
		const file = get_activefile();
		if (file == undefined) return;
		const Terminal = get_terminal();
		Terminal.show();
		if (source_file_suf.includes(get_filenamesuf(file))) Terminal.sendText('orita check ' + OP('af') + ' \"' + file + '\"');
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
		vscode.env.clipboard.writeText('\"' + file + '\"');
		const file_address = file.substring(0, file.lastIndexOf(PS));
		const Terminal = get_terminal();
		Terminal.show();
		Terminal.sendText('cd \"' + file_address + '\"');
	}));

}

export function deactivate() { }
