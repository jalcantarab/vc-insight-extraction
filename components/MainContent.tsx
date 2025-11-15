
import React, { useState, useRef, useEffect } from 'react';
import { generateInsightsFromTranscript } from '../lib/gemini';
import { ExtractedData, ExtractedItem, ItemType, OKR } from '../types';
import { DocumentIcon, LightBulbIcon, SparklesIcon, TargetIcon, TrashIcon, MapIcon, BoltIcon, SpinnerIcon, XMarkIcon } from './Icons';

// OKR Mapping Modal
const OKRMappingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    item: ExtractedItem | null;
    okrs: OKR[];
    onSave: (selectedOkrIds: string[]) => void;
}> = ({ isOpen, onClose, item, okrs, onSave }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (item?.okrIds) {
            setSelectedIds(new Set(item.okrIds));
        } else {
            setSelectedIds(new Set());
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const handleToggle = (okrId: string) => {
        const newSelection = new Set(selectedIds);
        if (newSelection.has(okrId)) {
            newSelection.delete(okrId);
        } else {
            newSelection.add(okrId);
        }
        setSelectedIds(newSelection);
    };
    
    const handleSave = () => {
        onSave(Array.from(selectedIds));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-dark-gray">Link to OKRs</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><XMarkIcon className="w-5 h-5 text-medium-gray" /></button>
                </div>
                <p className="text-sm text-medium-gray mb-2">Select the Objectives and Key Results that this item impacts:</p>
                <blockquote className="text-sm bg-gray-50 p-3 rounded-md border border-light-border mb-4 text-dark-gray italic">"{item.text}"</blockquote>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {okrs.map(okr => (
                        <label key={okr.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedIds.has(okr.id)}
                                onChange={() => handleToggle(okr.id)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                                aria-label={okr.text}
                            />
                            <span className="ml-3 text-sm text-dark-gray">{okr.text}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border border-light-border rounded-lg shadow-sm hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg shadow-sm hover:bg-blue-600">Save Links</button>
                </div>
            </div>
        </div>
    );
};


// Sub-component for an individual editable card
const InsightCard: React.FC<{
    item: ExtractedItem;
    color: string;
    icon: React.ReactNode;
    onUpdate: (id: string, newText: string) => void;
    onDelete: (id: string) => void;
    onMapToOkr: (item: ExtractedItem) => void;
}> = ({ item, color, icon, onUpdate, onDelete, onMapToOkr }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleBlur = () => {
        setIsEditing(false);
        if (text.trim() && text.trim() !== item.text) {
            onUpdate(item.id, text.trim());
        } else {
            setText(item.text); // Revert if empty or unchanged
        }
    };

    useEffect(() => {
        if (isEditing) {
            textareaRef.current?.focus();
            textareaRef.current?.select();
        }
    }, [isEditing]);
    
    const colorStyles: { [key: string]: { bg: string; text: string; border: string; } } = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    };

    const styles = colorStyles[color] || colorStyles.blue;
    const canBeMapped = item.type === 'insights' || item.type === 'opportunities';

    return (
        <div className={`bg-white p-3.5 rounded-lg border shadow-sm hover:shadow-md transition-shadow group`}>
            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                    className="w-full text-sm p-2 rounded-md border border-blue-400 focus:ring-2 focus:ring-blue-300"
                    rows={4}
                />
            ) : (
                <p onClick={() => setIsEditing(true)} className="text-sm text-dark-gray leading-relaxed cursor-pointer min-h-[4rem]">
                    {item.text}
                </p>
            )}
            <div className="mt-3 flex justify-between items-center">
                 <div className="flex items-center gap-2 flex-wrap">
                    <div className={`${styles.bg} ${styles.text} text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5 border ${styles.border}`}>
                        {icon}
                        <span>{item.speaker || `Speaker`}</span>
                    </div>
                     {item.okrIds && item.okrIds.length > 0 && (
                        <div className="flex items-center text-xs font-medium text-teal-800 bg-teal-50 px-2 py-1 rounded-full border border-teal-200">
                           <TargetIcon className="w-3 h-3 mr-1" />
                           <span>{item.okrIds.length} OKR{item.okrIds.length > 1 ? 's' : ''}</span>
                        </div>
                    )}
                 </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canBeMapped && <button onClick={() => onMapToOkr(item)} className="p-1 hover:bg-gray-200 rounded" title="Map to OKR"><MapIcon className="w-4 h-4 text-gray-500" /></button>}
                    <button onClick={() => onDelete(item.id)} className="p-1 hover:bg-gray-200 rounded" title="Delete">
                        <TrashIcon className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};


// Sub-component for a column
const InsightColumn: React.FC<{
    title: string;
    items: ExtractedItem[];
    color: string;
    icon: React.ReactNode;
    onUpdateItem: (type: ItemType, id: string, newText: string) => void;
    onDeleteItem: (type: ItemType, id:string) => void;
    onMapItemToOkr: (item: ExtractedItem) => void;
}> = ({ title, items, color, icon, onUpdateItem, onDeleteItem, onMapItemToOkr }) => {
    const colorStyles: { [key: string]: string } = {
        blue: 'text-blue-600',
        teal: 'text-teal-600',
        amber: 'text-amber-600',
        purple: 'text-purple-600',
    };
    const textColor = colorStyles[color] || 'text-gray-600';

    return (
        <div className="bg-gray-50/70 rounded-xl p-4">
            <div className={`flex items-center mb-4 ${textColor}`}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 mr-2"})}
                <h3 className="font-bold text-dark-gray">{title}</h3>
                <span className={`ml-2 text-sm font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full`}>
                    {items.length}
                </span>
            </div>
            <div className="space-y-3">
                {items.map(item => (
                    <InsightCard 
                        key={item.id} 
                        item={item} 
                        color={color} 
                        icon={icon}
                        onUpdate={(id, newText) => onUpdateItem(item.type, id, newText)}
                        onDelete={(id) => onDeleteItem(item.type, id)}
                        onMapToOkr={onMapItemToOkr}
                    />
                ))}
            </div>
        </div>
    );
};

// Main Component
interface MainContentProps {
  extractedData: ExtractedData | null;
  setExtractedData: React.Dispatch<React.SetStateAction<ExtractedData | null>>;
  okrs: OKR[];
}

const MainContent: React.FC<MainContentProps> = ({ extractedData, setExtractedData, okrs }) => {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for OKR Modal
  const [isOkrModalOpen, setIsOkrModalOpen] = useState(false);
  const [currentItemForOkr, setCurrentItemForOkr] = useState<ExtractedItem | null>(null);

  const handleGenerate = async () => {
    if (!transcript.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateInsightsFromTranscript(transcript);
      setExtractedData(result);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItem = (type: ItemType, id: string, updates: Partial<ExtractedItem> | string) => {
    if (!extractedData) return;

    const newItems = extractedData[type].map(item => {
      if (item.id === id) {
        if (typeof updates === 'string') {
          return { ...item, text: updates };
        }
        return { ...item, ...updates };
      }
      return item;
    });

    setExtractedData({ ...extractedData, [type]: newItems });
  };


  const handleDeleteItem = (type: ItemType, id: string) => {
    if (!extractedData) return;
    const updatedItems = extractedData[type].filter(item => item.id !== id);
    setExtractedData({ ...extractedData, [type]: updatedItems });
  };

  const handleOpenOkrModal = (item: ExtractedItem) => {
      setCurrentItemForOkr(item);
      setIsOkrModalOpen(true);
  };

  const handleCloseOkrModal = () => {
      setIsOkrModalOpen(false);
      setCurrentItemForOkr(null);
  };
  
  const handleSaveOkrLinks = (selectedOkrIds: string[]) => {
      if(currentItemForOkr) {
          handleUpdateItem(currentItemForOkr.type, currentItemForOkr.id, { okrIds: selectedOkrIds });
      }
      handleCloseOkrModal();
  };


  if (!extractedData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-gray mb-2">Transcript-Driven Insights Map</h1>
            <p className="text-medium-gray">Paste a transcript from a user interview or meeting to automatically extract key insights and opportunities.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-light-border shadow-sm">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your transcript here..."
              className="w-full h-64 p-4 border border-light-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              aria-label="Transcript Input"
            />
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !transcript.trim()}
                    className="flex items-center justify-center space-x-2 px-6 py-2.5 w-48 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isLoading ? 'Generating...' : 'Generate Insights'}</span>
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <OKRMappingModal 
            isOpen={isOkrModalOpen}
            onClose={handleCloseOkrModal}
            item={currentItemForOkr}
            okrs={okrs}
            onSave={handleSaveOkrLinks}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <InsightColumn 
                title="Signals" 
                items={extractedData?.signals || []} 
                color="blue"
                icon={<DocumentIcon />}
                onUpdateItem={(type, id, text) => handleUpdateItem(type, id, text)}
                onDeleteItem={handleDeleteItem}
                onMapItemToOkr={handleOpenOkrModal}
            />
            <InsightColumn 
                title="Insights" 
                items={extractedData?.insights || []} 
                color="teal"
                icon={<TargetIcon />}
                onUpdateItem={(type, id, text) => handleUpdateItem(type, id, text)}
                onDeleteItem={handleDeleteItem}
                onMapItemToOkr={handleOpenOkrModal}
            />
            <InsightColumn 
                title="Opportunities" 
                items={extractedData?.opportunities || []} 
                color="amber"
                icon={<BoltIcon />}
                onUpdateItem={(type, id, text) => handleUpdateItem(type, id, text)}
                onDeleteItem={handleDeleteItem}
                onMapItemToOkr={handleOpenOkrModal}
            />
            <InsightColumn 
                title="Ideas" 
                items={extractedData?.ideas || []} 
                color="purple"
                icon={<LightBulbIcon />}
                onUpdateItem={(type, id, text) => handleUpdateItem(type, id, text)}
                onDeleteItem={handleDeleteItem}
                onMapItemToOkr={handleOpenOkrModal}
            />
        </div>
    </div>
  );
};

export default MainContent;