
import React from 'react';
import { ContentTemplate } from '../types';
import { TEMPLATES } from '../constants';

interface Props {
  selected: ContentTemplate;
  onSelect: (template: ContentTemplate) => void;
}

export const TemplateSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => onSelect(tpl.id as ContentTemplate)}
          className={`p-4 rounded-xl text-left transition-all border-2 flex flex-col gap-1 ${
            selected === tpl.id 
              ? 'border-black bg-black text-white' 
              : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 shadow-sm'
          }`}
        >
          <span className="font-semibold text-sm">{tpl.label}</span>
          <span className={`text-[11px] leading-tight ${selected === tpl.id ? 'text-gray-300' : 'text-gray-400'}`}>
            {tpl.description}
          </span>
        </button>
      ))}
    </div>
  );
};
