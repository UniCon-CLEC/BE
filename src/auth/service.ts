import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnboardingDto } from './dto';
import { User } from '@prisma/client';
import { UserInRequest } from './types/user-request.type';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async onboard(
        user: UserInRequest,
        onboardingData: OnboardingDto
    ): Promise<User>{
        if (user.onboarded)
            throw new ConflictException('이미 온보딩을 완료한 계정입니다.')
        
        const { id, profileImageUrl } = user
        const { name: onboardingName, tagIds } = onboardingData
        
        const finalName = (onboardingName || user.name)?.trim();
        if (!finalName)
            throw new BadRequestException('이름을 입력해주세요.')

        if (tagIds && tagIds.length > 0){
            const validTagsCount = await this.prisma.tag.count({
                where: {
                    id: { in: tagIds }
                }
            })

            if (tagIds.length !== validTagsCount)
                throw new BadRequestException("올바르지 않은 태그 포함")
        }

        return await this.prisma.user.create({
            data: {
                id,
                name: finalName,
                email: user.email || `${id}@clec.me`,
                profileImageUrl,
                tags: {
                    connect: tagIds?.map(tagId => ({ id: tagId }))
                }
            },
            include: {
                tags: true
            }
        })
    }
}
