import { IPieceRepository } from "../interfaces/IPieceRepository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { IStoreSettingRepository } from "../interfaces/IStoreSettingRepository";
import { IHeroSettingRepository } from "../interfaces/IHeroSettingRepository";

export interface IRepositoryFactory {
  // Define o método de criação para cada tipo de Repositório.
  createPieceRepository(): IPieceRepository;
  createCategoryRepository(): ICategoryRepository;
  createStoreSettingRepository(): IStoreSettingRepository;
  createHeroSettingRepository(): IHeroSettingRepository;
}
