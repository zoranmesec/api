import { Resolver, Mutation, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { Crag } from '../entities/crag.entity';
import { CreateCragInput } from '../inputs/create-crag.input';
import { UpdateCragInput } from '../inputs/update-crag.input';
import { CragsService } from '../services/crags.service';
import { AuditInterceptor } from 'src/audit/interceptors/audit.interceptor';
import { Country } from '../entities/country.entity';
import { CountriesService } from '../services/countries.service';

@Resolver(() => Crag)
export class CragsResolver {
    constructor(
        private cragsService: CragsService,
        private countriesService: CountriesService
    ) { }

    @Query(() => [Crag])
    crags(@Args('country', { nullable: true }) country?: string): Promise<Crag[]> {

        const params: any = {};

        if (country != null) {
            params.country = country;
        }

        return this.cragsService.find(params);
    }

    @Roles('admin')
    @UseInterceptors(AuditInterceptor)
    @Mutation(() => Crag)
    async createCrag(@Args('input', { type: () => CreateCragInput }) input: CreateCragInput): Promise<Crag> {
        return this.cragsService.create(input);
    }

    @Roles('admin')
    @UseInterceptors(AuditInterceptor)
    @Mutation(() => Crag)
    async updateCrag(@Args('input', { type: () => UpdateCragInput }) input: UpdateCragInput): Promise<Crag> {
        return this.cragsService.update(input);
    }

    @Roles('admin')
    @UseInterceptors(AuditInterceptor)
    @Mutation(() => Boolean)
    async deleteCrag(@Args('id') id: string): Promise<boolean> {
        return this.cragsService.delete(id)
    }

    @ResolveField('country', () => Country)
    async getRoles(@Parent() crag: Crag): Promise<Country> {
        return this.countriesService.get(crag.country.id)
    }
}
