import { useExtensionSettings } from 'shared/extension';
import { Closable } from 'shared/ui';

import { HomeView } from './home-view';

export const App = () => {
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
      <HomeView />
    </Closable>
  );
};
