export type UserType = {
	id: string;
	name: string;
	email: string;
	avatar: string;
};

export type ResultQuery = {
	users: UserType[];
	pageInfo: {
		hasNextPage: boolean;
		startCursor: string | null;
	};
};
