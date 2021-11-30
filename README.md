# Github Searcher

## Description
Write an "Search" Backend API endpoint which eventually collect the data from Github & stores it in REDIS.

## Requirements
- [x] Express
- [x] TypeScript
- [x] Redis
- [x] Swagger
- [x] Create Api Endpoint: Receives a POST request with search type(users or repositories or issues) & search text(mandatory).
- [x] The results will be fetched from the GitHub API & cache it for atleast 2 hours.
- [x] Create Api Endpoint: Clear Backend Caching
- [x] Add Caching so that the same request is not called again.
- [x] Add Swagger Documentation
- [x] Add Caching so that the same request is not called again.

## Setting up the project

> Install dependencies
```
npm install
```
> Run the server
```
npm run serve
```
visit the url: http://localhost:8000/api-docs


## What's in my mind
- I could have used a `swagger jsdoc` library to generate the swagger documentation.
- For Express.js I would rather use NestJS a moder framework support typescript out of the box, and generate swagger documentation,redis, best practices, and much more.
- Generate types and interfaces for the responses for the frontend since we are using swagger.
```shell
openapi-generator generate -i swagger.json -g typescript-axios -o generated --skip-validate-spec --enable-post-process-file
```