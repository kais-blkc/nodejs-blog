import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";

/**
 * Преобразует объект в экземпляр класса с @Expose/@Exclude
 * и возвращает типизированный объект.
 */
export function transformResponse<T>(rdo: ClassConstructor<T>, data: any): T {
  const transformed = { ...data };

  // если есть поля Date → конвертируем
  if (transformed.createdAt instanceof Date) {
    transformed.createdAt = transformed.createdAt.toISOString();
  }
  if (transformed.updatedAt instanceof Date) {
    transformed.updatedAt = transformed.updatedAt.toISOString();
  }

  const instance = plainToInstance(rdo, transformed, {
    excludeExtraneousValues: true,
  });

  return instance;
}
