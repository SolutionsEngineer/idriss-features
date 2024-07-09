import { ErrorBoundary } from 'shared/observability';
import { useExtensionSettings } from 'shared/extension';
import { useTwitterLocationInfo } from 'host/twitter';

import { ProposalHandleContainer, ProposalMainContainer } from './widgets';

export const App = () => {
  const { isSnapshotApplicationEnabled } = useExtensionSettings();

  const {
    isTwitter,
    isTwitterHandlePage,
    isTwitterHomePage,
    twitterHandleFromPathname,
  } = useTwitterLocationInfo();

  if (!isSnapshotApplicationEnabled || !isTwitter) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="snapshot-runtime-error">
      {isTwitterHandlePage ? (
        <ProposalHandleContainer handle={twitterHandleFromPathname} />
      ) : null}
      {isTwitterHomePage ? <ProposalMainContainer /> : null}
    </ErrorBoundary>
  );
};
