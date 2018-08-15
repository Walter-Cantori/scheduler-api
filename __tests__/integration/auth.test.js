const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../../index');
const factory = require('../factory');

const User = mongoose.model('User');
const { expect } = chai;

chai.use(chaiHttp);

describe('Authentication', () => {
  beforeEach(async () => {
    await User.remove();
  });

  describe('sign up', () => {
    it('it should be able to sign up', async () => {
      const user = await factory.attrs('User');

      const response = await chai.request(app)
        .post('/api/signup')
        .send(user);

      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
    });

    it('it should not be able to sign up with duplicates', async () => {
      const user = await factory.create('User');
      const user2 = await factory.attrs('User', {
        email: user.email,
      });

      const response = await chai.request(app)
        .post('/api/signup')
        .send(user2);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });
  });

  describe('sign in', () => {
    it('it should be able to authenticate with valid credentials', async () => {
      const user = await factory.create('User', {
        password: '12345',
      });

      const response = await chai.request(app)
        .post('/api/signin')
        .send({ phone: user.phone, password: '12345' });

      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
    });

    it('it should not authenticate with non existent user', async () => {
      const response = await chai.request(app)
        .post('/api/signin')
        .send({ phone: 11111111111, password: '12345' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });

    it('it should not authenticate with invalid user', async () => {
      const user = await factory.create('User', {
        password: '1111',
      });

      const response = await chai.request(app)
        .post('/api/signin')
        .send({ phone: user.phone, password: '12344' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });
  });
});
