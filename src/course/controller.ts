import { 
  Controller, 
  Get, 
  NotFoundException, 
  Param 
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseService } from './service';
import {
  TrackCourseDto,
  CrewCourseDto,
  FundingCourseDto,
} from './dto';

@ApiTags('Course (코스)')
@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('track')
  @ApiOperation({ summary: '모든 트랙 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [TrackCourseDto] })
  getAllTracks() {
    return this.courseService.getAllTracks();
  }

  @Get('crew')
  @ApiOperation({ summary: '모든 크루 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [CrewCourseDto] })
  getAllCrews() {
    return this.courseService.getAllCrews();
  }

  @Get('funding')
  @ApiOperation({ summary: '모든 펀딩 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: [FundingCourseDto] })
  getAllFundings() {
    return this.courseService.getAllFundings();
  }

  @Get('track/:courseId')
  @ApiOperation({ summary: '특정 트랙 상세 조회' })
  @ApiResponse({ status: 200, description: '성공', type: TrackCourseDto })
  @ApiResponse({ status: 404, description: '트랙을 찾을 수 없음' })
  async getTrackByCourseId(@Param('courseId') courseId: string) {
    const track = await this.courseService.getTrackByCourseId(courseId);
    if (!track) {
      throw new NotFoundException(`Track with course ID ${courseId} not found`);
    }
    return track;
  }

  @Get('crew/:courseId')
  @ApiOperation({ summary: '특정 크루 상세 조회' })
  @ApiResponse({ status: 200, description: '성공', type: CrewCourseDto })
  @ApiResponse({ status: 404, description: '크루를 찾을 수 없음' })
  async getCrewByCourseId(@Param('courseId') courseId: string) {
    const crew = await this.courseService.getCrewByCourseId(courseId);
    if (!crew) {
      throw new NotFoundException(`Crew with course ID ${courseId} not found`);
    }
    return crew;
  }

  @Get('funding/:courseId')
  @ApiOperation({ summary: '특정 펀딩 상세 조회' })
  @ApiResponse({ status: 200, description: '성공', type: FundingCourseDto })
  @ApiResponse({ status: 404, description: '펀딩을 찾을 수 없음' })
  async getFundingByCourseId(@Param('courseId') courseId: string) {
    const funding = await this.courseService.getFundingByCourseId(courseId);
    if (!funding) {
      throw new NotFoundException(`Funding with course ID ${courseId} not found`);
    }
    return funding;
  }
}