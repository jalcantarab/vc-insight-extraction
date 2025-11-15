
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import DetailsPanel from './components/DetailsPanel';
import Header from './components/Header';
import { ExtractedData, OKR } from './types';
import { mockOkrs } from './lib/mock-data';
import { loadStateFromLocalStorage } from './lib/state';

const App: React.FC = () => {
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(loadStateFromLocalStorage);
  const [okrs, setOkrs] = useState<OKR[]>(mockOkrs);

  useEffect(() => {
    try {
      if (extractedData) {
        window.localStorage.setItem('insight_map_data', JSON.stringify(extractedData));
      } else {
        window.localStorage.removeItem('insight_map_data');
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [extractedData]);

  const hasData = extractedData !== null;

  return (
    <div className="bg-light-bg text-dark-gray flex h-screen font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header hasData={hasData} />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <MainContent
              extractedData={extractedData}
              setExtractedData={setExtractedData}
              okrs={okrs}
            />
          </div>
          <aside className="w-[35%] min-w-[400px] max-w-[550px] border-l border-light-border bg-white overflow-y-auto p-6 hidden xl:block">
            <DetailsPanel
              hasData={hasData}
              onClear={() => setExtractedData(null)}
              extractedData={extractedData}
              okrs={okrs}
            />
          </aside>
        </main>
      </div>
    </div>
  );
};

export default App;