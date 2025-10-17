# 02 — User Stories

## Creator Stories
- **As a creator**, I want to `/create` a room so that others can join quickly
- **As a creator**, I want to set `/passwd` so only invited users can enter
- **As a creator**, I want to set a `/topic` so newcomers know the room purpose
- **As a creator**, I want to view an audit log to see who joined/left and what commands were run

## Participant Stories
- **As a participant**, I want to `/join {room}` and see who's present with `/who`
- **As a participant**, I want to send inline messages with `/msg` so I can collaborate
- **As a participant**, I want to `/leave` gracefully so presence updates are accurate
- **As a participant**, I want to bookmark rooms so I can rejoin in one click

## Accessibility Stories
- **As a keyboard user**, I want to navigate all features using only the keyboard
- **As a screen reader user**, I want live regions to announce real-time updates
- **As a mobile user**, I want responsive panels so the terminal remains readable
- **As a user with visual impairments**, I want high contrast and resizable text

## Instructor/Admin Stories
- **As an instructor**, I want an audit log to verify activity (joins/leaves/commands)
- **As an instructor**, I want to see real-time presence to monitor engagement
- **As an admin**, I want rate limiting to prevent abuse
- **As an admin**, I want minimal data collection for privacy compliance

## Guest User Stories
- **As a guest**, I want to create an alias without registration
- **As a guest**, I want to join public rooms immediately
- **As a guest**, I want to bookmark rooms for later access
