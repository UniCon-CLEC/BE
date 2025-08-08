import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { 
    ArrayMinSize, 
    ArrayNotEmpty, 
    IsArray, 
    IsInt, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    MaxLength, 
    Min, 
    MinLength, 
    ValidateNested 
} from "class-validator";

export class TagItemDto {
    @ApiProperty({ description: '태그 이름 (2~8자)', example: '데이터분석' })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(8)
    name: string

    @ApiPropertyOptional({ description: '부모 태그 ID (최상위 태그는 생략)', example: 1 })
    @IsOptional()
    @IsInt()
    parentId?: number
}

export class CreateTagDto {
    @ApiProperty({
        type: [TagItemDto],
        description: '생성할 태그 정보 배열',
    })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TagItemDto)
    tags: TagItemDto[];
}

export class IdParamDto {
    @ApiProperty({ description: '태그 ID (양의 정수)', example: 123 })
    @Type(() => Number)
    @IsInt({ message: 'ID는 정수여야 합니다.'})
    @Min(1, { message: 'ID는 자연수여야 합니다.'})
    id: number
}

export class TagResponseDto {
    @ApiProperty({ description: '태그 ID' })
    id: number;

    @ApiProperty({ description: '태그 이름' })
    name: string;

    @ApiPropertyOptional({ description: '부모 태그 ID (최상위 태그는 null)', nullable: true })
    parentId: number | null;

    @ApiProperty({ type: () => [TagResponseDto] })
    children: TagResponseDto[];
}