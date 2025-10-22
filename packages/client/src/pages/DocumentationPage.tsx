import React from 'react';
import { Card } from '../components/ui';

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white">Game Development Documentation</h1>
          <p className="text-xl text-white text-opacity-80 max-w-3xl">
            Complete guide for creating simulation games using JSON configuration files.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card variant="elevated" padding="lg">
              <h2 className="text-3xl font-semibold mb-6 text-white">Getting Started</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Basic Game Structure</h3>
                  <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-white border-opacity-20">
                    <pre className="text-sm text-white text-opacity-80 overflow-x-auto">
{`{
  "meta": {
    "name": "My Game",
    "version": "1.0.0",
    "description": "A simulation game",
    "author": "Your Name"
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
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Required Sections</h3>
                  <ul className="space-y-2 text-white text-opacity-70">
                    <li><strong>meta</strong> - Game metadata (name, version, description, author)</li>
                    <li><strong>vars</strong> - Game variables with min/max/value</li>
                    <li><strong>actions</strong> - Player actions and their effects</li>
                    <li><strong>rules</strong> - Game rules and conditions</li>
                    <li><strong>random_events</strong> - Random events and triggers</li>
                  </ul>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h2 className="text-3xl font-semibold mb-6 text-white">Multi-Panel UI System</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Widget Types</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-white text-opacity-70">
                        <strong>bar</strong> - Progress bars and gauges
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>schematic</strong> - ASCII/Unicode diagrams
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>log</strong> - Event and command logs
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-white text-opacity-70">
                        <strong>checklist</strong> - Task lists and checkboxes
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>terminal</strong> - Interactive command line
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>grid</strong> - Data grids and tables
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Panel Layout Example</h3>
                  <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-white border-opacity-20">
                    <pre className="text-sm text-white text-opacity-80 overflow-x-auto">
{`{
  "ui": {
    "layout": {
      "type": "grid",
      "gridSize": 12,
      "maxPanels": 8
    },
    "panels": [
      {
        "id": "overview",
        "title": "⚛ CORE STATUS",
        "layout": { "x": 0, "y": 0, "w": 6, "h": 8 },
        "widgets": [
          { "type": "bar", "var": "power", "label": "Power" },
          { "type": "bar", "var": "temperature", "label": "Temp" }
        ]
      },
      {
        "id": "coolant",
        "title": "🌊 COOLANT FLOW",
        "layout": { "x": 6, "y": 0, "w": 6, "h": 8 },
        "widgets": [
          { "type": "schematic", "id": "coolant_flow" }
        ]
      }
    ]
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h2 className="text-3xl font-semibold mb-6 text-white">Actions and Effects</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Available Effect Types</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-white text-opacity-70">
                        <strong>modify_var</strong> - Change variable values
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>set_var</strong> - Set variable to specific value
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>update_score</strong> - Update player scores
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>add_log</strong> - Add messages to game log
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-white text-opacity-70">
                        <strong>trigger_event</strong> - Trigger random events
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>set_status</strong> - Set player status
                      </div>
                      <div className="text-white text-opacity-70">
                        <strong>message</strong> - Send messages to players
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Example Action</h3>
                  <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-white border-opacity-20">
                    <pre className="text-sm text-white text-opacity-80 overflow-x-auto">
{`{
  "name": "Increase Power",
  "description": "Increase power output by 10",
  "effects": [
    {
      "type": "modify_var",
      "target": "power",
      "operation": "add",
      "value": 10
    },
    {
      "type": "add_log",
      "message": "Power increased by 10"
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h2 className="text-3xl font-semibold mb-6 text-white">Rules and Conditions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Rule Triggers</h3>
                  <ul className="space-y-1 text-white text-opacity-70">
                    <li><strong>tick</strong> - Checked every game tick</li>
                    <li><strong>action</strong> - Triggered after player actions</li>
                    <li><strong>event</strong> - Triggered by random events</li>
                    <li><strong>condition</strong> - Manual condition checking</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Example Rule</h3>
                  <div className="bg-black bg-opacity-50 p-4 rounded-lg border border-white border-opacity-20">
                    <pre className="text-sm text-white text-opacity-80 overflow-x-auto">
{`{
  "trigger": "tick",
  "condition": "power > 90",
  "frequency": 1,
  "effects": [
    {
      "type": "add_log",
      "message": "Warning: Power levels critical!"
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">ASCII/Unicode Visualization</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-white">Reactor Symbols:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    ⚛ Core, ⚡ Active, ☢ Critical
                  </div>
                </div>
                <div>
                  <strong className="text-white">Flow Symbols:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    ─ │ ┘ ├ ┼ (pipes)
                  </div>
                </div>
                <div>
                  <strong className="text-white">Status Indicators:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    ● Good, ▲ Warning, ✕ Error, ⚠ Critical
                  </div>
                </div>
                <div>
                  <strong className="text-white">Progress Bars:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    [████████░░] 80%
                  </div>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Quick Reference</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-white">Variable Operations:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    add, subtract, multiply, divide, set
                  </div>
                </div>
                <div>
                  <strong className="text-white">Conditions:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    &gt;, &lt;, &gt;=, &lt;=, ==, !=
                  </div>
                </div>
                <div>
                  <strong className="text-white">Player Roles:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    Chief, Engineer, Technician, Observer
                  </div>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Best Practices</h3>
              <ul className="space-y-2 text-sm text-white text-opacity-70">
                <li>• Use descriptive variable names</li>
                <li>• Set appropriate min/max values</li>
                <li>• Add helpful log messages</li>
                <li>• Test with different player roles</li>
                <li>• Use random events sparingly</li>
                <li>• Validate your JSON syntax</li>
              </ul>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">ReactorSim Example</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-white">Overview Panel:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    Bar widgets for power, temperature, pressure, radiation
                  </div>
                </div>
                <div>
                  <strong className="text-white">Coolant Panel:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    Schematic widget showing pump network and flow
                  </div>
                </div>
                <div>
                  <strong className="text-white">Events Panel:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    Log widget with system alerts and warnings
                  </div>
                </div>
                <div>
                  <strong className="text-white">Players Panel:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    Grid widget showing online players and roles
                  </div>
                </div>
                <div>
                  <strong className="text-white">Terminal Panel:</strong>
                  <div className="text-white text-opacity-70 mt-1">
                    Interactive command line for game actions
                  </div>
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Examples</h3>
              <div className="space-y-2">
                <a href="/library" className="block text-white text-opacity-70 hover:text-white">
                  → ReactorSim Game
                </a>
                <a href="/sandbox" className="block text-white text-opacity-70 hover:text-white">
                  → Try Dev Sandbox
                </a>
                <a href="/help" className="block text-white text-opacity-70 hover:text-white">
                  → General Help
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
