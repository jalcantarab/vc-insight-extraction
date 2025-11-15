
import React from 'react';
import { UserGroupIcon, DownloadIcon, ShareIcon, BellIcon, UserCircleIcon } from './Icons';

interface HeaderProps {
    hasData: boolean;
}

const Header: React.FC<HeaderProps> = ({ hasData }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-light-border h-16 flex items-center justify-between px-6">
        <div>
            {/* Breadcrumbs or page title can go here. Kept minimal for now. */}
            <h1 className="text-lg font-semibold text-dark-gray">Insight Mapping Tool</h1>
        </div>
        <div className="flex items-center space-x-4 text-medium-gray">
            <button className="p-2 hover:bg-gray-100 rounded-full"><UserGroupIcon className="w-5 h-5"/></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><DownloadIcon className="w-5 h-5"/></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><ShareIcon className="w-5 h-5"/></button>
            <div className="w-px h-6 bg-light-border mx-2"></div>
            <button className="p-2 hover:bg-gray-100 rounded-full"><BellIcon className="w-5 h-5"/></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><UserCircleIcon className="w-6 h-6"/></button>
        </div>
    </header>
  );
};

export default Header;
