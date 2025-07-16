# Changelog

## [0.1.0] - Bug fixes and improvements

### What's fixed
- Fixed tab closing issue - no more flickering when opening files
- Fixed keybinding conflict with `-` key navigation
- Fixed cursor positioning when navigating directories

### What's improved
- Cleaned up duplicate code and unused constants
- Better error handling throughout
- Smaller bundle size
- Added GitHub issue and PR templates

### How it works
- Same as before, just more reliable and cleaner code
- Context-specific keybindings work better now

## [0.0.1] - Initial Release

### What's new
- Press `-` to open directories as text buffers
- Press `Enter` to open files/folders
- Navigate up with `-` when you're in a directory view
- File type indicators like `[DIR]`, `[JS]`, `[TS]`, etc.
- Everything happens in the same buffer (no new tabs)

### How it works
- Uses VS Code's text document provider
- Virtual `oil://` scheme for directory buffers
- Cursor automatically jumps to your current file when opening

### Known issues
- Read-only for now (can't rename/edit files yet)

---

Inspired by oil.nvim. Simple file navigation for VS Code.