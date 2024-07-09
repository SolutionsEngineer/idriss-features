import { useExtensionSettings } from 'shared/extension';
import { IDRISS_ICON_WITH_TEXT } from 'shared/idriss';
import { Toggle } from 'shared/ui';

export const TopBar = () => {
  const { isExtensionEnabled, changeExtensionState } = useExtensionSettings();
  return (
    <nav className=" flex items-center justify-between bg-white drop-shadow-sm">
      <a
        href="https://www.idriss.xyz/"
        className="flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="my-2 ml-2 h-12 w-auto"
          src={IDRISS_ICON_WITH_TEXT}
          alt="IDriss Logo"
        />
      </a>
      <Toggle
        checked={isExtensionEnabled}
        onCheckedChange={changeExtensionState}
      />
    </nav>
  );
};
