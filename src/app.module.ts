import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
    MongooseModule.forRoot(`${envConfig().mongoStringConnection}` ||'', {
      dbName: 'pokedex',
    }),
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
