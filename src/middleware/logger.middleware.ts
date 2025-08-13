import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength}bytes - ${ip}`;
      
      if (statusCode >= 500)
        this.logger.error(logMessage);
      else if (statusCode >= 400)
        this.logger.warn(logMessage)
      else
        this.logger.log(logMessage)

      if(['POST', 'PUT', 'PATCH'].includes(method)){
        this.logger.debug(JSON.stringify(req.body))
      }
    });

    next();
  }
}
