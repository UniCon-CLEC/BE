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
import { MeDto, MeResultDto, MyCrewDto, MyFundingDto, MyTrackDto } from './dto';

@ApiTags('Me (내 정보)')
@ApiBearerAuth('access-token')
@Controller('me')
@UseGuards(JwtAuthGuard, IsActiveGuard)
export class MeController {
  constructor(private meService: MeService) {}

  @Get('all')
  @ApiOperation({
    summary: '내 정보 모두 조회',
    description: '현재 로그인된 사용자의 모든 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: MeResultDto,
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 403, description: '활성화되지 않은 사용자' })
  getMeAll(@User() user: AuthenticatedUser) {
    return this.meService.getMe(user.id);
  }

  @Get()
  @ApiOperation({
    summary: '내 정보 조회',
    description: '현재 로그인된 사용자의 기본 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: MeDto,
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 403, description: '활성화되지 않은 사용자' })
  getMe(@User() user: AuthenticatedUser) {
    return this.meService.getMeInfo(user.id);
  }

  @Get('track')
  @ApiOperation({
    summary: '내 트랙 정보 조회',
    description: '현재 로그인된 사용자의 트랙 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: [MyTrackDto],
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 403, description: '활성화되지 않은 사용자' })
  getMeTrack(@User() user: AuthenticatedUser) {
    return this.meService.getMeTrack(user.id);
  }

  @Get('crew')
  @ApiOperation({
    summary: '내 크루 정보 조회',
    description: '현재 로그인된 사용자의 크루 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: [MyCrewDto],
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 403, description: '활성화되지 않은 사용자' })
  getMeCrew(@User() user: AuthenticatedUser) {
    return this.meService.getMeCrew(user.id);
  }

  @Get('funding')
  @ApiOperation({
    summary: '내 펀딩 정보 조회',
    description: '현재 로그인된 사용자의 펀딩 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: [MyFundingDto],
  })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 403, description: '활성화되지 않은 사용자' })
  getMeFunding(@User() user: AuthenticatedUser) {
    return this.meService.getMeFunding(user.id);
  }
}
