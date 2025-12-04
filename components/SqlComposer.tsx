
import React, { useState, useRef, useEffect } from 'react';
import { Play, Loader2, AlertTriangle, ChevronRight, ChevronDown, Wrench, X } from 'lucide-react';

interface SqlComposerProps {
  initialQuery: string;
  onRun: (query: string) => void;
  isRunning: boolean;
  insertTrigger: number;
  insertText: string | null;
  costEstimate: number | null;
  externalQueryUpdate?: { text: string; timestamp: number } | null;
}

const SQL_CATEGORIES: Record<string, string[]> = {
  "Data Ops": ["SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "INSERT", "UPDATE", "DELETE"],
  "Structure": ["CREATE", "ALTER", "DROP", "TRUNCATE"],
  "Joins": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "SELF JOIN", "NATURAL JOIN"],
  "Subqueries": ["IN", "ANY", "ALL", "UNION", "INTERSECT", "EXCEPT"],
  "Functions": ["COUNT()", "SUM()", "AVG()", "MIN()", "MAX()", "CONCAT()", "SUBSTRING()", "LENGTH()", "UPPER()", "LOWER()", "TRIM()", "LEFT()", "RIGHT()", "REPLACE()", "CURRENT_DATE()", "DATE_PART()", "DATE_ADD()", "DATE_SUB()", "EXTRACT()", "TO_CHAR()", "TIMESTAMPDIFF()", "DATEDIFF()"],
  "Conditional": ["CASE", "IF()", "COALESCE()", "NULLIF()"],
  "Transactions": ["COMMIT", "ROLLBACK", "SAVEPOINT", "SET TRANSACTION"]
};

// Simple Syntax Highlighter Logic
const highlightSQL = (text: string) => {
  if (!text) return null;

  // Regex patterns
  const keywords = /\b(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN|ON|AS|DISTINCT|AND|OR|NOT|NULL|IS|IN|VALUES|SET|TOP)\b/gi;
  const functions = /\b(COUNT|SUM|AVG|MIN|MAX|CONCAT|SUBSTRING|LENGTH|UPPER|LOWER|TRIM|LEFT|RIGHT|REPLACE|CURRENT_DATE|DATE_PART|EXTRACT|TO_CHAR|COALESCE|NULLIF|CASE|WHEN|THEN|ELSE|END)\b/gi;
  const strings = /'[^']*'/g;
  const numbers = /\b\d+\b/g;

  // Split by tokens and map
  const parts = text.split(/(\s+|[(),;])/g);
  
  return parts.map((part, i) => {
    if (keywords.test(part)) return <span key={i} className="text-blue-400 font-bold">{part}</span>;
    if (functions.test(part)) return <span key={i} className="text-purple-400">{part}</span>;
    if (strings.test(part)) return <span key={i} className="text-green-400">{part}</span>;
    if (numbers.test(part)) return <span key={i} className="text-orange-400">{part}</span>;
    return <span key={i} className="text-gray-200">{part}</span>;
  });
};

