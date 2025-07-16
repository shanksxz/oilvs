import * as vscode from "vscode";
import { IconUtils } from "./icon-utils";

export class CursorUtils {
    /**
     * Position cursor on a specific entry in the oil buffer
     */
    static positionCursorOnEntry(
        editor: vscode.TextEditor,
        entryName: string
    ): void {
        if (!entryName || !editor || !editor.document) {
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const lines = text.split("\n");

        //? first, try to find the exact entry
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (!line.trim() || line.startsWith("#")) {
                continue;
            }

            const extractedName = IconUtils.extractEntryName(line);
            if (extractedName === entryName) {
                this.setCursorPosition(editor, i);
                return;
            }
        }

        //? if not found, position at the first content line
        this.positionCursorAtTop(editor);
    }

    /**
     * Position cursor at the top of the content (first non-comment line)
     */
    static positionCursorAtTop(editor: vscode.TextEditor): void {
        if (!editor || !editor.document) {
            return;
        }

        const document = editor.document;
        const text = document.getText();
        const lines = text.split("\n");

        //? find the first non-comment line (content line)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() && !line.startsWith("#")) {
                this.setCursorPosition(editor, i);
                return;
            }
        }

        //? if no content lines found, position at the beginning
        this.setCursorPosition(editor, 0);
    }

    /**
     * Set cursor position at a specific line
     */
    private static setCursorPosition(editor: vscode.TextEditor, lineIndex: number): void {
        const position = new vscode.Position(lineIndex, 0);
        const selection = new vscode.Selection(position, position);
        editor.selection = selection;
        editor.revealRange(
            new vscode.Range(position, position),
            vscode.TextEditorRevealType.InCenter
        );
    }
} 