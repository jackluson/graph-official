const { graphql } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const bodyParser = require("body-parser");
const UserDatabase = require("./user-database");

const userDatabase = new UserDatabase();
const typeDefs = `
  type Query {
    hello: String,
    user(id: Int!): User
  }

  type Friend {
    id: ID
    login: String
    lastName: String
    firstName: String
  }

  interface Animal {
    id: ID
    login: String
  }

  type Human implements Animal {
    id: ID
    login: String
    lastName: String
  }

  type User implements Animal {
    id: ID
    login: String
    firstName: String
    friends(count: Int): [Friend]
  }

  union UnionAnimal = Human | User


  type Mutation {
    createUser(login: String!): UnionAnimal
  }

`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    user: (root, payload, ...args) => {
      // variableValues: { first: 3 }
      // console.log("args", args);
      return userDatabase.getOneById(payload.id);
    },
  },
  Mutation: {
    createUser: (payload) => {
      console.log("payload", payload);
      return {
        id: 23,
        login: "jisdf",
        lastName: "jisf",
      };
    },
  },

  Animal: {
    __resolveType(obj, context, info) {
      if (obj.id) {
        return "Animal";
      }
      return null;
    },
  },

  UnionAnimal: {
    __resolveType(obj, context, info) {
      console.log(obj, context);
      if (obj.lastName) {
        return "Human";
      }
      if (obj.firstName) {
        return "User";
      }
      return null;
    },
  },
  // AnimalResult: {
  //   __resolveType(...args) {
  //     console.log("args", args);
  //     return "Human";
  //   },
  // },
};

const gqlStr = `

fragment comparisonFields on User {
  id
  login
  friends (count: $count)@include(if: $withFriends) {
    id
  }
}

query userFetch($withFriends: Boolean=true, $count: Int=3) {
  userOne: user(id: 1) {
    ...comparisonFields
  }
  userTwo: user(id: 2) {
    ...comparisonFields
  }
}

fragment test1 on Animal {
  id
  login
}
mutation createUserForEpisode($login: String="qq.com") {
  createUser(login: $login) {
    ...test1
    ... on Human {
      lastName
    }
    ... on User {
      firstName
    }
  }
}
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  // resolverValidationOptions: {
  //   requireResolversForResolveType: false
  // }
});

// console.log("schema-->", schema);

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), (...args) => {
  console.log("🚀 ~ file: index.js ~ line 149 ~ app.use ~ args", args);
  const fn = graphqlExpress({ schema });
  return fn(...args);
});

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});

// manual request
graphql(
  schema,
  gqlStr,
  {},
  this,
  {
    withFriends: true,
    count: 4,
    login: "JEDI",
    // "review": {
    //   "login": "This is a great movie!"
    // }
  },
  "userFetch"
).then((response) => {
  console.log("response", response);
});
