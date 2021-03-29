const FriendsDatabase = require("./friend-database");

const friendsDatabase = new FriendsDatabase();

const users = [
  {
    id: 1,
    login: "bruce@waynecorp.com",
    firstName: "Bruce",
    lastName: "Wayne",
    friends: [],
  },
  {
    id: 2,
    login: "clark.kent@dailyplanet.com",
    firstName: "Clark",
    lastName: "Kent",
    friends: [],
  },
];

module.exports = class UserRepository {
  findAll() {
    return users;
  }

  getOneById(id) {
    const targetUser = users.find((item) => item.id === id);
    return {
      ...targetUser,
      friends: [friendsDatabase.getOneById(1)],
    };
  }

  create({ login, firstName, lastName }) {
    const tempUser = {
      login,
      firstName,
      lastName,
      id: users[users.length - 1].id + 1,
    };
    users.push(tempUser);
    return tempUser;
  }
};
