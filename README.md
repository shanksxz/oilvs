# Oil VS

A simple file manager for VS Code inspired by oil.nvim. Navigate directories like text buffers.

## What it does

- Press `-` to open the current directory as a text document
- Press `-` again to go to parent directory  
- Press `Enter` to open files or folders
- No new tabs, everything happens in the same buffer

## How to use

1. Open any file in VS Code
2. Press `-` to see the directory as text
3. Use arrow keys to navigate, `Enter` to open things
4. Press `-` to go up a directory

That's it!

## Customizing Keybindings

You can customize any keybinding through VS Code's settings:

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Preferences: Open Keyboard Shortcuts"
3. Search for "Oil VS" commands:
   - `Oil VS: Open Directory in Oil View` (default: `-`)
   - `Oil VS: Go Up One Level` (default: `-`)
   - `Oil VS: Open File/Directory` (default: `Enter`)

Or add to your `keybindings.json`:
```json
[
  {
    "key": "your-preferred-key",
    "command": "oilvs.goUpLevel",
    "when": "editorTextFocus && resourceScheme == oil"
  }
]
```

## File indicators

- `[DIR]` - folders
- `[FILE]` - regular files  
- `[JS]` - JavaScript files
- `[TS]` - TypeScript files
- And a few others...

## Why?

Sometimes you just want to navigate files like text. If you've used oil.nvim, you'll feel right at home.

