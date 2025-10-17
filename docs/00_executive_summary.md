# TermRooms - Executive Summary

## Project Overview

TermRooms is a lightweight, web-based platform that enables users to create and join collaborative "terminal rooms" directly in their browser—no native client required. Inspired by the immediacy of command-line workflows, TermRooms transforms simple slash-commands into interactive room management: `/create`, `/join`, `/passwd`, `/who`, `/msg`, and more. Each room presents a split view with a terminal-style command input/output pane, a live participant list, and a minimal message stream.

## Interactive Elements

This project satisfies the course requirement for interactivity by enabling authenticated or guest users to:
- Create and manage rooms with optional password protection
- Join/leave rooms through terminal commands
- Exchange real-time messages within rooms
- Set room topics and manage participant permissions
- Bookmark favorite rooms for quick access
- View audit logs of room activities

## Technical Approach

The platform emphasizes practical learning outcomes for real-time web applications using modern technologies: React + Vite + TypeScript + Tailwind on the client; Node/Express with Socket.IO for WebSocket messaging; JWT (httpOnly cookies) for session security; Prisma with SQLite (development) and Postgres (production) for persistence; and CI/CD via GitHub with deploys to GitHub Pages (frontend) and Render (backend).

## Accessibility & Security

Accessibility and mobile responsiveness are first-class concerns: keyboard-only navigation, ARIA live regions for updates, and high-contrast, resizable monospace UI are built-in. Security includes rate limiting, hashed room passwords, role-based access checks, and minimal data collection (alias only).

## Learning Outcomes

By project completion, the team demonstrates a fully hosted, real-time application with a clean API, comprehensive test coverage (Vitest/Playwright), and a clear demo script. The project showcases modern web development practices including real-time communication, authentication, database design, and user experience principles.

**Word count: 285**
