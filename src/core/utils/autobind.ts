export function autoBind(self: any) {
  const proto = Object.getPrototypeOf(self);
  const propNames = Object.getOwnPropertyNames(proto);

  for (const key of propNames) {
    const value = self[key];
    if (typeof value === "function" && key !== "constructor") {
      self[key] = value.bind(self);
    }
  }
}
