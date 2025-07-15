import * as vscode from "vscode";
import * as path from "path";
import { DocumentProvider } from "../providers/document-provider";
import { URI_SCHEME } from "../constants";

export class BufferManager {
    constructor(private provider: DocumentProvider) {}

    /**
     * Open oil buffer for a directory with optional file focus
     */
    async openBuffer(
        directoryPath: string,
        focusFileName?: string
    ): Promise<void> {
        const activeEditor = vscode.window.activeTextEditor;
        const isCurrentlyInOil =
            activeEditor &&
            activeEditor.document.uri.scheme === URI_SCHEME;

        if (isCurrentlyInOil) {
            this.provider.setCurrentDirectory(directoryPath);
            if (focusFileName) {
                this.provider.focusOnEntry(focusFileName);
                setTimeout(
                    () =>
                        this.positionCursorOnFocusedEntry(
                            activeEditor,
                            focusFileName
                        ),
                    100
                );
            }
        } else {
            const staticOilUri = vscode.Uri.parse(
                `${URI_SCHEME}://current`
            );

            this.provider.setCurrentDirectory(directoryPath);
            const document = await vscode.workspace.openTextDocument(
                staticOilUri
            );
            const editor = await vscode.window.showTextDocument(document, {
                viewColumn: vscode.ViewColumn.Active,
                preserveFocus: false,
                preview: false,
            });

            if (focusFileName) {
                this.provider.focusOnEntry(focusFileName);
                setTimeout(
                    () =>
                        this.positionCursorOnFocusedEntry(
                            editor,
                            focusFileName
                        ),
                    100
                );
            }
        }
    }

    /**
     * Position cursor on the focused entry in the oil buffer
     */
    private positionCursorOnFocusedEntry(
        editor: vscode.TextEditor,
        focusFileName: string
    ): void {
        if (!focusFileName || !editor || !editor.document) {
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const lines = text.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (!line.trim() || line.startsWith("#")) {
                continue;
            }

            const extractedName = this.extractEntryNameFromLine(line);

            if (extractedName === focusFileName) {
                const position = new vscode.Position(i, 0);
                const selection = new vscode.Selection(position, position);
                editor.selection = selection;
                editor.revealRange(
                    new vscode.Range(position, position),
                    vscode.TextEditorRevealType.InCenter
                );
                return;
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() && !line.startsWith("#")) {
                const position = new vscode.Position(i, 0);
                const selection = new vscode.Selection(position, position);
                editor.selection = selection;
                editor.revealRange(
                    new vscode.Range(position, position),
                    vscode.TextEditorRevealType.InCenter
                );
                return;
            }
        }
    }

    /**
     * Extract entry name from oil buffer line
     */
    private extractEntryNameFromLine(line: string): string | null {
        //? remove ASCII-style icons like [DIR], [FILE], [JS], etc.
        const withoutIcon = line.replace(/^\[[\w]+\]\s+/, "");

        //? remove trailing slash for directories
        const name = withoutIcon.replace(/\/$/, "");

        if (name && !name.includes("/") && name !== "..") {
            return name;
        }

        return null;
    }
}
