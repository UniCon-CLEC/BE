import { 
    BadRequestException, 
    Injectable, 
    NotFoundException 
} from "@nestjs/common";
import { Tag } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTagDto } from "./dto";

@Injectable()
export class TagService{
    constructor(private readonly prisma: PrismaService) {}

    async createTag(tags: CreateTagDto['tags']): Promise<Tag[]>{
        const parentIds = tags
            .map((tag) => tag.parentId)
            .filter((id): id is number => id !== undefined)

        const uniqueParentIds = [...new Set(parentIds)]
        
        return this.prisma.$transaction(async (tx) => {
            const parentTags = await tx.tag.findMany({
                where: { id: { in: uniqueParentIds } }
            })

            const parentTagMap = new Map(parentTags
                .map((e) => [e.id, e]
            ))

            for (const tagDto of tags){
                if (tagDto.parentId){
                    const parent = parentTagMap.get(tagDto.parentId)
                    if (!parent || parent.parentId !== null)
                        throw new BadRequestException(`${tagDto.parentId}는 유효한 최상위 태그가 아닙니다.`)
                }
            }

            await tx.tag.createMany({
                data: tags,
                skipDuplicates: true
            })

            const createdTags = tags.map(t => t.name)

            return await tx.tag.findMany({
                where: {
                    name: { in: createdTags }
                }
            })
        })
    }

    async getAll(): Promise<Tag[]> {
        return this.prisma.tag.findMany({
            where: { parentId: null },
            include: { children: true }
        })
    }

    async delete(id: number): Promise<{message: string}>{
        const target = await this.prisma.tag.findUnique({ where: { id } })
        if (!target)
            throw new NotFoundException(`ID가 ${id}인 태그를 찾을 수 없습니다.`)

        const childCount = await this.prisma.tag.count({
            where: { parentId: id }
        })

        if (childCount > 0)
            throw new BadRequestException('자식 태그가 있는 태그는 삭제할 수 없습니다.')

        await this.prisma.tag.delete({ where: {id} })
        return { message: `ID:${id} 태그 삭제 성공` }
    }

    
}