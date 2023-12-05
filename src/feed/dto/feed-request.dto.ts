import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class FeedRequestDto {
  @IsOptional()
  @IsDateString()
  timestamp?: string;

  @IsOptional()
  @IsNumber()
  from?: number;

  @IsOptional()
  @IsNumber()
  take?: number;
}
