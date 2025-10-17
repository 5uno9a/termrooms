# TermRooms - Executive Summary

## Project Overview

TermRooms is a web-based platform that combines collaborative terminal rooms with real-time multiplayer simulations. Users create and join rooms using slash commands (`/create`, `/join`, `/passwd`, `/who`, `/msg`) and can run interactive simulations like ReactorSim—a nuclear reactor management game. The platform features a JSON-based game engine for creating and sharing terminal-based simulations, with a dev sandbox for building custom games.

## Interactive Elements

This project satisfies the course requirement for interactivity by enabling users to:
- Create and manage simulation rooms with optional password protection
- Join multiplayer games and simulations in real-time
- Collaborate on complex systems through terminal commands
- Build and share custom games using the dev sandbox
- Exchange real-time messages and coordinate actions
- Experience hands-on systems thinking through interactive simulations

## Technical Approach

The platform emphasizes practical learning outcomes for real-time web applications using modern technologies: React + Vite + TypeScript + Tailwind on the client; Node/Express with Socket.IO for WebSocket messaging; JWT (httpOnly cookies) for session security; Prisma with SQLite (development) and Postgres (production) for persistence; and CI/CD via GitHub with deploys to GitHub Pages (frontend) and Render (backend).

## Accessibility & Security

Accessibility and mobile responsiveness are first-class concerns: keyboard-only navigation, ARIA live regions for updates, and high-contrast, resizable monospace UI are built-in. Security includes rate limiting, hashed room passwords, role-based access checks, and minimal data collection (alias only).

## Learning Outcomes

By project completion, the team demonstrates a fully hosted, real-time application with a clean API, comprehensive test coverage (Vitest/Playwright), and a clear demo script. The project showcases modern web development practices including real-time communication, authentication, database design, and user experience principles.

**Word count: 285**
