const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../../index');
const factory = require('../factory');

const User = mongoose.model('User');
const { expect } = chai;
chai.use(chaiHttp);

describe('User controller', () => {
  beforeEach(async () => {
    await User.remove();
  });

  it('should update user information and password', async () => {
    const user = await factory.create('User', {
      password: 'oldPassword',
    });

    const response = await chai.request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({
        name: 'new name',
        password: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      });

    expect(response).to.have.status(200);
    expect(response.body.name).to.eq('new name');
  });

  it('should check for name or password before update', async () => {
    const user = await factory.create('User');

    const response = await chai.request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({});

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('should password before update name', async () => {
    const user = await factory.create('User');

    const response = await chai.request(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${user.generateToken()}`)
      .send({ name: 'new name' });

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });
});
