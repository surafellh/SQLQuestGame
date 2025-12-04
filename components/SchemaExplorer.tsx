import React, { useState } from 'react';
import { Dataset } from '../types';
import { ChevronRight, ChevronDown, Table, Columns } from 'lucide-react';

interface SchemaExplorerProps {
  dataset: Dataset;
  onInsertText: (text: string) => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({ dataset, onInsertText }) => {
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(
    dataset.tables.reduce((acc, t) => ({ ...acc, [t.name]: true }), {})
  );

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  return (
    <div className="h-full bg-quest-800 border-r border-quest-700 flex flex-col">
      <div className="p-4 border-b border-quest-700 bg-quest-900">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Schema Explorer
        </h2>
        <div className="mt-2 text-white font-bold flex items-center gap-2">
          {dataset.name}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {dataset.tables.map(table => (
          <div key={table.name} className="mb-4">
            <div 
              className="flex items-center gap-2 p-2 hover:bg-quest-700 rounded cursor-pointer text-blue-300 font-medium transition-colors"
              onClick={() => toggleTable(table.name)}
            >
              {expandedTables[table.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Table size={16} />
              <span 
                draggable 
                onDragStart={(e) => e.dataTransfer.setData("text/plain", table.name)}
                onClick={(e) => { e.stopPropagation(); onInsertText(table.name); }}
              >
                {table.name}
              </span>
            </div>

            {expandedTables[table.name] && (
              <div className="ml-6 mt-1 space-y-1">
                {table.columns.map(col => (
                  <div 
                    key={col.name} 
                    className="flex items-center justify-between group p-1.5 hover:bg-quest-700 rounded cursor-pointer text-sm text-gray-400"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", col.name)}
                    onClick={() => onInsertText(col.name)}
                  >
                    <div className="flex items-center gap-2">
                      <Columns size={14} className="text-quest-500 group-hover:text-quest-300" />
                      <span className="group-hover:text-white transition-colors">{col.name}</span>
                    </div>
                    <span className="text-xs text-quest-600 font-mono">{col.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
