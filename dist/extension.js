(()=>{"use strict";var e={496:e=>{e.exports=require("vscode")}},t={};function n(i){var s=t[i];if(void 0!==s)return s.exports;var o=t[i]={exports:{}};return e[i](o,o.exports,n),o.exports}var i={};(()=>{var e=i;Object.defineProperty(e,"__esModule",{value:!0}),e.deactivate=e.activate=void 0;const t=n(496);e.activate=function(e){e.subscriptions.push(t.commands.registerCommand("orita.compile-run",(function(){const e=t.window.activeTextEditor;if(!e)return;e.document.save();const n=e.document.fileName;if(".cpp"!=n.substring(n.length-4,n.length))return;const i=n.substring(0,n.lastIndexOf("\\")),s=n.substring(n.lastIndexOf("\\")+1,n.length-4);let o=t.window.activeTerminal;o||(o=t.window.createTerminal("powershell")),o.show(),o.sendText('cd "'+i+'"'),o.sendText('compile /f "'+s+'.cpp"'),o.sendText('.\\"'+s+'.exe"')}))),e.subscriptions.push(t.commands.registerCommand("orita.compile",(function(){const e=t.window.activeTextEditor;if(!e)return;e.document.save();const n=e.document.fileName;if(".cpp"!=n.substring(n.length-4,n.length))return;const i=n.substring(0,n.lastIndexOf("\\")),s=n.substring(n.lastIndexOf("\\")+1,n.length-4);let o=t.window.activeTerminal;o||(o=t.window.createTerminal("powershell")),o.sendText('cd "'+i+'"'),o.sendText('compile /f "'+s+'.cpp"')}))),e.subscriptions.push(t.commands.registerCommand("orita.run",(function(){const e=t.window.activeTextEditor;if(!e)return;const n=e.document.fileName;if(".cpp"!=n.substring(n.length-4,n.length))return;const i=n.substring(0,n.lastIndexOf("\\")),s=n.substring(n.lastIndexOf("\\")+1,n.length-4);let o=t.window.activeTerminal;o||(o=t.window.createTerminal("powershell")),o.show(),o.sendText('cd "'+i+'"'),o.sendText('.\\"'+s+'.exe"')}))),e.subscriptions.push(t.commands.registerCommand("orita.inst-run",(function(){const e=t.window.activeTextEditor;if(!e)return;e.document.save();const n=e.document.fileName;if(".cpp"!=n.substring(n.length-4,n.length))return;let i=t.window.activeTerminal;i||(i=t.window.createTerminal("powershell")),i.show(),i.sendText('run /f "'+n+'"')}))),e.subscriptions.push(t.commands.registerCommand("orita.inst-chdata-in",(function(){const e=t.window.activeTextEditor;if(!e)return;e.document.save();const n=e.document.fileName;let i=t.window.activeTerminal;i||(i=t.window.createTerminal("powershell")),i.show(),i.sendText('chdata /if "'+n+'"')}))),e.subscriptions.push(t.commands.registerCommand("orita.inst-chdata-out",(function(){const e=t.window.activeTextEditor;if(!e)return;e.document.save();const n=e.document.fileName;let i=t.window.activeTerminal;i||(i=t.window.createTerminal("powershell")),i.show(),i.sendText('chdata /of "'+n+'"')}))),e.subscriptions.push(t.commands.registerCommand("orita.enter-address",(function(){const e=t.window.activeTextEditor;if(!e)return;const n=e.document.fileName,i=n.substring(0,n.lastIndexOf("\\"));let s=t.window.activeTerminal;s||(s=t.window.createTerminal("powershell")),s.show(),s.sendText('cd "'+i+'"')})))},e.deactivate=function(){}})(),module.exports=i})();