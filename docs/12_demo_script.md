# 12 — Demo Script & Presentation

## 5-Minute Live Demo Flow

### Pre-Demo Setup (2 minutes)
1. **Open browser**: Navigate to `https://termrooms.dev`
2. **Clear browser data**: Ensure fresh start
3. **Prepare terminal**: Have terminal commands ready
4. **Test audio/video**: Ensure screen sharing works

### Demo Script (5 minutes)

#### Introduction (30 seconds)
> "TermRooms is a web-based terminal rooms platform that lets users create and join collaborative spaces using familiar slash commands. Think Discord, but with a terminal interface that's accessible and keyboard-friendly."

#### 1. Create Alias & Room (1 minute)
**Actions:**
1. Type alias: `alice` in the alias input
2. Click "Create Alias"
3. Type room name: `demo-room` in create room field
4. Click "Create Room"

**Narration:**
> "First, I'll create an alias - no registration required. Then I'll create a room called 'demo-room'. Notice how the terminal interface immediately shows the room creation confirmation."

**Expected Output:**
```
$ /create demo-room
created room demo-room
```

#### 2. Demonstrate Terminal Commands (1.5 minutes)
**Actions:**
1. Type `/who` and press Enter
2. Type `/topic Welcome to the demo room` and press Enter
3. Type `/msg Hello everyone! This is a real-time message` and press Enter
4. Type `/help` and press Enter

**Narration:**
> "Now I'll demonstrate the core terminal commands. `/who` shows who's in the room, `/topic` sets a room description, and `/msg` sends real-time messages. The `/help` command shows all available commands."

**Expected Output:**
```
$ /who
alice (owner)

$ /topic Welcome to the demo room
topic updated

$ /msg Hello everyone! This is a real-time message
alice: Hello everyone! This is a real-time message

$ /help
Available commands:
/create <name> - Create a new room
/join <name> [password] - Join a room
/leave - Leave current room
/who - Show room members
/msg <text> - Send a message
/topic <text> - Set room topic (owner only)
/passwd set <password> - Set room password (owner only)
/passwd clear - Remove room password (owner only)
/help - Show this help
```

#### 3. Password Protection (1 minute)
**Actions:**
1. Type `/passwd set demopass123` and press Enter
2. Open new browser tab
3. Navigate to `https://termrooms.dev`
4. Create alias: `bob`
5. Try to join room: `demo-room`
6. Enter password: `demopass123`
7. Click "Join Room"

**Narration:**
> "Now I'll demonstrate password protection. I'll set a password for the room, then open a new browser tab to simulate another user joining. Notice how the password is required and the real-time presence updates."

**Expected Output:**
```
$ /passwd set demopass123
password set

# In new tab after joining:
$ /who
alice (owner), bob (member)
```

#### 4. Real-time Features (1 minute)
**Actions:**
1. In first tab, type `/msg Real-time messaging works!`
2. In second tab, type `/msg Yes, I can see your message instantly!`
3. In first tab, type `/who` to show updated presence
4. In second tab, click the bookmark star ⭐

**Narration:**
> "Here you can see real-time messaging in action. Messages appear instantly in both tabs, and presence updates show who's online. The bookmark feature lets users save rooms for quick access later."

**Expected Output:**
```
# Tab 1:
$ /msg Real-time messaging works!
alice: Real-time messaging works!

# Tab 2:
bob: Yes, I can see your message instantly!

# Tab 1:
$ /who
alice (owner), bob (member)
```

#### 5. Accessibility & Mobile (30 seconds)
**Actions:**
1. Press Tab key to show keyboard navigation
2. Press Ctrl + / to focus terminal
3. Show mobile responsive design (browser dev tools)

**Narration:**
> "TermRooms is fully accessible with keyboard navigation and screen reader support. It's also mobile-responsive, making it usable on any device. The terminal interface works great on touch screens too."

### Closing (30 seconds)
> "TermRooms demonstrates modern web development with real-time features, security, and accessibility. It's built with React, Node.js, WebSockets, and follows best practices for performance and user experience. The source code is available on GitHub, and the application is deployed and ready to use."

## 7-Minute Extended Demo (Optional)

### Additional Features to Show
1. **Bookmark Management**: Show bookmark list and removal
2. **Error Handling**: Demonstrate invalid commands and error messages
3. **Rate Limiting**: Show rate limiting in action
4. **Audit Log**: Show room activity log (if time permits)
5. **Mobile Experience**: Full mobile demonstration

## Demo Preparation Checklist

### Technical Setup
- [ ] **Browser**: Chrome/Firefox with developer tools
- [ ] **Network**: Stable internet connection
- [ ] **Audio**: Microphone and speakers working
- [ ] **Screen**: High resolution for clear terminal text
- [ ] **Backup**: Have screenshots ready in case of issues

### Content Preparation
- [ ] **Commands**: Practice all terminal commands
- [ ] **Timing**: Rehearse timing for 5-minute demo
- [ ] **Backup Plan**: Prepare for technical difficulties
- [ ] **Questions**: Anticipate common questions
- [ ] **Code**: Have code snippets ready to show

### Environment Setup
- [ ] **Fresh State**: Clear browser data for clean demo
- [ ] **Multiple Tabs**: Have tabs ready for multi-user demo
- [ ] **Bookmarks**: Clear bookmarks for fresh start
- [ ] **Network**: Test on different network if possible

## Common Questions & Answers

### Technical Questions
**Q: What technologies did you use?**
A: React with TypeScript for the frontend, Node.js with Express for the backend, Socket.IO for real-time communication, PostgreSQL for data persistence, and Tailwind CSS for styling.

**Q: How do you handle security?**
A: We implement JWT authentication, password hashing with bcrypt, rate limiting, input validation, CSRF protection, and comprehensive audit logging.

**Q: How does the real-time communication work?**
A: We use Socket.IO for WebSocket connections, with automatic reconnection, message queuing, and efficient room-based broadcasting.

### Feature Questions
**Q: Can users create private rooms?**
A: Yes, room owners can set passwords using the `/passwd` command, and only users with the password can join.

**Q: Is it accessible for users with disabilities?**
A: Absolutely. We follow WCAG 2.2 AA guidelines with keyboard navigation, screen reader support, high contrast, and proper ARIA labels.

**Q: How do you handle mobile users?**
A: The interface is fully responsive with touch-friendly controls, and the terminal works great on mobile keyboards.

### Architecture Questions
**Q: How do you scale this application?**
A: The backend can be horizontally scaled with Redis for session management, and we use connection pooling and efficient database queries.

**Q: What's your testing strategy?**
A: We have unit tests, integration tests, and E2E tests with 90%+ coverage, plus performance and security testing.

**Q: How do you deploy and monitor?**
A: We use GitHub Actions for CI/CD, deploy to Render.com and GitHub Pages, with comprehensive logging and monitoring.

## Demo Troubleshooting

### Common Issues
1. **WebSocket Connection Fails**: Check network, try refreshing
2. **Commands Don't Work**: Verify you're in a room, check syntax
3. **Real-time Updates Missing**: Check browser console for errors
4. **Mobile Issues**: Ensure responsive design is working

### Backup Plans
1. **Screenshots**: Have key screenshots ready
2. **Video**: Pre-recorded demo video as backup
3. **Code Walkthrough**: Show code if live demo fails
4. **Static Demo**: Show static screenshots of features

### Recovery Steps
1. **Refresh Page**: Try refreshing if issues occur
2. **Check Console**: Look for JavaScript errors
3. **Network Check**: Verify internet connection
4. **Fallback Demo**: Use pre-recorded video if needed
