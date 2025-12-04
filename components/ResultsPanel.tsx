

import React from 'react';
import { QueryResult, Challenge } from '../types';
import { Clock, Database, CheckCircle, XCircle, Trophy, Lightbulb, ArrowRight, BookOpen, Activity } from 'lucide-react';

interface ResultsPanelProps {
  result: QueryResult | null;
  challenge: Challenge | null;
  validationMessage?: string;
  passed?: boolean;
  explanation?: string;
  onNextChallenge: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  result, 
  challenge, 
  validationMessage, 
  passed, 
  explanation,
  onNextChallenge
}) => {
  
  // State 1: Thinking / Planning Mode (No result yet)
  if (!result) {
    return (
      <div className="h-full flex flex-col bg-quest-900">
        <div className="p-3 border-b border-quest-700 bg-quest-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Thought Process
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="bg-quest-800/50 rounded-lg p-6 border border-quest-700 text-center mb-8">
            <Database size={48} className="mx-auto mb-4 text-quest-500 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">Ready to Query</h3>
            <p className="text-sm text-gray-400">
              Build your query in the composer and hit Run.
            </p>
          </div>

          {challenge && (
            <div className="space-y-6">
                <div>
                    <h4 className="flex items-center gap-2 text-quest-accent font-bold mb-3">
                        <Lightbulb size={18} />
                        How to approach this:
                    </h4>
                    <div className="space-y-3">
                        {challenge.hints.map((hint, idx) => (
                            <div key={idx} className="flex gap-3 text-sm text-gray-300 bg-quest-800 p-3 rounded border-l-2 border-quest-600">
                                <span className="font-mono text-quest-500 font-bold">{idx + 1}.</span>
                                <p>{hint}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-blue-900/10 p-4 rounded border border-blue-500/20">
                    <h4 className="text-blue-400 font-bold text-sm mb-2">Goal</h4>
                    <p className="text-sm text-gray-300 italic">
                        "{challenge.description}"
                    </p>
                </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // State 2: Results Display
  return (
    <div className="h-full flex flex-col bg-quest-900 overflow-hidden">
      {/* Metrics Header - Kept for quick summary at top */}
      <div className="p-3 bg-quest-800 border-b border-quest-700 flex items-center gap-6 text-xs text-quest-400 shrink-0">
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>{result.durationMs}ms</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database size={14} />
          <span>{(result.bytesProcessed / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>

      {/* Validation Banner */}
      {challenge && passed !== undefined && (
        <div className={`p-4 border-b border-quest-700 flex flex-col gap-3 shrink-0 ${passed ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 p-1 rounded-full ${passed ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {passed ? <Trophy size={20} /> : <XCircle size={20} />}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className={`font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                        {passed ? 'Challenge Completed!' : 'Try Again'}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">{validationMessage}</p>
                    </div>
                    {passed && (
                        <button 
                            onClick={onNextChallenge}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 shadow-lg transition-colors animate-pulse hover:animate-none"
                        >
                            Next Challenge <ArrowRight size={16} />
                        </button>
                    )}
                </div>
                
                {explanation && (
                     <div className="mt-3 text-sm bg-quest-900/50 p-3 rounded border border-quest-700/50 text-gray-300">
                        <div className="flex items-center gap-2 text-quest-400 font-bold mb-1 text-xs uppercase tracking-wide">
                            <BookOpen size={12} /> Analysis
                        </div>
                        {explanation}
                     </div>
                )}

                {passed && (
                    <div className="mt-2 text-xs font-mono text-quest-400">
                        + {challenge.points} XP Earned
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {result.error && (
        <div className="p-6 flex-1 overflow-auto custom-scrollbar">
            <div className="bg-red-900/20 border border-red-500/30 rounded p-4 flex gap-3 text-red-200">
                <XCircle className="shrink-0 text-red-500" />
                <div className="font-mono text-sm break-all">
                    {result.error}
                </div>
            </div>
        </div>
      )}

      {/* Data Table */}
      {!result.error && result.rows.length > 0 && (
        <div className="flex-1 overflow-auto bg-quest-900 relative custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[max-content]">
            <thead className="sticky top-0 bg-quest-800 z-10 shadow-sm">
              <tr>
                {result.columns.map((col, i) => (
                  <th key={i} className="px-4 py-2 text-xs font-semibold text-quest-300 border-b border-quest-600 whitespace-nowrap bg-quest-800">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} className="hover:bg-quest-800/50 group border-b border-quest-800">
                  {result.columns.map((col, j) => (
                    <td key={j} className="px-4 py-2 text-sm text-gray-300 font-mono whitespace-nowrap overflow-hidden max-w-[300px] text-ellipsis">
                      {row[col] !== null ? String(row[col]) : <span className="text-quest-600 italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

       {!result.error && result.rows.length === 0 && (
          <div className="flex-1 p-8 text-center text-gray-500">
              No results returned from query.
          </div>
       )}

      {/* MySQL-style Footer Status Bar */}
      <div className="bg-quest-800 border-t border-quest-700 p-1.5 px-3 flex items-center justify-between text-[11px] text-gray-400 font-mono shrink-0 select-none z-20 shadow-md">
          <div className="flex items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5 font-medium">
                 <div className={`w-2 h-2 rounded-full ${result.error ? 'bg-red-500' : 'bg-green-500'}`}></div>
                 {result.error ? 'Query Failed' : 'Success'}
              </span>
              
              {!result.error && (
                <>
                  <div className="flex items-center gap-1.5 border-l border-quest-600 pl-4">
                      <span className="text-quest-500">Rows:</span> 
                      <span className="text-gray-200">
                        {result.rows.length === result.totalRowCount 
                            ? result.rows.length 
                            : `Showing ${result.rows.length} of ${result.totalRowCount.toLocaleString()}`}
                      </span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-quest-600 pl-4">
                      <span className="text-quest-500">Duration:</span> 
                      <span className="text-gray-200">{(result.durationMs / 1000).toFixed(3)} sec</span>
                  </div>
                   <div className="hidden md:flex items-center gap-1.5 border-l border-quest-600 pl-4">
                      <span className="text-quest-500">Scanned:</span> 
                      <span className="text-gray-200">{(result.bytesProcessed / 1024).toFixed(1)} KB</span>
                  </div>
                </>
              )}
          </div>
          <div className="hidden sm:flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-quest-500">
                 <Activity size={10} />
                 BigQuery Engine
              </span>
          </div>
      </div>
    </div>
  );
};