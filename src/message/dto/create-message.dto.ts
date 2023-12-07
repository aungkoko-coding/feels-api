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
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

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
