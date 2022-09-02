# GraphQL Server using Apollo

## Dependencies
- node 18.7.0

## Setup
- Install node dependencies
```
npm install
```

## Run locally
- Start service
```
npm start
```
- View Apollo Server Playground
```
open browser at http://localhost:4000
```

### Sample query
- Get all books
```
query {
  books {
    author
    title
  }
}
```
- Create new book
```
mutation {
  createBook(input: {
    title: "beast boy",
    author: "adam savage"
  }), {
    title
    author
  }
}
```
- Subscribe to new book
```
subscription {
  newBook {
    author
    title
  }
}
```

# TODO
- Update to apollo server v3
  - https://www.apollographql.com/docs/apollo-server/migration/