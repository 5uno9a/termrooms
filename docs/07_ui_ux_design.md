# 07 — UI/UX Design & Accessibility

## Design System

### Color Palette
```css
/* Primary Colors */
--bg-primary: #0A0A0A;        /* Main background */
--bg-secondary: #151515;      /* Panel background */
--bg-tertiary: #1F1F1F;       /* Input/button background */

/* Text Colors */
--text-primary: #FFFFFF;      /* Primary text */
--text-secondary: #AAAAAA;    /* Secondary text */
--text-muted: #666666;        /* Muted text */
--text-accent: #00D4FF;       /* Accent/links */

/* Status Colors */
--success: #00FF88;           /* Success messages */
--warning: #FFB800;           /* Warning messages */
--error: #FF4444;             /* Error messages */
--info: #00D4FF;              /* Info messages */

/* Interactive Colors */
--border: #333333;            /* Default borders */
--border-focus: #00D4FF;      /* Focus borders */
--border-hover: #555555;      /* Hover borders */
```

### Typography
```css
/* Font Stack */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-sans: 'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

### Spacing Scale
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
```

## Component Library

### Terminal Component
```tsx
interface TerminalProps {
  onCommand: (command: string) => void;
  output: TerminalOutput[];
  isActive: boolean;
  placeholder?: string;
}

interface TerminalOutput {
  type: 'command' | 'response' | 'error' | 'system';
  content: string;
  timestamp: Date;
  user?: string;
}
```

**Features:**
- Monospace font with proper line height
- Command history with arrow key navigation
- Auto-completion for known commands
- Syntax highlighting for different output types
- Copy-to-clipboard functionality
- Keyboard shortcuts (Ctrl+C, Ctrl+L, etc.)

### Participants Panel
```tsx
interface ParticipantsPanelProps {
  members: RoomMember[];
  currentUser: User;
  onKick?: (userId: string) => void;
}

interface RoomMember {
  id: string;
  alias: string;
  role: 'owner' | 'member';
  status: 'online' | 'away' | 'offline';
  lastSeenAt: Date;
}
```

**Features:**
- Real-time presence indicators
- Role badges (owner/member)
- Last seen timestamps
- Click-to-mention functionality
- Responsive member count

### Message Stream
```tsx
interface MessageStreamProps {
  messages: Message[];
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
}

interface Message {
  id: string;
  user: { id: string; alias: string };
  body: string;
  type: 'chat' | 'system' | 'command';
  createdAt: Date;
  reactions?: MessageReaction[];
}
```

**Features:**
- Auto-scroll to latest messages
- Message timestamps
- User mentions with highlighting
- Emoji reactions (stretch goal)
- Message search and filtering

## Page Layouts

### Landing Page
```
┌─────────────────────────────────────────┐
│  TermRooms                    [Help]    │
├─────────────────────────────────────────┤
│                                         │
│  Welcome to TermRooms                   │
│  Create or join terminal rooms          │
│                                         │
│  ┌─────────────────┐ ┌─────────────────┐│
│  │   Create Room   │ │    Join Room    ││
│  │                 │ │                 ││
│  │ [Room Name]     │ │ [Room Name]     ││
│  │ [Password]      │ │ [Password]      ││
│  │                 │ │                 ││
│  │ [Create]        │ │ [Join]          ││
│  └─────────────────┘ └─────────────────┘│
│                                         │
│  Recent Bookmarks:                      │
│  ⭐ my-room (5 members)                 │
│  ⭐ project-alpha (12 members)          │
│                                         │
└─────────────────────────────────────────┘
```

### Room View
```
┌─────────────────────────────────────────┐
│  my-room                    [5 members] │
├─────────────────┬───────────────────────┤
│                 │  Participants         │
│  Terminal       ├───────────────────────┤
│                 │  👤 alice (owner)     │
│  $ /who         │  👤 bob (member)      │
│  alice, bob     │  👤 charlie (member)  │
│  $ /msg hello   │                       │
│  alice: hello   ├───────────────────────┤
│  bob: hi there  │  Messages             │
│  $              │                       │
│                 │  alice: hello         │
│                 │  bob: hi there        │
│                 │                       │
└─────────────────┴───────────────────────┘
```

## Accessibility Features

### WCAG 2.2 AA Compliance

#### Keyboard Navigation
- **Tab Order**: Logical focus flow through all interactive elements
- **Skip Links**: "Skip to terminal" link for screen reader users
- **Keyboard Shortcuts**:
  - `Ctrl + /` - Focus terminal input
  - `Escape` - Clear terminal input
  - `Ctrl + L` - Clear terminal output
  - `Arrow Up/Down` - Navigate command history
  - `Tab` - Auto-complete commands

#### Focus Management
- **Visible Focus**: High contrast focus indicators (4.5:1 ratio)
- **Focus Trapping**: Modal dialogs trap focus appropriately
- **Focus Restoration**: Return focus after modal closes
- **Live Regions**: Announce real-time updates to screen readers

#### Screen Reader Support
- **ARIA Labels**: All interactive elements properly labeled
- **Live Regions**: `role="log"` for terminal output, `role="status"` for system messages
- **Headings**: Proper heading hierarchy (h1 → h2 → h3)
- **Landmarks**: Navigation, main, complementary regions defined

#### Visual Accessibility
- **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Text Scaling**: Support for 200% zoom without horizontal scrolling
- **High Contrast Mode**: Alternative color scheme for visual impairments
- **Motion Reduction**: Respect `prefers-reduced-motion` setting

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--mobile: 320px;      /* Small phones */
--tablet: 768px;      /* Tablets */
--desktop: 1024px;    /* Desktop */
--wide: 1440px;       /* Large screens */
```

### Mobile Layout
- **Stacked Panels**: Terminal and participants stack vertically
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Swipe to toggle panel visibility
- **Virtual Keyboard**: Terminal input adjusts for mobile keyboards

### Tablet Layout
- **Split View**: Side-by-side panels with adjustable widths
- **Touch + Keyboard**: Support for both touch and keyboard input
- **Orientation**: Works in both portrait and landscape modes

## Animation & Transitions

### Micro-interactions
- **Button Hover**: Subtle scale and color transitions
- **Focus States**: Smooth focus ring animations
- **Loading States**: Skeleton screens and progress indicators
- **Message Appearance**: Fade-in animation for new messages

### Performance
- **Hardware Acceleration**: Use `transform` and `opacity` for smooth animations
- **Reduced Motion**: Respect user preferences for motion sensitivity
- **Frame Rate**: Maintain 60fps for all animations
- **Battery Consideration**: Minimize animations on mobile devices
