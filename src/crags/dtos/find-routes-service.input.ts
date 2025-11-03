import { User } from '../../users/entities/user.entity';
import { FindRoutesInput } from './find-routes.input';

export class FindRoutesServiceInput extends FindRoutesInput {
  id?: string;
  sectorId?: string;
  sectorIds?: string[];
  user?: User;
  cragId?: string;
}
