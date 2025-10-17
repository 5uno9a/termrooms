# 03 — Engine Architecture

## Layers
1. **State Store** — authoritative room state (vars, entities, players, log).
2. **Interpreter** — applies actions and rules to state.
3. **Tick Loop** — periodic evaluation + random events.
4. **Sync Layer** — Socket.IO diffs to clients (later).

## Room Lifecycle
Create → Start → Play → End → Destroy

## Key Types (sketch)
```ts
type Var = { value: number, unit?: string, min?: number, max?: number };
type Entity = Record<string, string | number | boolean>;
type Effect =
  | { type: 'set', path: string, value: any }
  | { type: 'delta', path: string, amount: number }
  | { type: 'log', text: string };

type Action = {
  name: string;
  allowed_roles?: string[];
  conditions?: any[];
  effects: Effect[];
};

type Rule = {
  trigger: 'tick' | 'event';
  conditions?: any[];
  effects: Effect[];
};
```

## Determinism
- Single authoritative tick on server
- Client is view-only (except action requests)
- Random seed stored in meta for reproducible runs
