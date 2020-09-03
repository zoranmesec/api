import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from 'src/audit/audit.module';

import { CountriesResolver } from './resolvers/countries.resolver';
import { CountriesService } from './services/countries.service';
import { Country } from 'src/crags/entities/country.entity';

import { CragsResolver } from './resolvers/crags.resolver';
import { CragsService } from './services/crags.service';
import { Crag } from './entities/crag.entity';
import { SectorsService } from './services/sectors.service';
import { SectorsResolver } from './resolvers/sectors.resolver';
import { Sector } from './entities/sector.entity';
import { Route } from './entities/route.entity';
import { RoutesService } from './services/routes.service';
import { RoutesResolver } from './resolvers/routes.resolver';
import { Area } from './entities/area.entity';
import { AreasService } from './services/areas.service';
import { AreasResolver } from './resolvers/areas.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Area, Crag, Country, Sector, Route]), AuditModule],
  providers: [CragsResolver, CragsService, CountriesResolver, CountriesService, SectorsResolver, SectorsService, RoutesService, RoutesResolver, AreasService, AreasResolver],
})
export class CragsModule { }
