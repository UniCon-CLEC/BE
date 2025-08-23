import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseService } from './service';
import { TrackDto, CrewDto, CourseSessionDto } from './dto';

@ApiTags('Course (코스)')
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('track')
  @ApiOperation({ summary: '모든 트랙 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [TrackDto] })
  getAllTracks() {
    return this.courseService.getAllTracks();
  }

  @Get('crew')
  @ApiOperation({ summary: '모든 크루 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [CrewDto] })
  getAllCrews() {
    return this.courseService.getAllCrews();
  }

  @Get('track/:courseId')
  @ApiOperation({ summary: '특정 트랙 상세 조회' })
  @ApiResponse({ status: 200, description: '성공', type: TrackDto })
  @ApiResponse({ status: 404, description: '트랙을 찾을 수 없음' })
  async getTrackById(@Param('courseId') courseId: string) {
    const track = await this.courseService.getTrackByCourseId(courseId);
    if (!track) {
      throw new NotFoundException(`Track with course ID ${courseId} not found`);
    }
    return track;
  }

  @Get('crew/:courseId')
  @ApiOperation({ summary: '특정 크루 상세 조회' })
  @ApiResponse({ status: 200, description: '성공', type: CrewDto })
  @ApiResponse({ status: 404, description: '크루를 찾을 수 없음' })
  async getCrewById(@Param('courseId') courseId: string) {
    const crew = await this.courseService.getCrewByCourseId(courseId);
    if (!crew) {
      throw new NotFoundException(`Crew with course ID ${courseId} not found`);
    }
    return crew;
  }

  // TODO: Add AuthGuard for check permission
  @Get('track/:courseId/sessions')
  @ApiOperation({ summary: '특정 트랙의 강의 세션 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [CourseSessionDto] })
  @ApiResponse({ status: 404, description: '트랙을 찾을 수 없음' })
  getTrackSessions(@Param('courseId') courseId: string) {
    return this.courseService.getTrackSessionsByCourseId(courseId);
  }

  // TODO: Add AuthGuard for check permission
  @Get('crew/:courseId/sessions')
  @ApiOperation({ summary: '특정 크루의 강의 세션 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [CourseSessionDto] })
  @ApiResponse({ status: 404, description: '크루를 찾을 수 없음' })
  getCrewSessions(@Param('courseId') courseId: string) {
    return this.courseService.getCrewSessionsByCourseId(courseId);
  }
}
