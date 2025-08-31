import { Module } from '@nestjs/common';
import { AuthService } from './service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SUPABASE_JWT_SECRET')
      })
    })
  ],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: JwtStrategy,
      useFactory: (prisma: PrismaService, configService: ConfigService) => {
        return new JwtStrategy(prisma, configService);
      },
      inject: [PrismaService, ConfigService],
    },
  ],
  controllers: [AuthController]
})
export class AuthModule {}
