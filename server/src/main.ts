import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import MongoStore from 'connect-mongo';
import crypto from 'crypto';
import 'dotenv/config';
import { NextFunction, Response } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { join } from 'path';
import { cwd } from 'process';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(cwd(), 'public'));
  app.setBaseViewsDir(join(cwd(), 'views'));
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.use(helmet({ contentSecurityPolicy: false }));

  app.use((_req: any, res: Response, next: NextFunction) => {
    res.locals.baseUrl = process.env.BASE_URL;
    res.locals.nonce = crypto.randomBytes(16).toString('hex');
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            (_req, res: Response) => `'nonce-${res.locals.nonce}'`,
            'https://code.jquery.com',
            'https://cdn.jsdelivr.net',
          ],
          imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        },
      },
    }),
  );

  // TODO: set origin to the frontend url once it's deployed.
  app.enableCors({
    origin: '*',
  });

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 1000 * 60 * 60 * 24,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: { secret: process.env.MONGO_SECRET },
      }),
    }),
  );


  const options = new DocumentBuilder()
  .setTitle('Calender App')
  .setDescription('Calender App for CST Students!')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('Add Link', 'Staging')
  .addServer('Add Link', 'Production')
  .addTag('Your API Tag')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 3000);

  console.log(`Serving on: ${await app.getUrl()}`);
}
bootstrap();
