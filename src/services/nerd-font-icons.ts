export const NERD_FONT_ICONS = {
    //? general file types
    file: "\uf15b",
    dir: "\uf07c",
    folder: "\uf07c",
    "folder-open": "\uf07c",
    noext: "\uf016",

    //? programming languages
    js: "\ue74e",
    jsx: "\ue7ba",
    ts: "\ue8ca",
    tsx: "\ue7ba",
    json: "\ue60b",
    html: "\uf13b",
    htm: "\uf13b",
    css: "\ue749",
    scss: "\ue749",
    sass: "\ue749",
    less: "\ue758",
    php: "\ue73d",
    py: "\ue73c",
    python: "\ue73c",
    java: "\ue204",
    cpp: "\ue61d",
    c: "\ue61e",
    h: "\uf0fd",
    cs: "\uf81a",
    go: "\ue626",
    rs: "\ue7a8",
    rust: "\ue7a8",
    rb: "\ue21e",
    ruby: "\ue21e",
    swift: "\ue755",
    kt: "\ue634",
    kotlin: "\ue634",
    dart: "\ue798",
    lua: "\ue620",
    sh: "\uf489",
    bash: "\uf489",
    zsh: "\uf489",
    fish: "\uf489",
    ps1: "\uf489",
    bat: "\uf17a",
    cmd: "\uf17a",

    //? web technologies
    vue: "\ue6a0",
    react: "\ue7ba",
    angular: "\ue753",
    svelte: "\ue697",

    //? data/config files
    xml: "\ue619",
    yaml: "\uf481",
    yml: "\uf481",
    toml: "\uf481",
    ini: "\uf17a",
    conf: "\uf17a",
    config: "\uf17a",
    env: "\uf462",

    //? documentation
    md: "\uf48a",
    markdown: "\uf48a",
    txt: "\uf15c",
    pdf: "\uf1c1",
    doc: "\uf1c2",
    docx: "\uf1c2",
    rtf: "\uf15c",

    //? images
    png: "\uf1c5",
    jpg: "\uf1c5",
    jpeg: "\uf1c5",
    gif: "\uf1c5",
    svg: "\uf1c5",
    ico: "\uf1c5",
    webp: "\uf1c5",
    bmp: "\uf1c5",

    //? audio/video
    mp3: "\uf1c7",
    mp4: "\uf1c8",
    avi: "\uf1c8",
    mkv: "\uf1c8",
    mov: "\uf1c8",
    wav: "\uf1c7",
    flac: "\uf1c7",

    //? archives
    zip: "\uf1c6",
    rar: "\uf1c6",
    "7z": "\uf1c6",
    tar: "\uf1c6",
    gz: "\uf1c6",
    bz2: "\uf1c6",
    xz: "\uf1c6",

    //? database
    sql: "\uf1c0",
    db: "\uf1c0",
    sqlite: "\uf1c0",

    //? build/package files
    "package.json": "\ue71e",
    "package-lock.json": "\ue71e",
    "yarn.lock": "\ue718",
    "pnpm-lock.yaml": "\uf487",
    Dockerfile: "\uf308",
    "docker-compose.yml": "\uf308",
    "webpack.config.js": "\uf1e6",
    "vite.config.js": "\uf1e6",
    "tsconfig.json": "\ue628",
    eslintrc: "\ue60e",
    prettierrc: "\ue60e",
    gitignore: "\uf1d3",
    gitattributes: "\uf1d3",
    LICENSE: "\uf48a",
    "README.md": "\uf48a",
    "CHANGELOG.md": "\uf48a",
    Makefile: "\uf489",
    "CMakeLists.txt": "\uf489",

    //? version control
    git: "\uf1d3",

    //? special folders
    node_modules: "\ue71e",
    ".git": "\uf1d3",
    ".vscode": "\ue70c",
    ".idea": "\ue7b5",
    src: "\uf07c",
    dist: "\uf07c",
    build: "\uf07c",
    public: "\uf07c",
    assets: "\uf07c",
    images: "\uf1c5",
    docs: "\uf48a",
    test: "\uf0e7",
    tests: "\uf0e7",
    __tests__: "\uf0e7",
    coverage: "\uf0e7",

    //? default fallbacks
    unknown: "\uf016",
    binary: "\uf471",
    executable: "\uf489",
} as const;

//? alternative hex codes for compatibility
export const ALTERNATIVE_ICONS = {
    file: "\uF15B",
    folder: "\uF07C",
    js: "\uE74E",
    ts: "\uE628",
    json: "\uE60B",
    html: "\uF13B",
    css: "\uE749",
    py: "\uE73C",
    md: "\uF48A",
    git: "\uF1D3",
} as const;

export type IconType = "nerd" | "ascii" | "none";

export class NerdFontIconService {
    private currentIconType: IconType = "ascii";

    setIconType(type: IconType): void {
        this.currentIconType = type;
    }

    getIconType(): IconType {
        return this.currentIconType;
    }

    /**
     * Get appropriate icon for a file or directory
     */
    getIcon(filename: string, isDirectory: boolean = false): string {
        if (this.currentIconType === "ascii") {
            return this.getAsciiIcon(filename, isDirectory);
        } else if (this.currentIconType === "nerd") {
            return this.getNerdIcon(filename, isDirectory);
        }
        return "";
    }

    /**
     * Get nerd font icon for file/directory
     */
    private getNerdIcon(filename: string, isDirectory: boolean): string {
        if (isDirectory) {
            //? check for special folder names
            const folderIcon = (NERD_FONT_ICONS as any)[filename.toLowerCase()];
            if (folderIcon) {
                return folderIcon;
            }
            return NERD_FONT_ICONS.dir;
        }

        //? check for specific filenames first (like package.json, README.md)
        const specificIcon = (NERD_FONT_ICONS as any)[filename.toLowerCase()];
        if (specificIcon) {
            return specificIcon;
        }

        //? check by extension
        const extension = filename.split(".").pop()?.toLowerCase();
        if (extension && (NERD_FONT_ICONS as any)[extension]) {
            return (NERD_FONT_ICONS as any)[extension];
        }

        //? no extension
        if (!extension) {
            return NERD_FONT_ICONS.noext;
        }

        //? default file icon
        return NERD_FONT_ICONS.file;
    }

    /**
     * Get ASCII icon (current system)
     */
    private getAsciiIcon(filename: string, isDirectory: boolean): string {
        if (isDirectory) {
            return "[DIR]";
        }

        const extension = filename.split(".").pop()?.toLowerCase();
        const iconMap: { [key: string]: string } = {
            js: "[JS]",
            ts: "[TS]",
            json: "[JSON]",
            md: "[MD]",
            txt: "[TXT]",
            html: "[HTML]",
            css: "[CSS]",
            png: "[IMG]",
            jpg: "[IMG]",
            jpeg: "[IMG]",
            gif: "[IMG]",
            svg: "[IMG]",
            pdf: "[PDF]",
            zip: "[ZIP]",
            git: "[GIT]",
        };

        return iconMap[extension || ""] || "[FILE]";
    }
}

export const nerdFontIconService = new NerdFontIconService();
