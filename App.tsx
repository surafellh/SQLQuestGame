
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Database, 
  Terminal, 
  Award, 
  History, 
  User, 
  LogOut, 
  Play, 
  BookOpen,
  Sparkles,
  ArrowLeft,
  Trophy,
  GripVertical,
  ShieldAlert,
  Settings,
  Flame,
  Zap,
  Map,
  ChevronRight,
  Menu,
  Table,
  Code,
  Layout
} from 'lucide-react';
import { DATASETS, DATASET_ICONS } from './constants';
import { SchemaExplorer } from './components/SchemaExplorer';
import { SqlComposer } from './components/SqlComposer';
import { ResultsPanel } from './components/ResultsPanel';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { SettingsPage } from './components/SettingsPage';
import { Dataset, Challenge, QueryResult, GameView, Difficulty, UserProfile } from './types';
import { generateChallenge, validateAndRunQuery } from './services/geminiService';
import { storageService } from './services/storageService';

// Hook to detect screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

const App = () => {
  // Load initial state from storage service
  const [usersDb, setUsersDb] = useState<UserProfile[]>(storageService.getUsers());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(storageService.getSessionUser(usersDb));
  const [view, setView] = useState<GameView>(currentUser ? GameView.HOME : GameView.AUTH);
  
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  // App State
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isQueryRunning, setIsQueryRunning] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | undefined>();
  const [passed, setPassed] = useState<boolean | undefined>();
  const [explanation, setExplanation] = useState<string | undefined>();
  
  // Editor interactions
  const [insertText, setInsertText] = useState<string | null>(null);
  const [insertTrigger, setInsertTrigger] = useState(0);

  // Challenge Loading
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Layout State for Resizable Panes
  const [leftPaneWidth, setLeftPaneWidth] = useState(250);
  const [rightPaneWidth, setRightPaneWidth] = useState(400);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Mobile Quest View State
  const [mobileTab, setMobileTab] = useState<'schema' | 'editor' | 'results'>('editor');

  // Persistence Effects
  useEffect(() => {
    storageService.saveUsers(usersDb);
  }, [usersDb]);

  useEffect(() => {
    storageService.setSessionUser(currentUser);
  }, [currentUser]);


  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setView(GameView.HOME);
  };

  const handleRegister = (newUser: UserProfile) => {
      setUsersDb(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setView(GameView.HOME);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView(GameView.AUTH);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
      setCurrentUser(updatedUser);
      setUsersDb(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteAccount = () => {
      if (currentUser) {
          setUsersDb(prev => prev.filter(u => u.id !== currentUser.id));
          handleLogout();
      }
  };

  const startQuest = async (dataset: Dataset, difficulty: Difficulty) => {
    setSelectedDataset(dataset);
    setLoadingChallenge(true);
    setView(GameView.QUEST);
    setMobileTab('editor'); // Reset to editor on start
    setQueryResult(null);
    setPassed(undefined);
    setValidationMsg(undefined);
    setExplanation(undefined);
    
    // Procedural Generation
    const challenge = await generateChallenge(dataset, difficulty);
    setCurrentChallenge(challenge);
    setLoadingChallenge(false);
  };

  const handleNextChallenge = () => {
      if (selectedDataset && currentChallenge) {
          startQuest(selectedDataset, currentChallenge.difficulty);
      }
  };

  const handleRunQuery = async (query: string) => {
    if (!selectedDataset) return;
    
    setIsQueryRunning(true);
    // Simulate network delay for realism if simulation is too fast
    await new Promise(r => setTimeout(r, 600));

    const resultData = await validateAndRunQuery(query, selectedDataset, currentChallenge);
    
    setQueryResult(resultData.result);
    setValidationMsg(resultData.validationMessage);
    setPassed(resultData.passed);
    setExplanation(resultData.explanation);
    setIsQueryRunning(false);
    
    // Auto switch to results tab on mobile on run
    if (!isDesktop) {
        setMobileTab('results');
    }

    if (resultData.passed) {
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                xp: currentUser.xp + (currentChallenge?.points || 0),
                completedChallenges: [...currentUser.completedChallenges, currentChallenge?.id || ''],
                level: Math.floor((currentUser.xp + (currentChallenge?.points || 0)) / 1000) + 1
            };
            handleUpdateUser(updatedUser);
        }
    }
  };

  const handleInsertText = (text: string) => {
    setInsertText(text);
    setInsertTrigger(prev => prev + 1);
    // Auto switch to editor on mobile after picking schema item
    if (!isDesktop) {
        setMobileTab('editor');
    }
  };

  // Resizing Logic
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingLeft) {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 500) setLeftPaneWidth(newWidth);
    }
    if (isResizingRight) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 200 && newWidth < 800) setRightPaneWidth(newWidth);
    }
  }, [isResizingLeft, isResizingRight]);

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);


  const renderHome = () => (
    <div className="max-w-6xl mx-auto p-4 md:p-8 overflow-y-auto h-full custom-scrollbar pb-24">
      
      {/* Hero / Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 md:mb-12 animate-fade-in-up">
        <div className="lg:col-span-2 bg-gradient-to-r from-quest-800 to-quest-900 border border-quest-700 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Database size={120} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {currentUser?.name}</h1>
            <p className="text-quest-400 mb-6 max-w-md text-sm md:text-base">You're on a roll! Keep mastering queries to reach Level {currentUser ? currentUser.level + 1 : 2}.</p>
            
            <div className="flex flex-wrap items-center gap-4">
                 <button className="bg-quest-accent hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2 text-sm md:text-base">
                    <Play size={18} fill="currentColor" /> Continue Journey
                 </button>
                 <div className="px-4 py-2 bg-quest-900/50 rounded-lg border border-quest-700 text-sm text-gray-300 flex items-center gap-2">
                    <Flame size={16} className="text-orange-500" />
                    <span>3 Day Streak</span>
                 </div>
            </div>
        </div>

        <div className="bg-quest-800 border border-quest-700 rounded-2xl p-6 flex flex-col justify-center">
             <div className="flex justify-between items-end mb-2">
                <span className="text-quest-400 text-sm font-bold uppercase">Current Level</span>
                <span className="text-3xl font-bold text-white">{currentUser?.level}</span>
             </div>
             <div className="w-full bg-quest-900 h-3 rounded-full overflow-hidden mb-2">
                 <div className="bg-gradient-to-r from-quest-accent to-purple-500 h-full rounded-full" style={{ width: `${(currentUser?.xp || 0) % 1000 / 10}%` }}></div>
             </div>
             <div className="flex justify-between text-xs text-gray-500">
                 <span>{(currentUser?.xp || 0) % 1000} XP</span>
                 <span>1000 XP</span>
             </div>
             <div className="mt-6 flex justify-between items-center text-sm text-gray-300 border-t border-quest-700 pt-4">
                 <div className="flex items-center gap-2">
                     <Award className="text-yellow-500" size={16} />
                     <span>{currentUser?.completedChallenges.length} Quests</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <Sparkles className="text-purple-500" size={16} />
                     <span>{currentUser?.xp} XP</span>
                 </div>
             </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Map size={20} className="text-quest-accent" /> Available Datasets
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {DATASETS.map((ds, idx) => (
          <div 
            key={ds.id} 
            className="bg-quest-800 border border-quest-700 rounded-xl p-6 hover:border-quest-accent transition-all hover:shadow-xl hover:shadow-blue-900/20 group animate-fade-in-up flex flex-col"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-quest-900 rounded-lg group-hover:scale-110 transition-transform shadow-inner shrink-0">
                {DATASET_ICONS[ds.id]}
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-quest-accent transition-colors">{ds.name}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6 h-12 line-clamp-2">
              {ds.description}
            </p>
            
            <div className="space-y-2 mt-auto">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => startQuest(ds, diff)}
                  className="w-full py-2 px-4 rounded bg-quest-900/50 hover:bg-quest-600 border border-quest-700 hover:border-quest-500 text-sm font-medium text-quest-300 hover:text-white transition-all flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${diff === 'Beginner' ? 'bg-green-500' : diff === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      {diff}
                  </span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuest = () => {
    if (loadingChallenge || !selectedDataset || !currentChallenge) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-quest-400 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p>Generating procedural challenge for {selectedDataset?.name}...</p>
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex border-b border-quest-700 bg-quest-800 shrink-0">
             <button 
                onClick={() => setMobileTab('schema')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 ${mobileTab === 'schema' ? 'text-white border-b-2 border-quest-accent bg-quest-700' : 'text-quest-400'}`}
             >
                <Table size={14} /> Schema
             </button>
             <button 
                onClick={() => setMobileTab('editor')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 ${mobileTab === 'editor' ? 'text-white border-b-2 border-quest-accent bg-quest-700' : 'text-quest-400'}`}
             >
                <Code size={14} /> Editor
             </button>
             <button 
                onClick={() => setMobileTab('results')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 relative ${mobileTab === 'results' ? 'text-white border-b-2 border-quest-accent bg-quest-700' : 'text-quest-400'}`}
             >
                <Layout size={14} /> Results
                {passed !== undefined && (
                    <span className={`absolute top-2 right-4 w-2 h-2 rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                )}
             </button>
        </div>

        {/* Left Pane: Schema */}
        <div 
            className={`
                ${mobileTab === 'schema' ? 'flex' : 'hidden'} 
                lg:flex flex-col shrink-0 lg:h-full h-full
            `} 
            style={{ width: isDesktop ? leftPaneWidth : '100%' }}
        >
          <SchemaExplorer 
            dataset={selectedDataset} 
            onInsertText={handleInsertText} 
          />
        </div>

        {/* Resizer Left (Desktop Only) */}
        <div 
            className="hidden lg:flex w-1 bg-quest-900 hover:bg-quest-accent cursor-col-resize items-center justify-center transition-colors z-20 group"
            onMouseDown={(e) => { e.preventDefault(); setIsResizingLeft(true); document.body.style.cursor = 'col-resize'; }}
        >
            <div className="h-8 w-1 bg-quest-600 group-hover:bg-quest-accent rounded-full transition-colors" />
        </div>
        
        {/* Middle Pane: Editor */}
        <div className={`
             ${mobileTab === 'editor' ? 'flex' : 'hidden'} 
             lg:flex flex-col flex-1 min-w-0 h-full
        `}>
          {/* Challenge Banner */}
          <div className="bg-quest-800 p-4 border-b border-quest-700 shrink-0">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                <Sparkles className="text-yellow-400 shrink-0" size={16} />
                <span className="truncate">{currentChallenge.title}</span>
              </h2>
              <span className={`text-[10px] md:text-xs px-2 py-1 rounded border whitespace-nowrap ${
                currentChallenge.difficulty === 'Advanced' ? 'border-red-500 text-red-400' : 
                currentChallenge.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-400' : 
                'border-green-500 text-green-400'
              }`}>
                {currentChallenge.difficulty}
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-300 mb-2 line-clamp-3 md:line-clamp-none">{currentChallenge.description}</p>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden relative">
            <SqlComposer 
              initialQuery="" 
              onRun={handleRunQuery} 
              isRunning={isQueryRunning}
              insertText={insertText}
              insertTrigger={insertTrigger}
              costEstimate={queryResult ? queryResult.costEstimate : null}
            />
          </div>
        </div>

         {/* Resizer Right (Desktop Only) */}
         <div 
            className="hidden lg:flex w-1 bg-quest-900 hover:bg-quest-accent cursor-col-resize items-center justify-center transition-colors z-20 group"
            onMouseDown={(e) => { e.preventDefault(); setIsResizingRight(true); document.body.style.cursor = 'col-resize'; }}
        >
             <div className="h-8 w-1 bg-quest-600 group-hover:bg-quest-accent rounded-full transition-colors" />
        </div>

        {/* Right Pane: Results */}
        <div 
            className={`
                ${mobileTab === 'results' ? 'flex' : 'hidden'} 
                lg:flex flex-col shrink-0 lg:h-full h-full
            `}
            style={{ width: isDesktop ? rightPaneWidth : '100%' }}
        >
             <ResultsPanel 
                result={queryResult} 
                challenge={currentChallenge} 
                validationMessage={validationMsg}
                passed={passed}
                explanation={explanation}
                onNextChallenge={handleNextChallenge}
            />
        </div>

      </div>
    );
  };

  const renderLeaderboard = () => {
     // Generate realistic fake leaderboard mixed with user
     const fakeUsers = [
         { name: "QueryMaster99", xp: 15200, quests: 84, avatar: "bg-blue-500" },
         { name: "Sarah_SQL", xp: 14800, quests: 79, avatar: "bg-purple-500" },
         { name: "DataNinja", xp: 13500, quests: 72, avatar: "bg-green-500" },
         { name: "BigQueryBoss", xp: 12100, quests: 65, avatar: "bg-orange-500" },
         { name: "SelectStar", xp: 11950, quests: 61, avatar: "bg-red-500" },
     ];
     
     // Mix current user into the list and sort
     const allUsers = [...fakeUsers];
     if (currentUser) {
         allUsers.push({
             name: currentUser.name,
             xp: currentUser.xp,
             quests: currentUser.completedChallenges.length,
             avatar: currentUser.avatar || "bg-quest-accent"
         });
     }
     const sorted = allUsers.sort((a,b) => b.xp - a.xp);

     return (
        <div className="max-w-4xl mx-auto p-4 md:p-12 text-center h-full overflow-y-auto custom-scrollbar">
            <Trophy size={64} className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Global Leaderboards</h2>
            <p className="text-gray-400 mb-8">Compete against thousands of data engineers worldwide.</p>
            
            <div className="bg-quest-800 rounded-2xl overflow-hidden border border-quest-700 text-left shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead className="bg-quest-900/80 backdrop-blur">
                            <tr>
                                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Rank</th>
                                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider">User</th>
                                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider text-right">XP</th>
                                <th className="p-4 text-gray-400 font-medium text-xs uppercase tracking-wider text-right">Quests</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-quest-700">
                            {sorted.map((u, idx) => (
                                <tr key={idx} className={`hover:bg-quest-700/50 transition-colors ${u.name === currentUser?.name ? 'bg-quest-700/30' : ''}`}>
                                    <td className="p-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold ${idx < 3 ? 'text-black' : 'text-gray-400'} ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : idx === 2 ? 'bg-orange-400' : ''}`}>
                                            {idx + 1}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${u.avatar}`}></div>
                                            <span className={`font-medium ${u.name === currentUser?.name ? 'text-quest-accent' : 'text-white'}`}>
                                                {u.name} {u.name === currentUser?.name && "(You)"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-quest-accent font-bold text-right font-mono">{u.xp.toLocaleString()}</td>
                                    <td className="p-4 text-gray-400 text-right">{u.quests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
     );
  };

  if (view === GameView.AUTH) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} usersDb={usersDb} />;
  }

  return (
    <div className={`h-screen flex flex-col bg-quest-900 text-gray-200 font-sans overflow-hidden theme-${currentUser?.theme || 'cosmic'}`}>
      {/* Navigation */}
      <header className="h-16 bg-quest-900 border-b border-quest-700 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 shadow-lg">
        <div className="flex items-center gap-4 md:gap-8">
            <div 
              className="flex items-center gap-2 font-bold text-lg md:text-xl text-white cursor-pointer"
              onClick={() => setView(GameView.HOME)}
            >
                <Database className="text-quest-accent" />
                <span className="hidden sm:inline">SQL Quest</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                <button 
                    onClick={() => setView(GameView.HOME)}
                    className={`hover:text-white transition-colors flex items-center gap-2 ${view === GameView.HOME ? 'text-white' : ''}`}
                >
                    <Map size={16} /> Quests
                </button>
                <button 
                    onClick={() => setView(GameView.LEADERBOARD)}
                    className={`hover:text-white transition-colors flex items-center gap-2 ${view === GameView.LEADERBOARD ? 'text-white' : ''}`}
                >
                    <Trophy size={16} /> Leaderboard
                </button>
            </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
             {view === GameView.QUEST && (
                 <button 
                    onClick={() => setView(GameView.HOME)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mr-2 md:mr-4 border border-quest-700 rounded-lg px-2 md:px-3 py-1.5 hover:bg-quest-800 transition-colors"
                 >
                    <ArrowLeft size={16} /> <span className="hidden sm:inline">Exit</span>
                 </button>
             )}
            
             <div className="flex items-center gap-3 pl-2 md:pl-6 border-l border-quest-700">
                {currentUser?.role === 'admin' && (
                     <button 
                        onClick={() => setView(GameView.ADMIN)}
                        className={`text-sm font-bold flex items-center gap-1.5 transition-colors mr-2 px-2 py-1.5 rounded-lg ${view === GameView.ADMIN ? 'bg-red-900/20 text-red-400' : 'text-red-400 hover:text-red-300 hover:bg-red-900/10'}`}
                    >
                        <ShieldAlert size={14} /> <span className="hidden sm:inline">Admin</span>
                     </button>
                )}

                {currentUser && (
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-400">Level {currentUser.level}</div>
                        <div className="text-sm font-bold text-white max-w-[100px] truncate">{currentUser.name}</div>
                    </div>
                )}
                {currentUser ? (
                    <div className="relative group cursor-pointer">
                         <div className={`h-8 w-8 md:h-9 md:w-9 rounded-full ${currentUser.avatar || 'bg-gradient-to-tr from-quest-accent to-purple-500'} flex items-center justify-center text-xs font-bold text-white ring-2 ring-quest-800 group-hover:ring-quest-600 transition-all`}>
                            {currentUser.name[0]}
                        </div>
                        <div className="absolute right-0 top-full mt-2 w-56 bg-quest-800 border border-quest-700 rounded-xl shadow-xl py-1 hidden group-hover:block z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-quest-700 mb-1">
                                <p className="text-sm text-white font-bold">{currentUser.name}</p>
                                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                            </div>
                            <button onClick={() => setView(GameView.SETTINGS)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-quest-700 hover:text-white flex items-center gap-2 transition-colors">
                                <Settings size={14} /> Account Settings
                            </button>
                             <button onClick={() => setView(GameView.LEADERBOARD)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-quest-700 hover:text-white flex items-center gap-2 transition-colors">
                                <Trophy size={14} /> My Ranking
                            </button>
                            <div className="border-t border-quest-700 mt-1">
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2 transition-colors">
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                     <button onClick={() => setView(GameView.AUTH)} className="text-sm text-quest-accent font-bold hover:underline">
                         Sign In
                     </button>
                )}
             </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {view === GameView.HOME && renderHome()}
        {view === GameView.QUEST && renderQuest()}
        {view === GameView.LEADERBOARD && renderLeaderboard()}
        {view === GameView.ADMIN && <AdminDashboard />}
        {view === GameView.SETTINGS && currentUser && (
            <SettingsPage 
                user={currentUser} 
                onUpdateUser={handleUpdateUser} 
                onDeleteAccount={handleDeleteAccount}
            />
        )}
      </main>
    </div>
  );
};

export default App;
