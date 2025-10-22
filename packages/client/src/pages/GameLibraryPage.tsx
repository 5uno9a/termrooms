import React from 'react';
import { Button, Card } from '../components/ui';

const GameLibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white">Game Library</h1>
          <p className="text-xl text-white text-opacity-80 max-w-3xl">
            Discover and play games created by the community.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Public Games</h2>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                My Games
              </Button>
              <Button variant="secondary" size="sm">
                Create New
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">ReactorSim</h3>
              <p className="text-white text-opacity-70 mb-4 leading-relaxed">
                Nuclear reactor simulation game. Manage power output, coolant systems, and prevent meltdowns.
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-white text-opacity-50">By: System</span>
                <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Public</span>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="md" className="flex-1">
                  Create Instance
                </Button>
                <Button variant="secondary" size="md">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">CitySim</h3>
              <p className="text-white text-opacity-70 mb-4 leading-relaxed">
                City management simulation. Balance resources, manage traffic, and grow your city.
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-white text-opacity-50">By: Community</span>
                <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Public</span>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="md" className="flex-1">
                  Create Instance
                </Button>
                <Button variant="secondary" size="md">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
          
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-black bg-opacity-50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white border-opacity-20">
                <svg className="w-8 h-8 text-white text-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Create Your Game</h3>
              <p className="text-white text-opacity-70 mb-4 leading-relaxed">
                Use the Dev Sandbox to create and publish your own simulation games.
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-white text-opacity-50">Get Started</span>
                <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full font-medium">Template</span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="md" className="flex-1">
                  Go to Dev Sandbox
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameLibraryPage;
