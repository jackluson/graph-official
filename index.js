const { graphql, buildSchema } = require('graphql');
const UserDatabase = require('./user-database')

const userDatabase = new UserDatabase()
const schema = buildSchema(`
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
    resolve: Human
  }

  type Human implements Animal {
    login: String
    id: ID
    lastName: String
  }

  type User implements Animal {
    id: ID
    login: String
    firstName: String
    friends(count: Int): [Friend]
  }

  union Unimal =  Human | User

  type Mutation {
    createUser(login: String!): Unimal!
  }

`);

const global = {
  hello: () => 'Hello world!',
  user: (payload, ...args) => {
    // variableValues: { first: 3 }
    console.log('args', args)

    return userDatabase.getOneById(payload.id)
  },
  createUser: (payload) => {
    console.log('payload', payload)
    return {
      login: 'jisdf',
      lastName: 'jisf'
    }
  }
  
  
};
//1.
// graphql(schema, '{ hello }', global).then((response) => {
//   console.log(response);
// });
// query userFetch($withFriends: Boolean=true, $count: Int=3) {
//   userOne: user(id: 1) {
//     ...comparisonFields
//   }
//   userTwo: user(id: 2) {
//     ...comparisonFields 
//   }
// }

// fragment comparisonFields on User {
//   id
//   login
//   friends (count: $count)@include(if: $withFriends) {
//     id
//   }
// }
//2.
const gqlStr =
  `
mutation createUserForEpisode($login: String="qq.com") {
  createUser(login: $login) {
    login
    ... on Human {
      lastName
    }

  }
}
`

const resolverMap = {
  Animal: {
    __resolveType(obj, context, info){
      console.log('obj', obj)
      if(obj.lastName){
        return 'Human';
      }

      if(obj.firstName){
        return 'User';
      }

      return null;
    },
  },
};

graphql(schema, gqlStr, global, this,
  {
    // withFriends: true,
    // count: 4,
    "login": "JEDI",
    // "review": {
    //   "login": "This is a great movie!"
    // }
  },
  undefined,
  resolverMap
).then((response) => {
  console.log('response', response);
});