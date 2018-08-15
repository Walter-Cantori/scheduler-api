const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../../index');
const factory = require('../factory');

const User = mongoose.model('User');
const Event = mongoose.model('Event');
const { expect } = chai;

chai.use(chaiHttp);


describe('Events', () => {
  beforeEach(async () => {
    await User.remove();
    await Event.remove();
  });

  it('it should be able to create event', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const event = await factory.attrs('Event', {
      user: user._id,
    });

    const response = await chai.request(app)
      .post('/api/event')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(event);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('title');
  });

  it('it should be able retrieve events', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const event = await factory.create('Event', {
      user: user._id,
    });

    const response = await chai.request(app)
      .get(`/api/event?date=${event.date}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    expect(response).to.have.status(200);
    expect(response.body[0].title).to.be.eq(event.title);
    expect(response.body[0].user).to.be.eq(user.id);
  });

  it('it should require date to retrieve events', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const response = await chai.request(app)
      .get('/api/event')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send();

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('it should be able delete events', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const event = await factory.create('Event', {
      user: user._id,
    });

    const response = await chai.request(app)
      .delete('/api/event')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: event.id });

    expect(response).to.have.status(200);
    expect(await Event.findById(event.id)).to.eq(null);
  });

  it('it should require id to delete events', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const response = await chai.request(app)
      .delete('/api/event')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({});

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('it should check if id exist for user before delete events', async () => {
    const user = await factory.create('User');
    const user2 = await factory.create('User');
    const jwtToken = user2.generateToken();

    const event = await factory.create('Event', {
      user: user._id,
    });

    const response = await chai.request(app)
      .delete('/api/event')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: event.id });

    expect(response).to.have.status(400);
    expect(response.body).to.have.property('error');
  });

  it('it should be able to share events', async () => {
    const user = await factory.create('User');
    const jwtToken = user.generateToken();

    const event = await factory.create('Event', {
      user: user._id,
    });

    const response = await chai.request(app)
      .post('/api/event/share')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ id: event.id, email: 'test@test.net' });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('title');
  });
});
