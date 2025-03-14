class InjectEnvironmentDto {
  public key!: string;
  public parse?: boolean;
  public defaultValue?: string;
}

export const InjectEnvironment = (
  injectEnvironment: InjectEnvironmentDto,
): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    const { key, parse, defaultValue } = injectEnvironment;
    Object.defineProperty(target, propertyKey, {
      get: () => {
        let envValue = process.env[key.toUpperCase()];
        if (!envValue) {
          envValue = defaultValue;
        }
        if (parse) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return envValue ? JSON.parse(envValue) : undefined; // Retorna undefined se não houver valor
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            throw new SyntaxError(
              `Invalid JSON in environment variable ${key.toUpperCase()}: ${envValue}`,
            );
          }
        }

        return envValue;
      },
      configurable: true,
      enumerable: true,
    });
  };
};
