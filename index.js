const { ApolloServer, gql, PubSub } = require('apollo-server')

// A schema is a collection of type definitions (hence "typeDefs")
const typeDefs = gql`
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # Query
  type Query {
    books: [Book]
  }

  # Input type for mutation
  input BookInput {
    title: String
    author: String
  }

  # Mutation
  type Mutation {
    createBook(input: BookInput): Book
  }

  # Subscription
  type Subscription {
    newBook: Book!
  }
`

// In-memory database using list
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

const pubsub = new PubSub()

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createBook: (_, { input }) => {
      // create new book
      const newbook = {
        author: input.author,
        title: input.title
      }
      // store book to list
      books.push(newbook)
      // notify subscription "newBook"
      pubsub.publish('NEW_BOOK', newbook)

      return newbook
    }
  },
  Subscription: {
    newBook: {
      subscribe: () => {
        // handle topic subscription
        return pubsub.asyncIterator('NEW_BOOK')
      },
      resolve: payload => {
        // handle notification for topic
        return payload
      }
    }
  }
}
  
// instantiate apollo server
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

// start server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})
    