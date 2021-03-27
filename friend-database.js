const friends = [{
    id: 1,
    login: 'bruce@waynecorp.com',
    firstName: 'Bruce',
    lastName: 'Wayne'
}, {
    id: 2,
    login: 'clark.kent@dailyplanet.com',
    firstName: 'Clark',
    lastName: 'Kent'
}];

module.exports = class FriendRepository {
    findAll() {
        return friends;
    }
    
    getOneById(id) {
      return friends.find(item => item.id === id)
    }

    create({login,firstName, lastName }){
      const tempUser = {
        login,
        firstName,
        lastName,
        id: friends[friends.length-1].id + 1
      }
      friends.push(tempUser);
      return tempUser

    }
}