import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { URI_SCHEME } from "../constants";

export class DocumentProvider implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    readonly onDidChange = this._onDidChange.event;

    private currentDirectoryPath: string = "";
    private focusedFileName: string | undefined;

    get onDidChangeEmitter() {
        return this._onDidChange;
    }

    setCurrentDirectory(directoryPath: string) {
        this.currentDirectoryPath = directoryPath;
        const staticUri = vscode.Uri.parse(`${URI_SCHEME}://current`);
        this._onDidChange.fire(staticUri);
    }

    focusOnEntry(fileName: string) {
        this.focusedFileName = fileName;
        const staticUri = vscode.Uri.parse(`${URI_SCHEME}://current`);
        this._onDidChange.fire(staticUri);
    }

    /**
     * Provide text content for a given URI
     */
    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const directoryPath = this.currentDirectoryPath || process.cwd();

        try {
            return await this.generateDirectoryContent(directoryPath);
        } catch (error) {
            return `Error reading directory: ${directoryPath}\n${error}`;
        }
    }

    /**
     * Generate text content representing the directory structure
     */
    private async generateDirectoryContent(
        directoryPath: string
    ): Promise<string> {
        const entries = await fs.promises.readdir(directoryPath, {
            withFileTypes: true,
        });

        const sortedEntries = entries.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        });

        const lines: string[] = [];

        for (const entry of sortedEntries) {
            const icon = this.getFileIcon(entry);
            const suffix = entry.isDirectory() ? "/" : "";
            const entryName = entry.name;

            lines.push(`${icon} ${entryName}${suffix}`);
        }

        this.focusedFileName = undefined;

        lines.push("");
        lines.push(`# ${directoryPath}`);

        lines.push("");
        lines.push("# Instructions:");
        lines.push("# - Open: Press Enter on a file/directory");
        lines.push("# - Parent: Press '-' to go up one level");

        return lines.join("\n");
    }

    /**
     * Get appropriate icon for file/directory
     * Using ASCII characters instead
     * TODO: use file icons instead
     */
    private getFileIcon(entry: fs.Dirent): string {
        if (entry.isDirectory()) {
            return "[DIR]";
        }

        const ext = path.extname(entry.name).toLowerCase();
        const iconMap: { [key: string]: string } = {
            ".js": "[JS]",
            ".ts": "[TS]",
            ".json": "[JSON]",
            ".md": "[MD]",
            ".txt": "[TXT]",
            ".html": "[HTML]",
            ".css": "[CSS]",
            ".png": "[IMG]",
            ".jpg": "[IMG]",
            ".jpeg": "[IMG]",
            ".gif": "[IMG]",
            ".svg": "[IMG]",
            ".pdf": "[PDF]",
            ".zip": "[ZIP]",
            ".git": "[GIT]",
        };

        return iconMap[ext] || "[FILE]";
    }

    /**
     * Refresh the content for a specific URI
     */
    refresh(uri: vscode.Uri): void {
        this._onDidChange.fire(uri);
    }
}
