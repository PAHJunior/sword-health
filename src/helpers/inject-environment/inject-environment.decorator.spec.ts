import { InjectEnvironment } from './inject-environment.decorator';

describe('InjectEnvironment Decorator', () => {
  it('should inject secret with uppercase key', () => {
    process.env['MY_SECRET'] = 'mySecretValue';

    class TestClass {
      @InjectEnvironment({ key: 'my_secret' })
      public mySecret: string | undefined;
    }

    const instance = new TestClass();

    expect(instance.mySecret).toEqual('mySecretValue');
  });

  describe('Parsing', () => {
    it('should inject secret with parsing object', () => {
      process.env['PARSED_SECRET'] = '{"key": "value"}';

      class TestClass {
        @InjectEnvironment({ key: 'parsed_secret', parse: true })
        public parsedSecret: Record<string, string> | undefined;
      }

      const instance = new TestClass();

      expect(instance.parsedSecret).toEqual({ key: 'value' });
    });

    it('should inject secret with parsing number', () => {
      process.env['PARSED_SECRET'] = '10';

      class TestClass {
        @InjectEnvironment({ key: 'parsed_secret', parse: true })
        public parsedSecret: number | undefined;
      }

      const instance = new TestClass();

      expect(instance.parsedSecret).toEqual(10);
    });

    it('should inject secret with parsing boolean (true)', () => {
      process.env['PARSED_SECRET'] = 'true';

      class TestClass {
        @InjectEnvironment({ key: 'parsed_secret', parse: true })
        public parsedSecret: number | undefined;
      }

      const instance = new TestClass();

      expect(instance.parsedSecret).toEqual(true);
    });

    it('should inject secret with parsing boolean (false)', () => {
      process.env['PARSED_SECRET'] = 'false';

      class TestClass {
        @InjectEnvironment({ key: 'parsed_secret', parse: true })
        public parsedSecret: number | undefined;
      }

      const instance = new TestClass();

      expect(instance.parsedSecret).toEqual(false);
    });

    it('should use and parse the default value if the secret is undefined', () => {
      class TestClass {
        @InjectEnvironment({
          key: 'nonexistent_secret',
          parse: true,
          defaultValue: '10',
        })
        public defaultSecret: string | undefined;
      }

      const instance = new TestClass();

      expect(instance.defaultSecret).toEqual(10);
    });

    it('should catch invalid JSON string', () => {
      class TestClass {
        @InjectEnvironment({
          key: 'nonexistent_secret',
          parse: true,
          defaultValue: 'invalid json',
        })
        public defaultSecret: string | undefined;
      }

      const instance = new TestClass();

      expect(() => instance.defaultSecret).toThrow(SyntaxError);
    });
  });

  it('should use default value if secret is undefined', () => {
    class TestClass {
      @InjectEnvironment({ key: 'nonexistent_secret', defaultValue: 'default' })
      public defaultSecret: string | undefined;
    }

    const instance = new TestClass();

    expect(instance.defaultSecret).toEqual('default');
  });
});
