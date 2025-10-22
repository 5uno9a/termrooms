import React from 'react';
import { Button, Card } from '../components/ui';

const DevSandboxPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white">Dev Sandbox</h1>
          <p className="text-xl text-white text-opacity-80 max-w-3xl">
            Create and test your own simulation games using JSON configuration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* JSON Editor - Takes up 2 columns on extra large screens */}
          <div className="xl:col-span-2">
            <Card variant="elevated" padding="lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">JSON Editor</h3>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Load Template
                  </Button>
                  <Button variant="secondary" size="sm">
                    Format JSON
                  </Button>
                  <Button variant="secondary" size="sm">
                    Add Schematic
                  </Button>
                </div>
              </div>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20 min-h-[400px]">
                <pre className="text-sm text-white text-opacity-80 leading-relaxed overflow-x-auto">
{`{
  "meta": {
    "name": "Nuclear Reactor Simulator",
    "version": "1.0.0",
    "description": "Manage a nuclear reactor and prevent meltdowns",
    "author": "Your Name"
  },
  "vars": {
    "power": { "min": 0, "max": 100, "value": 50 },
    "temperature": { "min": 0, "max": 1000, "value": 300 },
    "coolant": { "min": 0, "max": 100, "value": 80 }
  },
  "ui": {
    "layout": { "type": "grid", "gridSize": 12, "maxPanels": 8 },
    "panels": [
      {
        "id": "core_status",
        "title": "⚛ CORE STATUS",
        "layout": { "x": 0, "y": 0, "w": 6, "h": 4 },
        "widgets": [
          { "type": "bar", "var": "power", "label": "Power" },
          { "type": "bar", "var": "temperature", "label": "Temp" }
        ]
      },
      {
        "id": "coolant_flow",
        "title": "🌊 COOLANT FLOW",
        "layout": { "x": 6, "y": 0, "w": 6, "h": 4 },
        "widgets": [
          { "type": "schematic", "id": "coolant_system" }
        ]
      }
    ]
  },
  "schematics": {
    "coolant_system": {
      "template": "┌─ Pump 1 ┐\\n│    ●     │\\n└─┬─┬─┬─┬─┘\\n  │ │ │ │\\n  ▼ ▼ ▼ ▼\\n┌─┬─┬─┬─┬─┐\\n│●│●│●│●│●│ Core\\n└─┴─┴─┴─┴─┘\\n  ▲ ▲ ▲ ▲\\n  │ │ │ │\\n┌─┴─┴─┴─┴─┐\\n│    ●     │\\n└─ Pump 2 ┘",
      "bindings": {
        "pump1": "coolant > 50 ? '●' : '○'",
        "pump2": "coolant > 70 ? '●' : '○'"
      }
    }
  },
  "actions": [
    {
      "name": "Increase Power",
      "description": "Increase reactor power output",
      "effects": [
        { "type": "modify_var", "target": "power", "operation": "add", "value": 10 }
      ]
    }
  ]
}`}
                </pre>
              </div>
              <p className="text-sm text-white text-opacity-60 mt-4">
                Monaco Editor will be integrated here for advanced JSON editing with syntax highlighting and validation.
              </p>
              
              {/* Schematic Editor */}
              <div className="mt-6 p-4 bg-black bg-opacity-30 rounded-lg border border-white border-opacity-10">
                <h4 className="text-lg font-semibold text-white mb-3">🎨 Schematic Editor</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-white text-opacity-70 mb-2">Schematic Name:</label>
                    <input 
                      type="text" 
                      placeholder="coolant_system" 
                      className="w-full px-3 py-2 bg-black bg-opacity-50 border border-white border-opacity-20 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white text-opacity-70 mb-2">ASCII Template:</label>
                    <textarea 
                      placeholder="┌─ Pump ─┐&#10;│   ●    │&#10;└─┬─┬─┬─┘&#10;  ▼ ▼ ▼&#10;┌─┬─┬─┬─┐&#10;│●│●│●│●│ Core&#10;└─┴─┴─┴─┘"
                      rows={6}
                      className="w-full px-3 py-2 bg-black bg-opacity-50 border border-white border-opacity-20 rounded text-white text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white text-opacity-70 mb-2">Variable Bindings:</label>
                    <textarea 
                      placeholder="pump1: coolant > 50 ? '●' : '○'&#10;pump2: coolant > 70 ? '●' : '○'"
                      rows={3}
                      className="w-full px-3 py-2 bg-black bg-opacity-50 border border-white border-opacity-20 rounded text-white text-sm font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      Preview Schematic
                    </Button>
                    <Button variant="secondary" size="sm">
                      Add to JSON
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Sidebar with controls and preview */}
          <div className="space-y-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Game Controls</h3>
              <div className="space-y-3">
                <Button variant="primary" size="md" className="w-full">
                  Test Game
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Save Game
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Export JSON
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Validate
                </Button>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Game Preview</h3>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20 min-h-[200px]">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-white">⚛ CORE STATUS</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Power:</span>
                      <span className="text-white">[████████░░] 80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Temperature:</span>
                      <span className="text-white">[██████░░░░] 60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Coolant:</span>
                      <span className="text-white">[████████░░] 80%</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-white text-opacity-70 mt-3">
                    <div>┌─ Pump 1 ─┐</div>
                    <div>│    ●     │</div>
                    <div>└─┬─┬─┬─┬─┘</div>
                    <div>  │ │ │ │</div>
                    <div>  ▼ ▼ ▼ ▼</div>
                    <div>┌─┬─┬─┬─┬─┐</div>
                    <div>│●│●│●│●│●│ Core</div>
                    <div>└─┴─┴─┴─┴─┘</div>
                    <div>  ▲ ▲ ▲ ▲</div>
                    <div>  │ │ │ │</div>
                    <div>┌─┴─┴─┴─┴─┐</div>
                    <div>│    ●     │</div>
                    <div>└─ Pump 2 ─┘</div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Publish to Game Library</h3>
              <div className="space-y-3">
                <Button variant="primary" size="md" className="w-full">
                  Publish Public
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Publish Private
                </Button>
                <div className="text-xs text-white text-opacity-60">
                  <p><strong>Public:</strong> Available in Game Library for everyone</p>
                  <p><strong>Private:</strong> Only you can create instances</p>
                </div>
                <div className="text-xs text-white text-opacity-50 mt-2">
                  After publishing, go to Game Room to create multiplayer instances
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevSandboxPage;
