import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  min,
  MinLength,
} from "class-validator";
import type {
  register_dto,
  update_user_dto,
  user_login_dto,
} from "../../../application/dto/auth.dto";

export class user_login_validation implements user_login_dto {
  @IsNotEmpty({ message: "Username is Required" })
  @IsString()
  username!: string;

  @IsNotEmpty({ message: "Password is Required" })
  @IsString()
  password!: string;
}

export class register_validation implements register_dto {
  @IsString()
  @IsNotEmpty({ message: "Username is Required" })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class update_user_validation implements update_user_dto {
  @IsOptional()
  @IsString()
  username?: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string | undefined;
}
