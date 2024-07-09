import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  onWindowMessage,
  TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
} from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import {
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../constants';
import { ManageExtensionStateCommand } from '../commands';
import { ExtensionSettings } from '../types';

interface Properties {
  children: ReactNode;
}

interface ExtensionSettingsContextValues extends ExtensionSettings {
  isContextMenuVisible: boolean;
  hideContextMenu: () => void;
  changeExtensionState: (enabled: boolean) => Promise<void>;
}

const ExtensionSettingsContext = createContext<
  ExtensionSettingsContextValues | undefined
>(undefined);

const initialExtensionSettings: ExtensionSettings = {
  isAgoraApplicationEnabled: false,
  isExtensionEnabled: false,
  isSnapshotApplicationEnabled: false,
  isTallyApplicationEnabled: false,
  isPolymarketApplicationEnabled: false,
};

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [extensionSettings, setExtensionSettings] = useState(
    initialExtensionSettings,
  );

  const isAgoraApplicationEnabled = useMemo(() => {
    return extensionSettings.isAgoraApplicationEnabled;
  }, [extensionSettings.isAgoraApplicationEnabled]);

  const isExtensionEnabled = useMemo(() => {
    return extensionSettings.isExtensionEnabled;
  }, [extensionSettings.isExtensionEnabled]);

  const isSnapshotApplicationEnabled = useMemo(() => {
    return extensionSettings.isSnapshotApplicationEnabled;
  }, [extensionSettings.isSnapshotApplicationEnabled]);

  const isTallyApplicationEnabled = useMemo(() => {
    return extensionSettings.isTallyApplicationEnabled;
  }, [extensionSettings.isTallyApplicationEnabled]);

  const isPolymarketApplicationEnabled = useMemo(() => {
    return extensionSettings.isPolymarketApplicationEnabled;
  }, [extensionSettings.isPolymarketApplicationEnabled]);

  const hideContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
  }, []);

  const changeExtensionState = (enabled: boolean) => {
    const command = new ManageExtensionStateCommand({ enabled });
    return command.send().then(() => {
      setExtensionSettings((previous) => {
        return { ...previous, isExtensionEnabled: enabled };
      });
    });
  };

  useEffect(() => {
    onWindowMessage<void>(TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY, () => {
      setIsContextMenuVisible((previous) => {
        return !previous;
      });
    });

    onWindowMessage<ExtensionSettings>(
      GET_EXTENSION_SETTINGS_RESPONSE,
      (settings, removeEventListener) => {
        setExtensionSettings(settings);
        removeEventListener();
      },
    );
  }, []);

  useEffect(() => {
    window.postMessage({
      type: GET_EXTENSION_SETTINGS_REQUEST,
    });
  }, []);

  return (
    <ExtensionSettingsContext.Provider
      value={{
        isAgoraApplicationEnabled,
        isSnapshotApplicationEnabled,
        isTallyApplicationEnabled,
        isPolymarketApplicationEnabled,
        isContextMenuVisible,
        isExtensionEnabled,
        changeExtensionState,
        hideContextMenu,
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
