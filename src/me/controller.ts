import { 
  Controller, 
  Get, 
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../auth/types/user-request.type';
import { MeService } from './service';
import { IsActiveGuard } from 'src/auth/guards/is-active.guard';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger';
import { MeResultDto } from './dto';

@ApiTags('Me (내 정보)')
@ApiBearerAuth('access-token')
@Controller('me')
@UseGuards(JwtAuthGuard, IsActiveGuard)
export class MeController {
  constructor(private meService: MeService) {}

  @Get()
  @ApiOperation({
    summary: '내 정보 조회',
    description: '현재 로그인된 사용자의 상세 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: MeResultDto,
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 403, description: '활성화되지 않은 사용자' })
  getMe(@User() user: AuthenticatedUser) {
    return this.meService.getMe(user.id);
  }
}