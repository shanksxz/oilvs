import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { BufferManager } from "../services/buffer-manager";
import { PathResolver } from "../services/path-resolver";
import { IconUtils } from "../services/icon-utils";
import { ErrorHandler } from "../utils/error-handler";
import { COMMANDS, URI_SCHEME } from "../constants";

export class OilCommands {
    constructor(
        private bufferManager: BufferManager,
        private pathResolver: PathResolver
    ) {}

    /**
     * Register all oil commands
     */
    registerCommands(context: vscode.ExtensionContext): void {
        const openDirectoryCommand = vscode.commands.registerCommand(
            COMMANDS.OPEN_DIRECTORY,
            this.handleOpenDirectory.bind(this)
        );

        const openItemCommand = vscode.commands.registerCommand(
            "oilvs.openItem",
            this.handleOpenItem.bind(this)
        );

        const toggleIconCommand = vscode.commands.registerCommand(
            "oilvs.toggleIconType",
            this.handleToggleIconType.bind(this)
        );

        const goUpLevelCommand = vscode.commands.registerCommand(
            COMMANDS.GO_UP_LEVEL,
            this.handleGoUpLevel.bind(this)
        );

        context.subscriptions.push(
            openDirectoryCommand, 
            openItemCommand, 
            toggleIconCommand,
            goUpLevelCommand
        );
    }

    /**
     * Handle opening directory in oil view
     */
    private async handleOpenDirectory(uri?: vscode.Uri): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor && activeEditor.document.uri.scheme === URI_SCHEME) {
            await this.handleParentNavigation(activeEditor);
        } else {
            await this.handleInitialOpen(uri, activeEditor);
        }
    }

    /**
     * Handle navigation to parent directory from oil view
     */
    private async handleParentNavigation(
        activeEditor: vscode.TextEditor
    ): Promise<void> {
        const content = activeEditor.document.getText();
        const currentPath =
            this.pathResolver.getCurrentDirectoryFromBuffer(content);

        if (!currentPath) {
            ErrorHandler.showOilError("Cannot determine directory path from oil document");
            return;
        }

        const parentPath = path.dirname(currentPath);

        if (parentPath !== currentPath) {
            //? when going up, position cursor at top instead of focusing on current dir
            await this.bufferManager.openBuffer(parentPath);
        }
    }

    /**
     * Handle initial opening of oil view from regular file
     */
    private async handleInitialOpen(
        uri: vscode.Uri | undefined,
        activeEditor: vscode.TextEditor | undefined
    ): Promise<void> {
        const targetPath = await this.pathResolver.resolveTargetPath(uri);
        if (!targetPath) {
            return;
        }

        let focusFileName: string | undefined;
        if (activeEditor && activeEditor.document.uri.scheme === "file") {
            focusFileName = path.basename(activeEditor.document.uri.fsPath);
        }

        await this.bufferManager.openBuffer(targetPath, focusFileName);
    }

    /**
     * Handle going up one level (dedicated command for Oil view)
     */
    private async handleGoUpLevel(): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        
        if (!activeEditor || activeEditor.document.uri.scheme !== URI_SCHEME) {
            ErrorHandler.showContextError("This command", "in Oil view");
            return;
        }

        await this.handleParentNavigation(activeEditor);
    }

    /**
     * Handle opening file/directory from oil view
     */
    private async handleOpenItem(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.uri.scheme !== URI_SCHEME) {
            return;
        }

        const currentLine = editor.document.lineAt(
            editor.selection.active.line
        );
        const lineText = currentLine.text.trim();

        if (!lineText || lineText.startsWith("#")) {
            return;
        }

        const content = editor.document.getText();
        const directoryPath =
            this.pathResolver.getCurrentDirectoryFromBuffer(content);

        if (!directoryPath) {
            ErrorHandler.showOilError("Cannot determine directory path from oil document");
            return;
        }

        await this.openSelectedItem(directoryPath, lineText);
    }

    /**
     * Open the selected item (file or directory)
     */
    private async openSelectedItem(
        directoryPath: string,
        lineText: string
    ): Promise<void> {
        const entryName = IconUtils.extractEntryName(lineText);
        if (!entryName) {
            return;
        }

        const fullPath = path.join(directoryPath, entryName);

        try {
            const stat = await fs.promises.stat(fullPath);

            if (stat.isDirectory()) {
                await this.bufferManager.openBuffer(fullPath);
            } else {
                //? open the file in the same view column, which should replace the oil tab
                const fileUri = vscode.Uri.file(fullPath);
                await vscode.window.showTextDocument(fileUri, {
                    viewColumn: vscode.ViewColumn.Active,
                    preserveFocus: false,
                    preview: false,
                });
                
                //? close any remaining oil tabs
                const oilTabs = vscode.window.tabGroups.all
                    .flatMap(group => group.tabs)
                    .filter(tab => tab.input instanceof vscode.TabInputText && 
                                 tab.input.uri.scheme === URI_SCHEME);
                
                for (const oilTab of oilTabs) {
                    await vscode.window.tabGroups.close(oilTab);
                }
            }
        } catch (error) {
            ErrorHandler.showFileError("open", fullPath, error);
        }
    }

    /**
     * Handle toggling between icon types
     */
    private async handleToggleIconType(): Promise<void> {
        const options = [
            { label: "ASCII Icons", value: "ascii" as const },
            { label: "Nerd Font Icons", value: "nerd" as const },
            { label: "No Icons", value: "none" as const }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: "Select icon type"
        });

        if (selected) {
            IconUtils.setIconType(selected.value);
            
            //? refresh current oil buffer if open
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.uri.scheme === URI_SCHEME) {
                const content = activeEditor.document.getText();
                const currentPath = this.pathResolver.getCurrentDirectoryFromBuffer(content);
                if (currentPath) {
                    await this.bufferManager.openBuffer(currentPath);
                }
            }
            
            vscode.window.showInformationMessage(`Icon type changed to: ${selected.label}`);
        }
    }


}
