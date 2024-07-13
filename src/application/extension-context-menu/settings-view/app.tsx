import { useExtensionSettings } from 'shared/extension';
import { Toggle } from 'shared/ui';

export const App = () => {
  const { changeExtensionSetting, extensionSettings } = useExtensionSettings();

  return (
    <div className="shrink-0 grow p-10 text-black">
      <div>
        <span>Tipping</span>
        <Toggle
          checked={extensionSettings['tipping-enabled']}
          onCheckedChange={(enabled) => {
            return changeExtensionSetting('tipping-enabled', enabled);
          }}
        />
      </div>
      <div>
        <span>Gitcoin</span>
        <Toggle
          checked={extensionSettings['gitcoin-enabled']}
          onCheckedChange={(enabled) => {
            return changeExtensionSetting('gitcoin-enabled', enabled);
          }}
        />
      </div>
      <div>
        <span>Snapshot</span>
        <Toggle
          checked={extensionSettings['snapshot-enabled']}
          onCheckedChange={(enabled) => {
            return changeExtensionSetting('snapshot-enabled', enabled);
          }}
        />
      </div>
      <div>
        <span>Tally</span>
        <Toggle
          checked={extensionSettings['tally-enabled']}
          onCheckedChange={(enabled) => {
            return changeExtensionSetting('tally-enabled', enabled);
          }}
        />
      </div>
      <div>
        <span>Agora</span>
        <Toggle
          checked={extensionSettings['agora-enabled']}
          onCheckedChange={(enabled) => {
            return changeExtensionSetting('agora-enabled', enabled);
          }}
        />
      </div>
      <div>
        <span>Polymarket</span>
        <Toggle
          checked={extensionSettings['polymarket-enabled']}
          onCheckedChange={(enabled) => {
            return changeExtensionSetting('polymarket-enabled', enabled);
          }}
        />
      </div>
    </div>
  );
};
