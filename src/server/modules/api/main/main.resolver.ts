import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class MainResolver {
  @Query(() => String)
  async getHello() {
    return 'Hello';
  }
}
