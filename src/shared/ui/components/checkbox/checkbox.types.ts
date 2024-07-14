export type CheckboxProperties = {
  onChange: (value: boolean) => void;
  label?: string;
} & (
  | {
      value: boolean;
      type?: 'binary';
    }
  | {
      type: 'extended';
      value?: ExtendedCheckboxOption;
    }
);

export type ExtendedCheckboxOption = 'checked' | 'intermediate' | 'unchecked';
