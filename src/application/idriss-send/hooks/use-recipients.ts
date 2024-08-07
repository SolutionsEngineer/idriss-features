import { useEffect, useMemo, useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import {
  GetDigestToWalletAddressCommand,
  GetHandleToTwitterIdCommand,
} from 'shared/idriss';
import { Hex } from 'shared/web3';
import { reverseObject } from 'shared/utils';
import { ScrapingResult } from 'shared/scraping';
import { getNodeToInjectToUser, isHandleNode } from 'host/twitter';

import { GetCustomRecipientsCommand } from '../commands';
import { DEFAULT_ALLOWED_CHAINS_IDS, PUBLIC_ETH_TAG_NAME } from '../constants';
import { mapDigestedMessageToWalletTag } from '../utils';
import { Recipient } from '../types';

type RecipientCandidate = Omit<
  Recipient,
  'walletAddress' | 'isHandleUser' | 'nodeToInject'
> & {
  walletAddress?: Hex;
  digestedMessageToWalletTag: Record<string, string>;
  walletTagToDigestedMessage: Record<string, string>;
  node: Element;
};

interface Properties {
  users: ScrapingResult[];
  handle?: string;
  enabled: boolean;
}

export const useRecipients = ({ users, handle, enabled }: Properties) => {
  const [digestToWallet, setDigestToWallet] = useState<Record<string, string>>(
    {},
  );
  const [usernameToTwitterId, setUsernameToTwitterId] = useState<
    Record<string, string | null>
  >({});

  const handles = useMemo(() => {
    return [
      ...new Set(
        users.map((result) => {
          return result.value;
        }),
      ),
    ].filter((handle) => {
      return !Object.keys(usernameToTwitterId).includes(handle.toLowerCase());
    });
  }, [usernameToTwitterId, users]);

  const customRecipientsQuery = useCommandQuery({
    command: new GetCustomRecipientsCommand({}),
    placeholderData: (previousData) => {
      return previousData;
    },
    enabled,
  });

  const getHandlesToTwitterIdsQuery = useCommandQuery({
    command: new GetHandleToTwitterIdCommand({ handles }),
    enabled: enabled && handles.length > 0,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const recipientsWithOptionalWallet: RecipientCandidate[] = useMemo(() => {
    if (!customRecipientsQuery.data) {
      return [];
    }

    return users
      ?.map((result) => {
        const twitterId = usernameToTwitterId[result.value.toLowerCase()];

        if (!twitterId) {
          return;
        }

        const customRecipientData = customRecipientsQuery.data[twitterId];

        const digestedMessageToWalletTag =
          mapDigestedMessageToWalletTag(twitterId);

        const walletTagToDigestedMessage = reverseObject(
          digestedMessageToWalletTag,
        );

        return {
          ...result,
          username: result.value,
          digestedMessageToWalletTag,
          walletTagToDigestedMessage,
          walletAddress: customRecipientData?.walletAddress,
          availableNetworks:
            customRecipientData?.availableNetworks ??
            DEFAULT_ALLOWED_CHAINS_IDS,
          widgetOverrides: customRecipientData?.sendWidgetOverrides,
        };
      })
      .filter(Boolean);
  }, [customRecipientsQuery.data, usernameToTwitterId, users]);

  const usersWithoutWalletYet = useMemo(() => {
    return recipientsWithOptionalWallet.filter((user) => {
      return !user.walletAddress;
    });
  }, [recipientsWithOptionalWallet]);

  const digestedMessages = useMemo(() => {
    return [
      ...new Set(
        usersWithoutWalletYet.flatMap((user) => {
          return Object.keys(user.digestedMessageToWalletTag);
        }),
      ),
    ].filter((message) => {
      return !Object.keys(digestToWallet).includes(message);
    });
  }, [digestToWallet, usersWithoutWalletYet]);

  const getDigestToWalletAddressQuery = useCommandQuery({
    command: new GetDigestToWalletAddressCommand({
      digestedMessages,
    }),
    enabled,
  });

  useEffect(() => {
    if (!getDigestToWalletAddressQuery.data) {
      return;
    }

    setDigestToWallet((previous) => {
      return {
        ...previous,
        ...getDigestToWalletAddressQuery.data,
      };
    });
  }, [getDigestToWalletAddressQuery.data]);

  useEffect(() => {
    if (!getHandlesToTwitterIdsQuery.data) {
      return;
    }

    setUsernameToTwitterId((previous) => {
      return {
        ...previous,
        ...getHandlesToTwitterIdsQuery.data,
      };
    });
  }, [getHandlesToTwitterIdsQuery.data]);

  const recipients: Recipient[] = useMemo(() => {
    return recipientsWithOptionalWallet
      .map((user) => {
        let walletAddress: Hex | undefined;
        if (user.walletAddress) {
          walletAddress = user.walletAddress;
        } else {
          const userDigestedMessages = Object.keys(
            user.digestedMessageToWalletTag,
          );

          const userDigestToWallet = Object.fromEntries(
            Object.entries(digestToWallet).filter(([digest, wallet]) => {
              return userDigestedMessages.includes(digest) && wallet.length > 0;
            }),
          ) as Record<string, Hex>;

          const publicEthDigestedMessage =
            user.walletTagToDigestedMessage[PUBLIC_ETH_TAG_NAME] ?? '';

          walletAddress =
            userDigestToWallet[publicEthDigestedMessage] ??
            Object.values(userDigestToWallet)[0];
        }

        if (!walletAddress) {
          return;
        }

        const { top, node, username, availableNetworks, widgetOverrides } =
          user;

        const isHandleUser =
          handle === username && isHandleNode(node as HTMLElement);

        const nodeToInject = getNodeToInjectToUser(node, isHandleUser);

        if (!nodeToInject || nodeToInject?.textContent === 'Follows you') {
          return;
        }

        return {
          top,
          username,
          availableNetworks,
          widgetOverrides,
          walletAddress,
          nodeToInject,
          isHandleUser,
        };
      })
      .filter(Boolean);
  }, [recipientsWithOptionalWallet, handle, digestToWallet]);

  return { recipients };
};
