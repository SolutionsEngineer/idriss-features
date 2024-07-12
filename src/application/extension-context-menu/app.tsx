import { useState } from 'react';

import { useExtensionSettings } from 'shared/extension';
import { Closable } from 'shared/ui';

import { HomeView } from './home-view';
import { SettingsView } from './settings-view';
import { TopBar } from './top-bar';
import { Footer } from './footer';

export type MenuContent = 'home' | 'settings';

export const App = () => {
  const [activeView, setActiveView] = useState<MenuContent>('home');
  const { isContextMenuVisible, hideContextMenu } = useExtensionSettings();

  if (!isContextMenuVisible) {
    return null;
  }
  return (
    <Closable
      closeButtonClassName="hidden"
      closeOnClickAway
      onClose={hideContextMenu}
      className="fixed right-6 top-6 z-50 flex size-[400px] flex-col overflow-hidden rounded-md bg-white p-0"
    >
      <>
        <TopBar />
        {activeView === 'home' ? <HomeView /> : <SettingsView />}
      </>
      <Footer />
    </Closable>
  );
};
