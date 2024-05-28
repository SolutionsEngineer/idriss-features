import { Button, ButtonProperties } from 'shared/ui/components';
import { classes } from 'shared/ui/utils';

import { OUTCOME } from '../constants';
import { Outcome } from '../types';

export interface Properties extends ButtonProperties {
  isActive: boolean;
  outcome: Outcome;
}

export const VoteButton = ({
  onClick,
  className,
  children,
  isActive,
  outcome,
  disabled = false,
}: Properties) => {
  return (
    <Button
      className={classes(
        'rounded-lg bg-[#2C3F4F] py-4 font-semibold text-[##858D92]',
        isActive && 'text-white',
        // TODO: cva for variant styles
        isActive && outcome === OUTCOME.YES && 'bg-[#27AE60]',
        isActive && outcome === OUTCOME.NO && 'bg-[#E64800]',

        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};