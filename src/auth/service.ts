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
        
        const { name, id, profileImageUrl } = user

        const finalName = onboardingData.name || user.name
        if (!finalName)
            throw new BadRequestException('이름을 입력해주세요.')
        
        if (onboardingData.tagIds.length > 0){
            const validTagsCount = await this.prisma.tag.findMany({
                where: {
                    id: { in: onboardingData.tagIds }
                }
            })

            if (onboardingData.tagIds.length !== validTagsCount.length)
                throw new BadRequestException("올바르지 않은 태그 포함")
        }

        return await this.prisma.user.create({
            data: {
                id,
                name,
                profileImageUrl,
                tags: {
                    connect: onboardingData.tagIds.map(tagId => ({ id: tagId }))
                }
            },
            include: {
                tags: true
            }
        })
    }
}
