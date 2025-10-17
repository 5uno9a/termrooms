# 10 — Developer Environment (Creator Mode)

## Purpose
A dedicated page `/dev-sandbox` to **edit, validate, run, and export** JSON game models.

## Layout
- Left: `EditorPanel` (Monaco or textarea)
- Right: `PreviewPanel` (Unicode panels)
- Toolbar: Run / Pause / Reset / Validate / Export
- Bottom: `DevLogPanel`

## Hook
`useDevEngine` — client-side tick loop for sandbox only.

## Style
Dark theme, rounded panels, JetBrains Mono, high contrast.

## Flow
Load template → edit → validate → run → export (local). No backend required.
