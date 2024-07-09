import { ErrorBoundary } from 'shared/observability';
import { useExtensionSettings } from 'shared/extension';
import { useTwitterLocationInfo, useHandleToUsernameMap } from 'host/twitter';

import { ProposalHandleContainer, ProposalMainContainer } from './widgets';
export const App = () => {
  const { isTallyApplicationEnabled } = useExtensionSettings();

  const {
    isTwitter,
    isTwitterHandlePage,
    isTwitterHomePage,
    twitterHandleFromPathname,
  } = useTwitterLocationInfo();

  const { data: daoHandles } = useHandleToUsernameMap('tally');

  if (!isTallyApplicationEnabled || !isTwitter) {
    return null;
  }

  const isTallyUser =
    isTwitterHandlePage &&
    daoHandles?.[twitterHandleFromPathname.toLowerCase()];
  return (
    <ErrorBoundary exceptionEventName="tally-runtime-error">
      {isTallyUser ? (
        <ProposalHandleContainer twitterHandle={twitterHandleFromPathname} />
      ) : null}
      {isTwitterHomePage ? <ProposalMainContainer /> : null}
    </ErrorBoundary>
  );
};
