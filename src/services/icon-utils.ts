import { nerdFontIconService, type IconType } from "./nerd-font-icons";

export class IconUtils {
      /**
   * Universal icon stripper that handles all icon types
   */
  static stripIconFromLine(line: string): string {
    //? try different icon patterns in order
    const patterns = [
      /^\[[\w]+\]\s+/,                    //? ascii icons: [DIR], [FILE], [JS], etc.
      /^[\u{E000}-\u{F8FF}]\s+/u,        //? private use area (most nerd fonts)
      /^[\u{F0000}-\u{FFFFD}]\s+/u,      //? supplementary private use area-a
      /^[\p{So}\p{Sm}\p{Sc}]\s+/u,       //? standard unicode symbols
      /^.\s+/                            //? fallback: any single character + space
    ];
    
    for (const pattern of patterns) {
      const result = line.replace(pattern, "");
      if (result !== line) {
        return result; //? pattern matched, return the result
      }
    }
    
    return line; //? no pattern matched
  }

    /**
     * Extract clean entry name from oil buffer line
     */
    static extractEntryName(line: string): string | null {
        const withoutIcon = this.stripIconFromLine(line);
        const name = withoutIcon.replace(/\/$/, ""); //? remove trailing slash

        if (name && !name.includes("/") && name !== "..") {
            return name;
        }
        return null;
    }

      /**
   * Detect icon type from line
   */
  static detectIconType(line: string): IconType {
    if (/^\[[\w]+\]\s+/.test(line)) {
        return "ascii";
    }
    if (/^[\u{E000}-\u{F8FF}]\s+/u.test(line)) {
        return "nerd"; //? private use area
    }
    if (/^[\u{F0000}-\u{FFFFD}]\s+/u.test(line)) {
        return "nerd"; //? supplementary private use area-a
    }
    if (/^[\p{So}\p{Sm}\p{Sc}]\s+/u.test(line)) {
        return "nerd";
    }
    return "none";
  }

    /**
     * Get icon for file/directory using current icon service
     */
    static getIconForEntry(filename: string, isDirectory: boolean): string {
        return nerdFontIconService.getIcon(filename, isDirectory);
    }

    /**
     * Set global icon type
     */
    static setIconType(type: IconType): void {
        nerdFontIconService.setIconType(type);
    }

    /**
     * Get current icon type
     */
    static getIconType(): IconType {
        return nerdFontIconService.getIconType();
    }
}
