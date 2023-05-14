# Lazy Paginator

This is a lazy paginator - as soon as you scroll down it displays more items.

## Technologies Chosen

- Framework: Svelte
- Testing
  - Cypress
- Backend-For-Frontend: GraphQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure that you have a version of node that is at 16 or past it. If you do not go to this [website](https://nodejs.org/en/) and click on the version recommended for most users. Also make sure that you have an IDE like Visual Studio Code so that you can edit if you want to!

### Installing

In your terminal type these steps in to get the code running:

```
git clone https://github.com/nashvador/LazyPaginator.git
cd LazyPaginator
npm install
npm run dev
```

## Running Tests

Before running your tests make sure that you have all the prerequisites and have ran `npm install` prior to everything.

## Issues I had and How I Solved Them

1. The first issue was getting 10 of the users to display. So I used a variable first to grab the amount of users needed and incremented the cursor to know when to start
2. Second issue was updating the results when the variables updated. To solve this, I used svelte's native $ and then updated the variables.
3. Another issue was updating the store (I only wanted to append the next 10 users to the list). So I used Svelte's native store method and subscribe to update the store.
4. The final issue I had was preventing the loader from displaying at the end. Basically I used a writable state (hasNextPage) to prevent the query from taking place.

## Thank You!

Thank you for viewing my project.
