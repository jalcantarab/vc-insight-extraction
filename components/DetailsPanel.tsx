
import React from 'react';
import { TrashIcon, XMarkIcon, ChevronUpDownIcon, ExternalLinkIcon, ArrowRightIcon, TargetIcon } from './Icons';
import { ExtractedData, OKR, ExtractedItem } from '../types';

interface DetailsPanelProps {
    hasData: boolean;
    onClear: () => void;
    extractedData: ExtractedData | null;
    okrs: OKR[];
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ hasData, onClear, extractedData, okrs }) => {
  const linkedOkrIds = new Set<string>();
  if (extractedData && typeof extractedData === 'object') {
      Object.values(extractedData).flat().forEach(item => {
          if (item) { 
            (item as ExtractedItem).okrIds?.forEach(id => linkedOkrIds.add(id));
          }
      });
  }
  const linkedOkrs = okrs.filter(okr => linkedOkrIds.has(okr.id));


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {hasData ? (
             <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-sm font-medium bg-white border border-light-border rounded-lg shadow-sm hover:bg-gray-50">Save Draft</button>
                <button onClick={onClear} className="px-4 py-2 text-sm font-medium text-white bg-brand-pink rounded-lg shadow-sm hover:bg-pink-700">Start Over</button>
            </div>
        ) : (
            <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg">
                    <span>Definition</span>
                    <ChevronUpDownIcon className="w-4 h-4" />
                </button>
            </div>
        )}
        <div className="flex items-center space-x-2 text-medium-gray">
            <button><TrashIcon className="w-5 h-5" /></button>
            <button><XMarkIcon className="w-5 h-5" /></button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-dark-gray mb-1">Insight Mapping Tool</h2>
        <p className="text-sm text-medium-gray leading-relaxed">
            This tool captures conversation transcripts, extracting and categorizing ideas and insights for PM validation.
        </p>
      </div>

      <div className="border-t border-light-border pt-4">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-dark-gray">Impact on OKRs</h3>
                {linkedOkrs.length > 0 && <span className="text-xs bg-gray-200 text-gray-600 font-medium px-2 py-0.5 rounded-md">{linkedOkrs.length}</span>}
            </div>
            { linkedOkrs.length > 0 && <ExternalLinkIcon className="w-4 h-4 text-medium-gray cursor-pointer" /> }
        </div>
         {linkedOkrs.length > 0 ? (
            <div className="space-y-3 text-sm">
                {linkedOkrs.map(okr => (
                    <div key={okr.id} className="flex justify-between items-center group cursor-pointer">
                        <div className="flex items-start">
                            <TargetIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5"/>
                            <div>
                                <p className="font-medium text-dark-gray">{okr.text}</p>
                            </div>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-medium-gray opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
         ) : (
            <p className="text-sm text-medium-gray italic">No items have been mapped to OKRs yet.</p>
         )}
      </div>
    </div>
  );
};

export default DetailsPanel;