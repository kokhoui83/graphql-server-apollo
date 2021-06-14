const { ApolloServer, gql, PubSub } = require('apollo-server');

const pubsub = new PubSub()

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }


  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  input BookInput {
    title: String
    author: String
  }

  type Mutation {
    createBook(input: BookInput): Book
  }

  type Subscription {
    newBook: Book
  }
`

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]
  
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createBook: (_, { input }) => {
      const newbook = {
        author: input.author,
        title: input.title
      }

      books.push(newbook)

      pubsub.publish('NEW_BOOK', newbook)

      return newbook
    }
  },
  Subscription: {
    newBook: {
      subscribe: () => {
        return pubsub.asyncIterator('NEW_BOOK')
      },
      resolve: payload => {
        return payload
      }
    }
  }
}
  
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      pubsub
    }
  }
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})
    