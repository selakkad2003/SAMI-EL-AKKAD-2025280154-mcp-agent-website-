import React, { useEffect, useState } from 'react';
import { Terminal, X } from 'lucide-react';

interface McpLog {
  id: string;
  toolName: string;
  args: any;
  message: string;
  timestamp: string;
}

const McpToast: React.FC = () => {
  const [logs, setLogs] = useState<McpLog[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/mcp-logs');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newLog: McpLog = {
          id: Math.random().toString(36).substring(7),
          ...data
        };
        
        setLogs(prev => [...prev, newLog]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          setLogs(prev => prev.filter(log => log.id !== newLog.id));
        }, 5000);
      } catch (e) {
        console.error("Failed to parse MCP log", e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {logs.map(log => (
        <div 
          key={log.id} 
          className="bg-black/80 backdrop-blur-md border border-green-500/30 rounded-xl p-4 shadow-2xl shadow-green-900/20 w-80 animate-fade-in pointer-events-auto flex items-start gap-3"
        >
          <div className="bg-green-500/20 p-2 rounded-lg mt-0.5">
            <Terminal size={18} className="text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider">MCP Tool Called</h4>
              <button 
                onClick={() => setLogs(prev => prev.filter(l => l.id !== log.id))}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-white text-sm mt-1 font-mono break-all">
              <span className="text-purple-300">{log.toolName}</span>
            </p>
            <div className="mt-2 text-xs text-white/60 font-mono bg-black/50 p-2 rounded border border-white/5 max-h-24 overflow-y-auto">
              {JSON.stringify(log.args, null, 2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default McpToast;
