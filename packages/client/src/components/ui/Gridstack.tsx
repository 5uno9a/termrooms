import React, { useEffect, useRef } from 'react';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

export interface GamePanel {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  type: 'overview' | 'coolant' | 'events' | 'commands' | 'players' | 'terminal' | 'schematic';
  content: React.ReactNode;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface GameGridstackProps {
  panels: GamePanel[];
  onPanelChange?: (panels: GamePanel[]) => void;
  className?: string;
  readonly?: boolean;
}

const GameGridstack: React.FC<GameGridstackProps> = ({
  panels,
  onPanelChange,
  className = '',
  readonly = false
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridStackRef = useRef<GridStack | null>(null);

  useEffect(() => {
    if (gridRef.current && !gridStackRef.current) {
      gridStackRef.current = GridStack.init({
        cellHeight: 50,
        margin: 6,
        removable: false,
        acceptWidgets: false,
        animate: true,
        column: 12,
        minRow: 1,
        float: true,
        resizable: {
          handles: readonly ? undefined : 'e, se, s, sw, w'
        },
        draggable: {
          handle: readonly ? undefined : '.panel-header'
        }
      }, gridRef.current);

      // Add panels to grid
      panels.forEach(panel => {
        const element = document.createElement('div');
        element.className = 'grid-stack-item game-panel';
        element.setAttribute('gs-id', panel.id);
        element.setAttribute('gs-x', panel.x.toString());
        element.setAttribute('gs-y', panel.y.toString());
        element.setAttribute('gs-w', panel.w.toString());
        element.setAttribute('gs-h', panel.h.toString());
        
        if (panel.minW) element.setAttribute('gs-min-w', panel.minW.toString());
        if (panel.minH) element.setAttribute('gs-min-h', panel.minH.toString());
        if (panel.maxW) element.setAttribute('gs-max-w', panel.maxW.toString());
        if (panel.maxH) element.setAttribute('gs-max-h', panel.maxH.toString());
        
        const content = document.createElement('div');
        content.className = 'grid-stack-item-content';
        
        // Panel header
        const header = document.createElement('div');
        header.className = 'panel-header';
        header.innerHTML = `
          <div class="flex items-center justify-between">
            <h3 class="panel-title">${panel.title}</h3>
            <div class="panel-type-badge">${panel.type}</div>
          </div>
        `;
        
        // Panel content area
        const contentArea = document.createElement('div');
        contentArea.className = 'panel-content';
        contentArea.innerHTML = '<div class="panel-placeholder">Panel content will be rendered here</div>';
        
        content.appendChild(header);
        content.appendChild(contentArea);
        element.appendChild(content);
        
        gridStackRef.current?.addWidget(element);
      });

      // Listen for changes
      if (onPanelChange && !readonly) {
        gridStackRef.current.on('change', (_event, items) => {
          const updatedPanels = items.map((item: any) => {
            const originalPanel = panels.find(p => p.id === item.id || item.el?.getAttribute('gs-id'));
            if (!originalPanel) return null;
            return {
              ...originalPanel,
              id: item.id || item.el?.getAttribute('gs-id') || '',
              x: item.x || 0,
              y: item.y || 0,
              w: item.w || 1,
              h: item.h || 1
            };
          }).filter((panel): panel is GamePanel => panel !== null);
          onPanelChange(updatedPanels);
        });
      }
    }

    return () => {
      if (gridStackRef.current) {
        gridStackRef.current.destroy(false);
        gridStackRef.current = null;
      }
    };
  }, [panels, onPanelChange, readonly]);

  return (
    <div 
      ref={gridRef} 
      className={`game-gridstack ${className}`}
      style={{ minHeight: '500px' }}
    />
  );
};

export default GameGridstack;
