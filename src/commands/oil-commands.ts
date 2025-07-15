import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { BufferManager } from "../services/buffer-manager";
import { PathResolver } from "../services/path-resolver";
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

        context.subscriptions.push(openDirectoryCommand, openItemCommand);
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
            vscode.window.showErrorMessage(
                "Cannot determine directory path from oil document"
            );
            return;
        }

        const parentPath = path.dirname(currentPath);

        if (parentPath !== currentPath) {
            const currentDirName = path.basename(currentPath);
            await this.bufferManager.openBuffer(parentPath, currentDirName);
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
            vscode.window.showErrorMessage(
                "Cannot determine directory path from oil document"
            );
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
        const entryName = this.extractEntryNameFromLine(lineText);
        if (!entryName) {
            return;
        }

        const fullPath = path.join(directoryPath, entryName);

        try {
            const stat = await fs.promises.stat(fullPath);

            if (stat.isDirectory()) {
                await this.bufferManager.openBuffer(fullPath);
            } else {
                const fileUri = vscode.Uri.file(fullPath);
                await vscode.window.showTextDocument(fileUri, {
                    viewColumn: vscode.ViewColumn.Active,
                    preserveFocus: false,
                    preview: false,
                });
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Cannot open: ${fullPath}`);
        }
    }

    /**
     * Extract entry name from oil buffer line
     */
    private extractEntryNameFromLine(line: string): string | null {
        const withoutIcon = line.replace(/^\[[\w]+\]\s+/, "");

        const name = withoutIcon.replace(/\/$/, "");

        if (name && !name.includes("/") && name !== "..") {
            return name;
        }

        return null;
    }
}
