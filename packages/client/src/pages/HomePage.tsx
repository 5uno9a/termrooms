import React from 'react';
import { Button, Card } from '../components/ui';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-white tracking-tight">
            TermRooms Game Platform
          </h1>
          <p className="text-xl text-white text-opacity-80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create, share, and play terminal-based simulation games in real-time multiplayer rooms.
          </p>
          
          <div className="flex justify-center space-x-6 mb-16">
            <Button variant="primary" size="lg">
              Start Creating
            </Button>
            <Button variant="secondary" size="lg">
              Browse Games
            </Button>
          </div>
          
          <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20 max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Create Games</h3>
                <p className="text-sm text-white text-opacity-70">
                  Use the Dev Sandbox to build simulation games with JSON configuration files
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Publish to Library</h3>
                <p className="text-sm text-white text-opacity-70">
                  Publish your games as public (for everyone) or private (just for you)
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Play Together</h3>
                <p className="text-sm text-white text-opacity-70">
                  Create multiplayer instances and collaborate in real-time terminal interfaces
                </p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Create Games</h3>
              <p className="text-white text-opacity-70 leading-relaxed">
                Build simulation games using JSON configuration files in our dev sandbox.
              </p>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Play Together</h3>
              <p className="text-white text-opacity-70 leading-relaxed">
                Join multiplayer rooms and collaborate with other players in real-time.
              </p>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Discover Games</h3>
              <p className="text-white text-opacity-70 leading-relaxed">
                Browse and play games created by the community in our game library.
              </p>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
