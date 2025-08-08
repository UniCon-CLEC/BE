import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post 
} from "@nestjs/common";
import { TagService } from "./service";
import { CreateTagDto, IdParamDto } from "./dto";
import { Tag } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('태그')
@Controller('tag')
export class TagController{
    constructor(private readonly tagService: TagService) {}

    @Post()
    async createTag(@Body() createTagDto: CreateTagDto){
        return this.tagService.createTag(createTagDto.tags)
    }

    @Delete(':id')
    async deleteTag(@Param() params: IdParamDto){
        return this.tagService.delete(params.id)
    }

    @Get()
    async getAll(): Promise<Tag[]>{
        return this.tagService.getAll()
    }
}