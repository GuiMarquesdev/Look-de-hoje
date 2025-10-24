import { StoreSetting } from '../common/types';

export interface IStoreSettingRepository {
  getSettings(): Promise<StoreSetting | null>;
  updateSettings(data: Partial<StoreSetting>): Promise<StoreSetting>;
}