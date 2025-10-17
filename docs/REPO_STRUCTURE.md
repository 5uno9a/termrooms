# REPO STRUCTURE — Expanded

## Client (React)
```
packages/client/
└─ src/
   ├─ pages/
   │  ├─ Home.tsx
   │  ├─ Play.tsx
   │  ├─ Create.tsx
   │  ├─ Docs.tsx
   │  ├─ About.tsx
   │  ├─ Help.tsx
   │  ├─ Account.tsx
   │  ├─ Room.tsx
   │  └─ DevSandbox.tsx
   ├─ components/
   │  ├─ panels/
   │  │  ├─ OverviewPanel.tsx
   │  │  ├─ CoolantFlowPanel.tsx
   │  │  ├─ CommandLogPanel.tsx
   │  │  └─ PlayerPanel.tsx
   │  └─ widgets/
   │     ├─ BarWidget.tsx
   │     ├─ LogWidget.tsx
   │     ├─ SchematicWidget.tsx
   │     ├─ ChecklistWidget.tsx
   │     └─ TerminalWidget.tsx
   ├─ hooks/
   │  ├─ useDevEngine.ts
   │  ├─ useRoom.ts
   │  └─ useAuth.ts
   ├─ lib/
   │  ├─ schemaValidator.ts
   │  └─ socket.ts (later)
   ├─ styles/
   │  └─ theme.css
   └─ games/
      ├─ reactor.json
      └─ simple-counter.json
```

## Server (Node)
```
packages/server/
└─ src/
   ├─ index.ts
   ├─ network/
   │  ├─ sockets/
   │  │  ├─ RoomSocket.ts
   │  │  ├─ PlayerSocket.ts
   │  │  └─ ActionSocket.ts
   │  └─ api/
   │     ├─ rooms.ts
   │     └─ players.ts
   ├─ core/
   │  ├─ RoomManager.ts
   │  ├─ RoleManager.ts
   │  ├─ EventLogger.ts
   │  └─ DiffBuilder.ts
   └─ engine/
      ├─ state/RoomState.ts
      ├─ logic/{ActionProcessor,RuleEngine,Randomizer,TickLoop}.ts
      └─ model/{ModelLoader,SchemaValidator}.ts
```
