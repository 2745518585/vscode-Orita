/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('orita.compile-run', function () {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
        activeEditor.document.save();
        const file = activeEditor.document.fileName;
        if (file.substring(file.length - 4, file.length) != ".cpp") {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
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
        if (!activeEditor) {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
        activeEditor.document.save();
        const file = activeEditor.document.fileName;
        if (file.substring(file.length - 4, file.length) != ".cpp") {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
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
        if (!activeEditor) {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
        activeEditor.document.save();
        const file = activeEditor.document.fileName;
        if (file.substring(file.length - 4, file.length) != ".cpp") {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
        const file_address = file.substring(0, file.lastIndexOf('\\'));
        const file_name = file.substring(file.lastIndexOf('\\') + 1, file.length - 4);
        let Terminal = vscode.window.activeTerminal;
        if (!Terminal) {
            Terminal = vscode.window.createTerminal('powershell');
        }
        Terminal.show();
        Terminal.sendText('cd \"' + file_address + '\"');
        Terminal.sendText('run /f \"' + file_name + '.cpp\"');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('orita.enter-address', function () {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('Invalid File');
            return;
        }
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
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map