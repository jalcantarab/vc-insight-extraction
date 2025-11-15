
import React from 'react';
// FIX: Removed unused 'CogIcon' import.
import { ChevronDoubleRightIcon, CompassIcon, CubeIcon, DocumentTextIcon, HomeIcon, LightBulbIcon, LogoutIcon, QuestionMarkCircleIcon, RocketLaunchIcon, SparklesIcon, TargetIcon, UserGroupIcon } from './Icons';

const Sidebar: React.FC = () => {
  const mainNavItems = [
    { icon: <CompassIcon />, label: 'Discover' },
    { icon: <RocketLaunchIcon />, label: 'Initiatives', active: true },
    { icon: <TargetIcon />, label: 'OKRs' },
    { icon: <CubeIcon />, label: 'Products' },
    { icon: <DocumentTextIcon />, label: 'Documents' },
    { icon: <UserGroupIcon />, label: 'Teams' },
  ];

  const bottomNavItems = [
    { icon: <QuestionMarkCircleIcon />, label: 'Help' },
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <SparklesIcon />, label: 'What\'s new' },
    { icon: <LightBulbIcon />, label: 'Feedback' },
    { icon: <LogoutIcon />, label: 'Logout' },
  ];

  return (
    <nav className="flex flex-col justify-between w-16 bg-white border-r border-light-border p-2">
      <div>
        <div className="flex items-center justify-center p-2 mb-4">
          <div className="bg-pink-100 text-pink-500 rounded-lg p-2 text-lg font-bold">Z</div>
          <ChevronDoubleRightIcon className="text-gray-400 w-4 h-4 ml-1" />
        </div>
        <ul className="space-y-2">
          {mainNavItems.map((item, index) => (
            <li key={index}>
              <a href="#" className={`flex items-center justify-center p-3 rounded-lg hover:bg-blue-50 ${item.active ? 'bg-blue-100 text-brand-blue' : 'text-medium-gray'}`}>
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="pb-4">
        <ul className="space-y-2">
            {bottomNavItems.map((item, index) => (
                <li key={index}>
                    <a href="#" className="flex items-center justify-center p-3 rounded-lg text-medium-gray hover:bg-gray-100">
                        {item.icon}
                        <span className="sr-only">{item.label}</span>
                    </a>
                </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
