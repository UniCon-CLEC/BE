import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstructorService } from './service';
import { InstructorDto, CreateTrackDto, CreateCrewDto } from './dto';

@ApiTags('Instructor (강사)')
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Get('/:id')
  @ApiOperation({ summary: '특정 강사 정보 조회' })
  @ApiResponse({ status: 200, description: '성공', type: InstructorDto })
  @ApiResponse({ status: 404, description: '강사를 찾을 수 없음' })
  async getInstructorById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.instructorService.getInstructorById(id);
  }

  @Post(':id/tracks')
  @ApiOperation({ summary: '강사의 새 트랙 코스 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  async createTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createTrackDto: CreateTrackDto,
  ) {
    return this.instructorService.createTrack(id, createTrackDto);
  }

  @Post(':id/crews')
  @ApiOperation({ summary: '강사의 새 크루 코스 생성' })
  @ApiResponse({ status: 201, description: '성공' })
  async createCrew(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createCrewDto: CreateCrewDto,
  ) {
    return this.instructorService.createCrew(id, createCrewDto);
  }
}

