import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseJwtPayload } from '../types/jwt-payload.type';
import { NewUser, UserInRequest } from '../types/user-request.type';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('SUPABASE_JWKS_URL'),
      }),
    });
  }

  async validate(payload: SupabaseJwtPayload): Promise<UserInRequest> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (user) return { onboarded: true, ...user };

    const meta = payload.user_metadata;
    const appleName = meta?.fullName
      ? `${meta.fullName.familyName || ''}${meta.fullName.givenName || ''}`
      : undefined;

    const finalName = meta?.name || meta?.properties?.nickname || appleName
    const finalProfileImageUrl = meta?.avatar_url || meta?.picture || meta?.properties?.profile_image

    const res: NewUser = {
      id: payload.sub,
      email: payload.email,
      onboarded: false,
      name: finalName,
      profileImageUrl: finalProfileImageUrl
    };

    return res
  }
}
