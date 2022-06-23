import { ConfigService } from '@nestjs/config';

class Config {
  private config: ConfigService;

  constructor() {
    this.config = new ConfigService();
  }

  public get<T = any>(propertyPath: string, defaultValue?: T) {
    return this.config.get(propertyPath, defaultValue);
  }

  public telegramToken(): string {
    return this.get('TOKEN');
  }
}

export const config = new Config();
