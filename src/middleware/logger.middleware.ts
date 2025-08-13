import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `[${method}] : [${statusCode} | [${contentLength}]] / ${originalUrl}`
      );

      if (method === 'POST') {
        this.logger.log(`Request Body: ${JSON.stringify(req.body)}`);
      }
    });

    next();
  }
}
