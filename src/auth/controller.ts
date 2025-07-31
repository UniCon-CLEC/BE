import { Controller } from '@nestjs/common';
import { AuthService } from './service';
@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

}
