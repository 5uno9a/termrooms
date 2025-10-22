import React from 'react';
import { Card } from '../components/ui';

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white">Help & Documentation</h1>
          <p className="text-xl text-white text-opacity-80 max-w-3xl">
            Learn how to use TermRooms and create amazing simulation games.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Getting Started</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Creating Your First Game</h4>
                <p className="text-white text-opacity-70">
                  Use the Dev Sandbox to create games using JSON configuration files. 
                  Start with simple variables and gradually add complexity.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Joining Multiplayer Rooms</h4>
                <p className="text-white text-opacity-70">
                  Browse the Game Library to find games, then create or join rooms 
                  to play with other users in real-time.
                </p>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Keyboard Shortcuts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white text-opacity-70">Open Command Terminal</span>
                <kbd className="px-2 py-1 bg-white bg-opacity-10 rounded text-sm">Ctrl + T</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-white text-opacity-70">Toggle Fullscreen</span>
                <kbd className="px-2 py-1 bg-white bg-opacity-10 rounded text-sm">F11</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-white text-opacity-70">Quick Save</span>
                <kbd className="px-2 py-1 bg-white bg-opacity-10 rounded text-sm">Ctrl + S</kbd>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Game Development</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">JSON Structure</h4>
                <p className="text-white text-opacity-70">
                  Games are defined using JSON with sections for variables, actions, 
                  rules, and events. Each game must have a unique name and version.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Validation</h4>
                <p className="text-white text-opacity-70">
                  The system validates your game configuration before allowing 
                  it to be played or shared with others.
                </p>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <h3 className="text-2xl font-semibold mb-6 text-white">Troubleshooting</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Connection Issues</h4>
                <p className="text-white text-opacity-70">
                  If you can't connect to rooms, check your internet connection 
                  and try refreshing the page.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Game Errors</h4>
                <p className="text-white text-opacity-70">
                  Game validation errors are shown in the Dev Sandbox. 
                  Check the error messages for specific issues.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
