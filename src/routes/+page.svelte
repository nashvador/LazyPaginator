<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import { writable } from 'svelte/store';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserType } from 'lib/types';

	const pageSizeCurrent = 10;
	let currentCurS = 1;
	let isLoading = false;

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const usersStore = writable([]);

	const queryUsers = () => {
		const result = queryStore<{ users: userResult }>({
			client,
			query: gql`
				query  {
					users(first: ${pageSizeCurrent}, afterCursor: ${currentCurS}) {
						users {
							id
							name
							avatar
							email
						}
						pageInfo {
							hasNextPage
							startCursor
						}
					}
				}
			`,
			variables: { first: pageSizeCurrent, afterCursor: currentCurS }
		});

		result.subscribe(({ data }) => {
			if (data) {
				usersStore.update((users) => [...users, ...data.users.users]);
			}
		});

		return result;
	};

	let result = queryUsers();

	const loadmore = () => {
		currentCurS += 10;
		result = queryUsers();
	};
</script>

<div class="w-full h-full overflow-scroll">
	<div class="flex flex-col gap-4 items-center p-4">
		{#if $result.fetching}
			<Loader />
		{:else}
			{#each $usersStore as user (user.id)}
				<User {user} />
			{/each}
			{console.log($result, $usersStore)}
			<button on:click={loadmore}>Load More</button>
		{/if}
	</div>
</div>
