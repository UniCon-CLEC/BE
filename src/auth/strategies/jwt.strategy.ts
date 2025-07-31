import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { passportJwtSecret } from "jwks-rsa";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseJwtPayload } from "../types/jwt-payload.type";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: configService.get<string>('SUPABASE_JWKS_URL')
            })
        })
    }

    async validate(payload: SupabaseJwtPayload){
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }
        })
         
        if (user) return { onboarded: true, ...user }

        const meta = payload.user_metadata
        const appleName = meta?.fullName ? 
            `${meta.fullName.familyName || ''}${meta.fullName.givenName || ''}` : undefined;

        const socialProfile = {
            name: meta?.fullName || meta?.name || meta?.properties?.nickname || appleName,
            profileImageUrl: meta?.avatar_url || meta?.picture || meta?.properties?.profile_image
        }
        
        return {
            id: payload.sub,
            email: payload.email,
            onboarded: false,
            ...socialProfile
        }
    }
}