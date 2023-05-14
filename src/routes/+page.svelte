<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import { writable } from 'svelte/store';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserType, ResultQuery } from 'lib/types';

	const pageSizeCurrent = '10';
	let currentCurS = '1';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const usersStore = writable<UserType[] | []>([]);
	const hasNextPage = writable(true);
	let parentElement: HTMLElement | undefined;

	const queryUsers = () => {
		const result = queryStore<{ users: ResultQuery }>({
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
				hasNextPage.set(data.users.pageInfo.hasNextPage);
			}
		});

		return result;
	};

	let result = queryUsers();

	const loadmore = async () => {
		currentCurS += 10;
		result = await queryUsers();
	};

	const handleScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = parentElement!;

		if (scrollTop + clientHeight >= scrollHeight && hasNextPage) {
			loadmore();
		}
	};
</script>

<div class="w-full h-full overflow-scroll" on:scroll={handleScroll} bind:this={parentElement}>
	<div class="flex flex-col gap-4 items-center p-4">
		{#each $usersStore as user (user.id)}
			<User {user} />
		{/each}
		{#if $result.fetching}
			<Loader />
		{/if}
		{#if $hasNextPage}
			<div style="height:100px" />
		{/if}
	</div>
</div>
