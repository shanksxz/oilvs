import * as vscode from "vscode";
import { DocumentProvider } from "../providers/document-provider";
import { CursorUtils } from "./cursor-utils";
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
                        CursorUtils.positionCursorOnEntry(
                            activeEditor,
                            focusFileName
                        ),
                    100
                );
            } else {
                //? position cursor at the top when no specific focus is needed
                setTimeout(
                    () => CursorUtils.positionCursorAtTop(activeEditor),
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
                        CursorUtils.positionCursorOnEntry(
                            editor,
                            focusFileName
                        ),
                    100
                );
            } else {
                //? position cursor at the top when no specific focus is needed
                setTimeout(
                    () => CursorUtils.positionCursorAtTop(editor),
                    100
                );
            }
        }
    }




}
