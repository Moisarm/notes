import { IsString, IsOptional, IsArray, IsUUID } from "class-validator";

export class create_note_validation {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  tag_ids?: string[];
}

export class update_note_validation {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  tag_ids?: string[];
}
