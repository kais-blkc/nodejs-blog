import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from "class-transformer";

export function transformResponse<T>(rdo: ClassConstructor<T>, data: object) {
  const instance = plainToInstance(rdo, data, {
    excludeExtraneousValues: true,
  });

  return instanceToPlain(instance);
}
