import React from 'react';

const DevSandboxPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Dev Sandbox</h1>
          <p className="text-gray-300">
            Create and test your own simulation games using JSON configuration.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">JSON Editor</h3>
            <div className="bg-gray-900 p-4 rounded border">
              <pre className="text-sm text-gray-300">
{`{
  "meta": {
    "name": "My Game",
    "version": "1.0.0",
    "description": "A simulation game",
    "author": "You"
  },
  "vars": {
    "power": {
      "min": 0,
      "max": 100,
      "value": 50
    }
  }
}`}
              </pre>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Monaco Editor will be integrated here for JSON editing.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Game Preview</h3>
            <div className="bg-gray-900 p-4 rounded border h-64 flex items-center justify-center">
              <p className="text-gray-400">Game preview will appear here</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Test Game
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Save Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevSandboxPage;
