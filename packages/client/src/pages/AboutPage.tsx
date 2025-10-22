import React from 'react';
import { Card } from '../components/ui';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">About TermRooms</h1>
          <p className="text-xl text-white text-opacity-80 max-w-3xl mx-auto">
            A platform for creating, sharing, and playing terminal-based simulation games in real-time multiplayer rooms.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">What is TermRooms?</h3>
            <p className="text-white text-opacity-70 leading-relaxed mb-4">
              TermRooms is a game creation platform that allows anyone to build simulation games 
              using simple JSON configuration files. No programming knowledge required.
            </p>
            <p className="text-white text-opacity-70 leading-relaxed">
              Games are played in real-time multiplayer rooms with terminal-style interfaces, 
              perfect for collaborative problem-solving and team-based simulations.
            </p>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Key Features</h3>
            <ul className="space-y-3 text-white text-opacity-70">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                JSON-based game development
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Real-time multiplayer collaboration
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Terminal-style interface
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Game library and sharing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Multi-panel UI system
              </li>
            </ul>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">How It Works</h3>
            <div className="space-y-4 text-white text-opacity-70">
              <div>
                <strong>1. Create Games:</strong> Use the Dev Sandbox to build games with JSON configuration files
              </div>
              <div>
                <strong>2. Publish Games:</strong> Share your games publicly or keep them private
              </div>
              <div>
                <strong>3. Play Together:</strong> Create multiplayer rooms and collaborate in real-time
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Technology Stack</h3>
            <div className="space-y-3 text-white text-opacity-70">
              <p>
                <strong>Frontend:</strong> React, TypeScript, TailwindCSS
              </p>
              <p>
                <strong>Backend:</strong> Node.js, Express, Socket.IO
              </p>
              <p>
                <strong>Database:</strong> PostgreSQL, Prisma
              </p>
              <p>
                <strong>Real-time:</strong> WebSocket connections
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;