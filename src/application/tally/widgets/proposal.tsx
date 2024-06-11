import { classes } from 'shared/ui/utils';
import { Chip, WidgetBase } from 'shared/ui/components';
import { getDifferenceInDays, getEndsInLabel } from 'shared/utils';

import { ProposalData, ProposalsResponse } from '../types';
import { getProposalUrl, getUserUrl } from '../utils';

interface Properties {
  data: ProposalsResponse;
  className?: string;
  top?: number;
  onClose?: () => void;
}

export const Proposal = ({ data, className, top, onClose }: Properties) => {
  return (
    <WidgetBase
      className={classes(
        'rounded-lg bg-[#2d2d2d] text-xs leading-tight',
        className,
      )}
      top={top}
      onClose={onClose}
    >
      <header className="flex items-center justify-between space-x-3">
        <a
          href={getUserUrl(data.nodes[0]?.organization.name ?? '')}
          className="text-[#aaa]"
          target="_blank"
          rel="noopener noreferrer"
        >
          By {data.nodes[0]?.organization.name}
        </a>
        <Chip>Active</Chip>
      </header>
      <main className="mt-2">
        <p className="text-base font-semibold">{data.title}</p>
        <p className="mt-1 overflow-hidden text-[#ccc]">
          ${data.body.slice(0, 120)}...
        </p>
      </main>
      <footer className="mt-2 flex items-center space-x-2">
        <div className="text-[#aaa]">
          {getEndsInLabel(getDifferenceInDays(data.end * 1000))}
        </div>
        <a
          href={getProposalUrl(data.space.id, data.id)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Chip className="py-1" variant="info" width="long">
            Vote
          </Chip>
        </a>
      </footer>
    </WidgetBase>
  );
};