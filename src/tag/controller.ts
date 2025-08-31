import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post 
} from "@nestjs/common";
import { TagService } from "./service";
import { CreateTagDto, IdParamDto, TagResponseDto } from "./dto";
import { Tag } from "@prisma/client";
import { 
    ApiOperation, 
    ApiParam, 
    ApiResponse, 
    ApiTags 
} from "@nestjs/swagger";

@ApiTags('태그')
@Controller('tag')
export class TagController{
    constructor(private readonly tagService: TagService) {}
    /*
    @Post()
    @ApiOperation({ summary: '태그 생성' })
    @ApiResponse({ status: 201, description: '성공' })
    @ApiResponse({ status: 400, description: '유효성 검사 실패' })
    async createTag(@Body() createTagDto: CreateTagDto){
        return this.tagService.createTag(createTagDto.tags)
    }

    @Delete(':id')
    @ApiOperation({ summary: '태그 삭제' })
    @ApiParam({ name: 'id', description: '삭제할 태그 ID' })
    @ApiResponse({ status: 200, description: '성공' })
    @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
    @ApiResponse({ status: 400, description: '잘못된 요청 (ID 형식 오류 또는 자식 태그 존재 등)' })
    async deleteTag(@Param() params: IdParamDto){
        return this.tagService.delete(params.id)
    }
    */

    @Get()
    @ApiOperation({ summary: '태그 전체 조회' })
    @ApiResponse({
        status: 200,
        description: '성공. 태그 목록을 계층 구조로 반환합니다.',
        type: [TagResponseDto],
    })
    async getAll(): Promise<Tag[]>{
        return this.tagService.getAll()
    }
}