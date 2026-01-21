import "dotenv/config";

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  await app.listen(PORT).then(() => console.log(`Server running on port ${PORT}`)).catch(console.error);
}
bootstrap();
