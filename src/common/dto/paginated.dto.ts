import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
    @ApiProperty({ isArray: true, description: 'Items for the current page' })
    items: any[];

    @ApiProperty({ description: 'Total number of items' })
    total: number;

    @ApiProperty({ description: 'Current page number' })
    page: number;

    @ApiProperty({ description: 'Number of items per page' })
    limit: number;

    @ApiProperty({ description: 'Total number of pages' })
    totalPages: number;
}
