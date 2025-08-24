import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module';
import { TagModule } from './tag/module';
import { MeModule } from './me/module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CourseModule } from './course/module';
import { InstructorModule } from './instructor/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TagModule,
    MeModule,
    CourseModule,
    InstructorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
