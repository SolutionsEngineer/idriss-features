import { ManageExtensionStateCommand } from './manage-extension-state';
import { GetServiceStatusCommand } from './get-service-status';

export const COMMAND_MAP = {
  [GetServiceStatusCommand.name]: GetServiceStatusCommand,
  [ManageExtensionStateCommand.name]: ManageExtensionStateCommand,
};

export { GetServiceStatusCommand } from './get-service-status';
export { ManageExtensionStateCommand } from './manage-extension-state';
