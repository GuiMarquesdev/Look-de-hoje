import { StoreSetting } from "../common/types";

export interface IAdminService {
  checkPassword(password: string): Promise<boolean>;
  getSettings(): Promise<StoreSetting | null>;
  updateSettings(data: Partial<StoreSetting>): Promise<StoreSetting>;
  updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<StoreSetting>;
}
