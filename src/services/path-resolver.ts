import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { URI_SCHEME } from "../constants";

export class PathResolver {
    /**
     * Resolve the target path for directory operations
     */
    async resolveTargetPath(uri?: vscode.Uri): Promise<string | null> {
        let targetPath: string;

        if (uri) {
            targetPath = uri.fsPath;
        } else {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                const currentUri = activeEditor.document.uri;
                if (currentUri.scheme === URI_SCHEME) {
                    targetPath = decodeURIComponent(currentUri.path);
                } else {
                    targetPath = path.dirname(activeEditor.document.uri.fsPath);
                }
            } else if (vscode.workspace.workspaceFolders) {
                targetPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            } else {
                vscode.window.showErrorMessage("No workspace folder found");
                return null;
            }
        }

        try {
            const stat = await fs.promises.stat(targetPath);
            if (!stat.isDirectory()) {
                targetPath = path.dirname(targetPath);
            }
        } catch (error) {
            vscode.window.showErrorMessage(
                `Cannot access directory: ${targetPath}`
            );
            return null;
        }

        return targetPath;
    }

    /**
     * Get current directory path from oil buffer content
     */
    getCurrentDirectoryFromBuffer(content: string): string | null {
        const lines = content.split("\n");
        const headerLine = lines.find((line) => line.startsWith("# "));

        if (!headerLine) {
            return null;
        }

        //? remove the "# " prefix
        return headerLine.substring(2);
    }
}
