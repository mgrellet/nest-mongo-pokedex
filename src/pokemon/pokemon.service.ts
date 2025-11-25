import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PokemonService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    const existsPokemonByNo = await this.pokemonModel.findOne({ no: createPokemonDto.no });
    const existsPokemonByName = await this.pokemonModel.findOne({ name: createPokemonDto.name });
    if (existsPokemonByNo || existsPokemonByName) {
      throw new BadRequestException('Pokemon already exists');
    }

    const pokemon = await this.pokemonModel.create(createPokemonDto);
    return pokemon;
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {

    let pokemon: Pokemon | undefined;

    if (!Number.isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: Number(term) }) as Pokemon;
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term) as Pokemon;
    }

    // Name
    pokemon = pokemon ?? await this.pokemonModel.findOne({ name: term.toLowerCase().trim() }) as Pokemon;


    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      const existsPokemonByName = await this.findOne(updatePokemonDto.name);
      if (existsPokemonByName) {
        throw new BadRequestException('Pokemon already exists');
      }

      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    if (updatePokemonDto.no) {
      const existsPokemonByNo = await this.findOne(updatePokemonDto.no.toString());
      if (existsPokemonByNo) {
        throw new BadRequestException('Pokemon already exists');
      }
      pokemon.no = updatePokemonDto.no;
    }
    await pokemon.updateOne(updatePokemonDto, { new: true });
    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id "${id}" not found`);
    }
    return { message: 'Pokemon deleted successfully' };
  }
}
