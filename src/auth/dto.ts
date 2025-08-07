import { 
    IsArray, 
    IsInt, 
    IsOptional, 
    IsString, 
    MaxLength, 
    MinLength 
} from "class-validator";

export class OnboardingDto{
    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(10)
    name?: string

    @IsArray()
    @IsInt({ each: true })
    tagIds: number[]
}