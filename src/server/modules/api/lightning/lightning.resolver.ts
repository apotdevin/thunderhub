import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { v5 as uuidv5 } from 'uuid';
import { NodeService } from '../../node/node.service';
import { UserId } from '../../security/security.types';
import { CurrentUser } from '../../security/security.decorators';
import { AccessIds, LightningQueries } from './lightning.types';

@Resolver()
export class LightningQueryRoot {
  @Query(() => LightningQueries)
  async lightning() {
    return {};
  }
}

@Resolver(() => LightningQueries)
export class LightningQueriesResolver {
  constructor(private nodeService: NodeService) {}

  @ResolveField(() => String)
  id(): string {
    return uuidv5(LightningQueriesResolver.name, uuidv5.URL);
  }

  @ResolveField(() => AccessIds)
  async get_access_ids(@CurrentUser() { id }: UserId): Promise<AccessIds> {
    return this.nodeService.getAccessIds(id);
  }
}
