import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class YoutubeLink {
  @IsString()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  url: string;

  @IsBoolean()
  @IsOptional()
  public?: boolean;
}

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => YoutubeLink)
  youtubeLinks?: Array<YoutubeLink>;
}