export const SqlComposer: React.FC<SqlComposerProps> = ({ 
  initialQuery, 
  onRun, 
  isRunning, 
  insertTrigger, 
  insertText,
  costEstimate,
  externalQueryUpdate
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<string>("Data Ops");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ "Data Ops": true });
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // Sync scroll between textarea and highlight pre
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Helper to insert text at current cursor position
  const insertAtCursor = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newQuery = query.substring(0, start) + text + query.substring(end);
      setQuery(newQuery);
      
      // Restore focus and move cursor
      setTimeout(() => {
        if(textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start + text.length, start + text.length);
        }
      }, 0);
    } else {
      setQuery(prev => prev + text);
    }
    
    // Auto-close sidebar on mobile after insertion
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Handle updates from parent (Schema Explorer - Insert)
  useEffect(() => {
    if (insertText) {
      insertAtCursor(insertText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertTrigger]);

  // Handle overwrite updates from parent (Preview Table)
  useEffect(() => {
    if (externalQueryUpdate) {
        setQuery(externalQueryUpdate.text);
    }
  }, [externalQueryUpdate]);

  const toggleCategory = (cat: string) => {
      setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
      setActiveTab(cat);
  };

  return (
    <div className="h-full flex flex-col bg-quest-900 overflow-hidden relative">
      {/* Top Toolbar */}
      <div className="p-3 border-b border-quest-700 bg-quest-800 flex flex-wrap gap-2 justify-between items-center shrink-0 z-20">
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-1.5 rounded transition-colors ${isSidebarOpen ? 'bg-quest-600 text-white' : 'text-quest-400 hover:bg-quest-700 hover:text-white'}`}
                title="Toggle Function Tools"
            >
                <Wrench size={16} />
            </button>
            <h2 className="text-sm font-semibold text-gray-300 hidden sm:block">SQL Composer</h2>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Cost Indicator */}
             <div className="hidden sm:flex items-center gap-2 text-xs">
                {costEstimate !== null && (
                    <span className="text-quest-400">Est: ${costEstimate.toFixed(8)}</span>
                )}
                <span className="text-quest-500 flex items-center gap-1">
                    <AlertTriangle size={12} /> Dry Run
                </span>
            </div>

             {/* Run Button */}
            <button
            onClick={() => onRun(query)}
            disabled={isRunning || !query.trim()}
            className={`
                flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded font-semibold text-xs transition-all
                ${isRunning || !query.trim() 
                ? 'bg-quest-700 text-gray-500 cursor-not-allowed' 
                : 'bg-quest-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-900/50'}
            `}
            >
            {isRunning ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
            {isRunning ? 'Running...' : 'Run'}
            </button>
        </div>
      </div>

      {/* Main Content Area (Sidebar + Editor) */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Sidebar - Responsive Behavior */}
        <div className={`
            absolute lg:relative z-10 h-full bg-quest-800 border-r border-quest-700 overflow-y-auto flex flex-col shrink-0 custom-scrollbar transition-all duration-300
            ${isSidebarOpen ? 'w-56 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0'}
            shadow-xl lg:shadow-none
        `}>
            <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-quest-700 flex justify-between items-center sticky top-0 bg-quest-800">
                Functions
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
                    <X size={14} />
                </button>
            </div>
            <div className="flex-1 p-2 space-y-1">
                {Object.keys(SQL_CATEGORIES).map(cat => (
                    <div key={cat} className="rounded overflow-hidden">
                        <button 
                            onClick={() => toggleCategory(cat)}
                            className={`w-full text-left px-2 py-2 text-xs font-semibold flex items-center justify-between hover:bg-quest-700 rounded transition-colors ${activeTab === cat ? 'text-white bg-quest-700' : 'text-quest-400'}`}
                        >
                            {cat}
                            {expandedCategories[cat] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        
                        {expandedCategories[cat] && (
                            <div className="mt-1 ml-2 space-y-1 border-l border-quest-600 pl-2">
                                {SQL_CATEGORIES[cat].map(item => (
                                    <div
                                        key={item}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("text/plain", item.endsWith('()') ? item : item + ' ');
                                            e.dataTransfer.effectAllowed = "copy";
                                        }}
                                        onClick={() => insertAtCursor(item.endsWith('()') ? item : item + ' ')}
                                        className="
                                            text-xs font-mono text-quest-300 hover:text-white 
                                            cursor-pointer py-1 px-2 hover:bg-quest-600 rounded
                                            truncate
                                        "
                                        title={item}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {/* Editor Area with Syntax Highlighting Overlay */}
        <div className="flex-1 relative flex flex-col min-w-0 bg-quest-900 group">
            {/* The Highlight Layer (Behind) */}
            <pre 
                ref={highlightRef}
                className="absolute inset-0 p-4 m-0 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words pointer-events-none overflow-hidden"
                aria-hidden="true"
            >
                {highlightSQL(query)}
                <br /> 
            </pre>

            {/* Placeholder shim - Cleaned up rendering */}
             {!query && (
                <div className="absolute top-4 left-4 text-quest-500 font-mono text-sm pointer-events-none z-0 subpixel-antialiased select-none">
                    -- Drag tables or functions here...<br/>
                    SELECT * FROM...
                </div>
            )}

            {/* The Input Layer (Top, Transparent text, visible caret) */}
            <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                className="
                    absolute inset-0 w-full h-full p-4 m-0
                    bg-transparent text-transparent caret-white 
                    font-mono text-sm leading-relaxed 
                    resize-none focus:outline-none focus:ring-1 focus:ring-quest-600/50
                    whitespace-pre-wrap break-words
                    z-10
                "
            />
        </div>
      </div>
    </div>
  );
};
