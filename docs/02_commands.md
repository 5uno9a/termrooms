# 02 — Command Reference

## Game Discovery Commands
| Command | Syntax | Description | Example |
|---------|--------|-------------|---------|
| `/games` | `/games` | List public games | `/games` |
| `/games search` | `/games search {term}` | Search games | `/games search reactor` |
| `/games info` | `/games info {gameId}` | Show game details | `/games info reactor-v1` |

## Game Instance Commands
| Command | Syntax | Description | Example |
|---------|--------|-------------|---------|
| `/join` | `/join {gameId} [password]` | Join game instance | `/join reactor-abc123 secret` |
| `/leave` | `/leave` | Leave current instance | `/leave` |
| `/who` | `/who` | Show players in instance | `/who` |

## Communication Commands
| Command | Syntax | Description | Example |
|---------|--------|-------------|---------|
| `/chat` | `/chat {message}` | Send message to instance | `/chat Starting pump A` |
| `/command` | `/command {action}` | Execute game action | `/command pump_on` |

## Game Control Commands
| Command | Syntax | Description | Example |
|---------|--------|-------------|---------|
| `/game start` | `/game start` | Start the game | `/game start` |
| `/game pause` | `/game pause` | Pause/resume game | `/game pause` |
| `/game end` | `/game end` | End current game | `/game end` |
| `/game status` | `/game status` | Show game state | `/game status` |

## UI Management Commands
| Command | Syntax | Description | Example |
|---------|--------|-------------|---------|
| `/ui panel add` | `/ui panel add {id} width={w} title="{title}"` | Add panel | `/ui panel add status width=6 title="Core Status"` |
| `/ui add` | `/ui add {widget} panel={id} var={var}` | Add widget | `/ui add bar panel=status var=power` |
| `/ui layout` | `/ui layout {type}` | Change layout | `/ui layout vertical` |
| `/ui panel move` | `/ui panel move {id} x={x} y={y}` | Move panel | `/ui panel move status x=2 y=3` |
| `/ui panel resize` | `/ui panel resize {id} w={w} h={h}` | Resize panel | `/ui panel resize status w=4 h=6` |

## Dev Sandbox Commands
| Command | Syntax | Description | Example |
|---------|--------|-------------|---------|
| `/dev new` | `/dev new {name}` | Create new game | `/dev new my-reactor` |
| `/dev load` | `/dev load {gameId}` | Load existing game | `/dev load reactor-v1` |
| `/dev save` | `/dev save` | Save current game | `/dev save` |
| `/dev publish` | `/dev publish [private]` | Publish game | `/dev publish` |
| `/dev preview` | `/dev preview` | Preview game | `/dev preview` |
| `/dev test` | `/dev test` | Test game locally | `/dev test` |
