import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';

export class PaginationQueryDto {
    @ApiProperty({ required: false, example: 1, default: 1 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page = 1;

    @ApiProperty({ required: false, example: 10, default: 10 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    limit = 10;
}
