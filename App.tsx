
import React, { useState } from 'react';
import { AppState, ContentTemplate } from './types';
import { Icons } from './constants';
import { TemplateSelector } from './components/TemplateSelector';
import { ResultView } from './components/ResultView';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    input: '',
    customInstructions: '',
    template: ContentTemplate.NEWS_HOOK,
    isProcessing: false,
    result: null,
    error: null,
  });

  const handleSimplify = async () => {
    const trimmedInput = state.input.trim();
    if (!trimmedInput) return;

    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      const result = await geminiService.simplifyContent(trimmedInput, state.template, state.customInstructions);
      setState(prev => ({ ...prev, result, isProcessing: false }));
      
      // Allow DOM to update before scrolling
      window.requestAnimationFrame(() => {
        const resultEl = document.getElementById('result-section');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } catch (err: any) {
      console.error("Transformation Error:", err);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err.message || "Something went wrong while processing your request. Please try again." 
      }));
    }
  };

  const handleReset = () => {
    setState({
      input: '',
      customInstructions: '',
      template: ContentTemplate.NEWS_HOOK,
      isProcessing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-900 pb-20 selection:bg-black selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg shadow-sm">
              <Icons.Threads />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Simplify</h1>
          </div>
          {state.result && (
            <button 
              onClick={handleReset}
              className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Intro */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-black">
            Stop over-explaining.<br />
            <span className="text-gray-400">Start growing.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Transform technical 12th-grade drafts into high-impact Grade 7 Threads content. Simple wins.
          </p>
        </section>

        {/* Input Area */}
        <section className="space-y-6">
          <div className={`bg-black rounded-2xl shadow-2xl border transition-all ${state.isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100 border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-700'}`}>
            <textarea
              value={state.input}
              onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
              placeholder="Paste your complex technical draft here..."
              className="w-full h-48 md:h-64 p-6 resize-none focus:outline-none text-lg text-white bg-transparent placeholder:text-zinc-600 font-medium selection:bg-gray-600 selection:text-white"
              disabled={state.isProcessing}
            />
            <div className="bg-zinc-900 px-6 py-3 flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-t border-zinc-800">
              <span>{state.input.length} Characters</span>
              <span>Draft: {state.input.length > 10 ? 'Analyzing...' : 'Empty'}</span>
            </div>
          </div>

          <div className={`transition-opacity ${state.isProcessing ? 'opacity-50' : 'opacity-100'}`}>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
              Custom Instructions (Optional)
            </label>
            <input
              type="text"
              value={state.customInstructions}
              onChange={(e) => setState(prev => ({ ...prev, customInstructions: e.target.value }))}
              placeholder="e.g., 'Make it sarcastic', 'Split into 3 parts', 'Target developers'..."
              className="w-full p-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition-all shadow-sm"
              disabled={state.isProcessing}
            />
          </div>

          <div className={`space-y-4 transition-opacity ${state.isProcessing ? 'opacity-50' : 'opacity-100'}`}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Strategy</h3>
            <TemplateSelector 
              selected={state.template} 
              onSelect={(t) => !state.isProcessing && setState(prev => ({ ...prev, template: t }))} 
            />
          </div>

          <button
            onClick={handleSimplify}
            disabled={state.isProcessing || !state.input.trim()}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl ${
              state.isProcessing || !state.input.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-zinc-800 hover:shadow-2xl'
            }`}
          >
            {state.isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Strategy...</span>
              </>
            ) : (
              <>
                <Icons.Sparkles />
                <span>Transform for Threads</span>
              </>
            )}
          </button>

          {state.error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-center text-red-600 text-sm font-medium animate-in slide-in-from-top-2">
              <Icons.Warning />
              <span>{state.error}</span>
            </div>
          )}
        </section>

        {/* Result Area */}
        {state.result && (
          <section id="result-section" className="pt-12 border-t border-gray-100 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-black tracking-tight">Your Transformed Thread</h2>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wider">Ready to Post</div>
            </div>
            <ResultView result={state.result} />
          </section>
        )}
      </main>

      {/* Mobile Sticky CTA for results */}
      {state.result && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto z-50 animate-in slide-in-from-bottom-8">
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-4 px-6">
            <p className="text-white text-xs font-bold truncate hidden md:block">Grade {state.result.audit.gradeLevel} Readability</p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(state.result?.transformedContent || '');
                const notification = document.createElement('div');
                notification.innerText = 'Copied!';
                notification.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-xs font-bold';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
              }}
              className="bg-white text-black text-xs font-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors uppercase tracking-widest whitespace-nowrap"
            >
              Copy Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
