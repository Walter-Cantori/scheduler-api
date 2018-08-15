const mongoose = require('mongoose');
const factoryGirl = require('factory-girl');
const faker = require('faker');

const { factory } = factoryGirl;
faker.setLocale = 'pt_BR';
console.log(faker.date.future(0));

factory.setAdapter(new factoryGirl.MongooseAdapter());

// User
factory.define('User', mongoose.model('User'), {
  name: faker.name.findName(),
  password: faker.internet.password(),
  phone: factory.seq('User.phone', n => `19${n}93${n}14${n}32`),
  email: factory.seq('User.email', n => `user_${n}@email.com`),
});

factory.define('Event', mongoose.model('Event'), {
  title: faker.name.findName(),
  location: faker.address.streetName(),
  date: '09-10-2019',
  time: '13:30',
  user: factory.assoc('User', '_id'),
});

module.exports = factory;
