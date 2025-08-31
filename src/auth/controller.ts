import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { OnboardingDto } from './dto';
import { UserInRequest } from './types/user-request.type';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ) {}

    @Post('onboard')
    @UseGuards(JwtAuthGuard)
    async onboard(
        @User() user: UserInRequest,
        @Body() onboaringDto: OnboardingDto
    ) {
        return this.authService.onboard(user, onboaringDto)
    }
}
