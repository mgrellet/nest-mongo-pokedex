import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator"

export class CreatePokemonDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number
}
