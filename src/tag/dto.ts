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
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(8)
    name: string

    @IsOptional()
    @IsInt()
    parentId?: number
}

export class CreateTagDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TagItemDto)
    tags: TagItemDto[];
}

export class IdParamDto {
    @Type(() => Number)
    @IsInt({ message: 'ID는 정수여야 합니다.'})
    @Min(1, { message: 'ID는 자연수여야 합니다.'})
    id: number
}