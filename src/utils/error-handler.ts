import * as vscode from "vscode";

export class ErrorHandler {
    static showDirectoryError(
        operation: string,
        path: string,
        error?: unknown
    ): void {
        const message = `Cannot ${operation} directory: ${path}`;
        console.error(message, error);
        vscode.window.showErrorMessage(message);
    }
    static showFileError(
        operation: string,
        path: string,
        error?: unknown
    ): void {
        const message = `Cannot ${operation} file: ${path}`;
        console.error(message, error);
        vscode.window.showErrorMessage(message);
    }
    static showOilError(message: string, error?: unknown): void {
        console.error(`Oil VS Error: ${message}`, error);
        vscode.window.showErrorMessage(message);
    }
    static showContextError(command: string, expectedContext: string): void {
        const message = `${command} can only be used ${expectedContext}`;
        vscode.window.showErrorMessage(message);
    }
}
