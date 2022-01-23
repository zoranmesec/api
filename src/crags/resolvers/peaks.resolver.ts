import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MinCragStatus } from '../decorators/min-crag-status.decorator';
import { FindCragsInput } from '../dtos/find-crags.input';
import { Crag, CragStatus } from '../entities/crag.entity';
import { Peak } from '../entities/peak.entity';
import { CragsService } from '../services/crags.service';
import { PeaksService } from '../services/peaks.service';

@Resolver(of => Peak)
export class PeaksResolver {
  constructor(
    private peaksService: PeaksService,
    private cragsService: CragsService,
  ) {}

  @Query(returns => Peak, { name: 'peak' })
  async getPeak(@Args('slug') slug: string): Promise<Peak> {
    return this.peaksService.getPeak(slug);
  }

  @ResolveField('nrCrags', returns => Number)
  async getNumberOfCrags(@Parent() peak: Peak) {
    return this.peaksService.nrCragsInPeak(peak.id);
  }

  @ResolveField('crags', returns => [Crag])
  async getCrags(
    @MinCragStatus() minStatus: CragStatus,
    @Parent() peak: Peak,
    @Args('input', { nullable: true }) input: FindCragsInput = {},
  ): Promise<Crag[]> {
    input.peakId = peak.id;
    input.minStatus = minStatus;
    input.allowEmpty = true;

    return this.cragsService.find(input);
  }
}
