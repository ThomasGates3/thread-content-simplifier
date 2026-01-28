
import React, { useState } from 'react';
import { SimplifiedContent } from '../types';
import { Icons } from '../constants';

interface Props {
  result: SimplifiedContent;
}

export const ResultView: React.FC<Props> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.transformedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Transformed Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Icons.Threads />
            <span className="font-bold text-black uppercase tracking-tight text-sm">Preview</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold hover:bg-gray-50 transition-colors"
          >
            {copied ? <Icons.Check /> : <Icons.Clipboard />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        {/* Updated for vertical spacing and scannability */}
        <div className="p-6 md:p-10 whitespace-pre-wrap leading-loose text-gray-900 text-lg md:text-xl font-medium tracking-tight">
          {result.transformedContent}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hemingway Audit */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-gray-900">Hemingway Audit</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Readability</span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                Grade {result.audit.gradeLevel}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Longest Sentence</span>
              <span className="font-bold text-gray-900">{result.audit.longestSentenceWordCount} words</span>
            </div>

            <div>
              <span className="text-gray-500 text-sm block mb-2">Complex Words Removed</span>
              <div className="flex flex-wrap gap-2">
                {result.audit.removedComplexWords.map((word, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider">
                    {word}
                  </span>
                ))}
                {result.audit.removedComplexWords.length === 0 && (
                  <span className="text-gray-400 italic text-xs">No complex words found.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Prediction */}
        <div className="bg-black text-white p-6 rounded-2xl shadow-lg flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <Icons.Sparkles />
            <h3 className="font-bold">Growth Insight</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {result.engagementPrediction}
          </p>
          <div className="mt-auto flex items-start gap-2 p-3 bg-white/10 rounded-xl border border-white/10">
            <div className="text-blue-400 pt-0.5"><Icons.Info /></div>
            <p className="text-[11px] text-gray-300">
              Low grade-level content (6-7) sees an average <strong>73.6% boost</strong> in engagement compared to 11th grade technical drafts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
