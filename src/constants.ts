export const URI_SCHEME = "oil";

export const COMMANDS = {
    OPEN_DIRECTORY: "oilvs.openDirectory",
    OPEN_PARENT: "oilvs.openParent",
} as const;

export const WEBVIEW_TYPES = {
    DIRECTORY_VIEW: "oilvs.directoryView",
} as const;

export const DISPLAY_NAMES = {
    EXTENSION: "Oil VS",
    DIRECTORY_VIEW: "Oil Directory",
} as const;

//? not using this for now
export const FILE_ICONS = {
    ".js": "📄",
    ".ts": "📘",
    ".json": "📋",
    ".md": "📝",
    ".txt": "📄",
    ".html": "🌐",
    ".css": "🎨",
    ".png": "🖼️",
    ".jpg": "🖼️",
    ".jpeg": "🖼️",
    ".gif": "🖼️",
    ".svg": "🖼️",
    ".pdf": "📕",
    ".zip": "📦",
    ".git": "🔧",
} as const;

//? not using this for now
export const DEFAULT_ICONS = {
    DIRECTORY: "📁",
    PARENT: "↰",
    FILE: "��",
} as const;
