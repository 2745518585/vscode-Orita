# vscode-Orita

[Orita](https://github.com/2745518585/Orita)

由 [赵悦岑](https://github.com/2745518585/) 开发的一款 OI 工具，包括评测、对拍、数据生成等，主要由 C++ 语言编写。

[vscode-Orita](https://github.com/2745518585/vscode-Orita)

Orita 的配套 vscode 拓展。

## 行为

如果设置 `orita.enable_add_include_path` 为真，会在扩展激活时（即打开任一 `cpp` 文件或运行任一命令时）或修改设置时检查 `.vscode/c_cpp_properties.json` 中的 `include path` 是否包含 orita file path，如没有则将其加入 `include path`。如果 `orita.enable_add_include_path` 为假，则尝试询问，此询问仅会进行一次。

## 命令

### Compile run

ID: `orita.compile-run`

快捷键: F6

编译并运行 `.cpp` 源文件。

### Compile

ID: `orita.compile`

快捷键: Ctrl + F6

编译 `.cpp` 源文件。

### Run

ID: `orita.run`

快捷键: Alt + F6

运行 `.cpp` 文件编译得到的 `.exe` 文件。

### add file

ID: `orita.add-file`

快捷键: F7

当前文件为 `.cpp` 后缀时，执行 `run /f file`。

当前文件为 `.in` 后缀时，执行 `chdata /if file`。

当前文件为 `.out/.ans` 后缀时，执行 `chdata /of file`。

### add file1

ID: `orita.add-file1`

快捷键: Ctrl + F7

当前文件为 `.cpp` 后缀时，执行 `check /if file`。

否则，执行 `chdata /if file`。

### add file2

ID: `orita.add-file2`

快捷键: Alt + F7

当前文件为 `.cpp` 后缀时，执行 `check /of file`。

否则，执行 `chdata /of file`。

### add file3

ID: `orita.add-file3`

快捷键: Shift + F7

当前文件为 `.cpp` 后缀时，执行 `check /af file`。

### use checker

ID: `orita.use-checker`

快捷键: Alt + Shift + F7

切换 `run` 是否添加 `/c`。

### Show run data

ID: `orita.show-run-data`

快捷键: Ctrl + Shift + F7

打开 `data.in` 文件。

### Enter address

ID: `orita.enter-address`

快捷键: F8

将终端设置到当前文件所在目录。
