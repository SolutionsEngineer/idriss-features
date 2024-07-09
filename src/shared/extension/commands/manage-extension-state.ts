import { Command, OkResult } from 'shared/messaging';
import { ExtensionStatusManager } from 'src/popup/extension-status-manager';

interface Payload {
  enabled: boolean;
}

type Response = undefined;

export class ManageExtensionStateCommand extends Command<Payload, Response> {
  public readonly name = 'ManageExtensionStateCommand' as const;

  constructor(
    public payload: Payload,
    id?: string,
  ) {
    super(id ?? null);
  }

  async handle() {
    chrome.storage.local
      .set({ enabled: this.payload.enabled })
      .catch(console.error);
    chrome.storage.local
      .set({ cacheInvalidate: Date.now() })
      .catch(console.error);
    const allStorage = await chrome.storage.local.get(null);
    for (const x of Object.keys(allStorage).filter((x) => {
      return x.startsWith('cache[');
    })) {
      await chrome.storage.local.remove(x);
      continue;
    }

    if (this.payload.enabled) {
      ExtensionStatusManager.enable();
    } else {
      ExtensionStatusManager.disable();
    }

    return new OkResult(undefined);
  }
}
