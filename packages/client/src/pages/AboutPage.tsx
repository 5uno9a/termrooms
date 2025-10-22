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
            <h3 className="text-2xl font-semibold mb-6 text-white">Our Vision</h3>
            <p className="text-white text-opacity-70 leading-relaxed">
              TermRooms aims to democratize game development by making it accessible through 
              simple JSON configuration files. We believe that anyone should be able to create 
              engaging simulation games without complex programming knowledge.
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
                Drag-and-drop panel system
              </li>
            </ul>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Technology</h3>
            <div className="space-y-3 text-white text-opacity-70">
              <p><strong>Frontend:</strong> React, TypeScript, TailwindCSS</p>
              <p><strong>Backend:</strong> Node.js, Express, Socket.IO</p>
              <p><strong>Database:</strong> PostgreSQL, Prisma</p>
              <p><strong>Real-time:</strong> WebSocket connections</p>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Open Source</h3>
            <p className="text-white text-opacity-70 mb-4">
              TermRooms is built with open source technologies and follows 
              best practices for maintainability and extensibility.
            </p>
            <p className="text-white text-opacity-70">
              The project is designed to be community-driven, with contributions 
              welcome from developers and game creators.
            </p>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Contact</h3>
            <div className="space-y-3 text-white text-opacity-70">
              <p>For questions, suggestions, or contributions:</p>
              <p><strong>GitHub:</strong> termrooms/termrooms</p>
              <p><strong>Issues:</strong> Use GitHub Issues</p>
              <p><strong>Discussions:</strong> GitHub Discussions</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
