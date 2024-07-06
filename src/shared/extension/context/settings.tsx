import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  onWindowMessage,
  TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY,
} from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import { ExtensionSettings } from '../types';
import {
  EXTENSION_SETTINGS_CHANGE,
  GET_EXTENSION_SETTINGS_REQUEST,
  GET_EXTENSION_SETTINGS_RESPONSE,
} from '../constants';

interface Properties {
  children: ReactNode;
}

const ExtensionSettingsContext = createContext<
  | (ExtensionSettings & {
      isContextMenuVisible: boolean;
      hideContextMenu: () => void;
    })
  | undefined
>(undefined);

export const ExtensionSettingsProvider = ({ children }: Properties) => {
  const queryClient = useQueryClient();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const hideContextMenu = useCallback(() => {
    setIsContextMenuVisible(false);
  }, []);

  const getInitialSettings = useCallback((): Promise<ExtensionSettings> => {
    return new Promise((resolve) => {
      window.postMessage({
        type: GET_EXTENSION_SETTINGS_REQUEST,
      });

      onWindowMessage<ExtensionSettings>(
        GET_EXTENSION_SETTINGS_RESPONSE,
        (settings, removeEventListener) => {
          resolve(settings);
          removeEventListener();
        },
      );
    });
  }, []);

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: getInitialSettings,
  });

  useEffect(() => {
    onWindowMessage<Partial<ExtensionSettings>>(
      EXTENSION_SETTINGS_CHANGE,
      (settings) => {
        queryClient.setQueryData<ExtensionSettings>(
          ['settings'],
          (cachedSettings) => {
            if (cachedSettings) {
              return { ...cachedSettings, ...settings };
            }

            return {
              enabled: settings.enabled ?? false,
              experimentalFeatures: settings.experimentalFeatures ?? false,
            };
          },
        );
      },
    );
  }, [queryClient]);

  useEffect(() => {
    onWindowMessage<void>(TOGGLE_EXTENSION_CONTEXT_MENU_VISIBILITY, () => {
      setIsContextMenuVisible((previous) => {
        return !previous;
      });
    });
  }, []);

  if (!settingsQuery.data) {
    return null;
  }

  return (
    <ExtensionSettingsContext.Provider
      value={{
        ...settingsQuery.data,
        isContextMenuVisible,
        hideContextMenu,
      }}
    >
      {children}
    </ExtensionSettingsContext.Provider>
  );
};

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
