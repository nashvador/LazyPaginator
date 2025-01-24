<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import { writable } from 'svelte/store';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserType, ResultQuery } from 'lib/types';

	const pageSizeCurrent = 10;
	let currentCurS = 1;

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const usersStore = writable<UserType[] | []>([]);
	const hasNextPage = writable(true);
	const cursorStore = writable(1);
	let parentElement: HTMLElement | undefined;

	const queryUsers = () => {
		const result = queryStore<{ usersQueryAndPageInfo: ResultQuery }>({
			client,
			query: gql`
				query  {
					usersQueryAndPageInfo(first: ${String(pageSizeCurrent)}, afterCursor: ${String(currentCurS)}) {
						individualUsers {
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
				usersStore.update((users) => [...users, ...data.usersQueryAndPageInfo.individualUsers]);
				hasNextPage.set(data.usersQueryAndPageInfo.pageInfo.hasNextPage);
				cursorStore.set(parseInt(data.usersQueryAndPageInfo.pageInfo.startCursor!));
			}
		});

		return result;
	};

	let result = queryUsers();

	const loadmore = async () => {
		currentCurS = $cursorStore;
		result = await queryUsers();
	};

	const handleScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = parentElement!;

		if (scrollTop + clientHeight >= scrollHeight - 10 && $hasNextPage) {
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
			<div style="height:0.5rem" />
		{/if}
	</div>
</div>
