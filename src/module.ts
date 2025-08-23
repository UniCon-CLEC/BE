import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/module';
import { TagModule } from './tag/module';
import { MeModule } from './me/module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TrackModule } from './track/module';
import { CrewModule } from './crew/module';
import { InstructorModule } from './instructor/instructor.module';

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
    TrackModule,
    CrewModule,
    InstructorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
