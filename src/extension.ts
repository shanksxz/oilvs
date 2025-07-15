import * as vscode from "vscode";
import { DocumentProvider } from "./providers/document-provider";
import { BufferManager } from "./services/buffer-manager";
import { PathResolver } from "./services/path-resolver";
import { OilCommands } from "./commands/oil-commands";
import { URI_SCHEME } from "./constants";

export function activate(context: vscode.ExtensionContext) {
    const provider = new DocumentProvider();
    const bufferManager = new BufferManager(provider);
    const pathResolver = new PathResolver();
    const oilCommands = new OilCommands(bufferManager, pathResolver);

    const providerDisposable =
        vscode.workspace.registerTextDocumentContentProvider(
            URI_SCHEME,
            provider
        );

    oilCommands.registerCommands(context);

    context.subscriptions.push(providerDisposable);
}

export function deactivate() {
    //? cleanup if needed
}
