import { createYoga, createSchema } from 'graphql-yoga';
import { useGraphQlJit } from '@envelop/graphql-jit';

import type { RequestEvent } from '@sveltejs/kit';

import { users } from '$lib/data';

import schema from '$lib/schema.gql';

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query: {
				// update conven
				users: (source, { first, afterCursor }, context, info) => {
					let endIndex = parseInt(first) + parseInt(afterCursor);
					let hasNextPage = users.length > endIndex;
					let slicedUsers = users.slice(afterCursor - 1, endIndex - 1);
					return {
						users: slicedUsers,
						pageInfo: {
							hasNextPage: hasNextPage,
							startCursor: endIndex
						}
					};
				}
			}
		}
	}),
	plugins: [useGraphQlJit()],
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
