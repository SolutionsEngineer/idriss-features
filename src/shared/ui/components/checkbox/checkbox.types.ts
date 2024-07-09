export interface CheckboxProperties {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  additionalClassNameWhenChecked?: string;
}
