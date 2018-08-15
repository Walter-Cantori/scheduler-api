const chai = require('chai');
const sinon = require('sinon');
const httpMock = require('node-mocks-http');
const mongoose = require('mongoose');

const factory = require('../factory');

const User = mongoose.model('User');
const { expect } = chai;
const authMiddleware = require('../../src/middlewares/auth');

describe('Auth Middleware', () => {
  beforeEach(async () => {
    await User.remove();
  });
  it('it should validate presence of JWT token', async () => {
    const request = httpMock.createRequest();
    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(response.statusCode).to.be.eq(401);
  });

  it('it should validate invalid JWT token', async () => {
    const request = httpMock.createRequest({
      headers: {
        authorization: 'Bearer 121212',
      },
    });
    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(response.statusCode).to.be.eq(401);
  });

  it('it should validate valide of JWT token', async () => {
    const user = await factory.create('User');
    const request = httpMock.createRequest({
      headers: {
        authorization: `Bearer ${user.generateToken()}`,
      },
    });
    const response = httpMock.createResponse();

    const nextSpy = sinon.spy();

    await authMiddleware(request, response, nextSpy);

    expect(nextSpy.calledOnce).to.be.true;
    expect(request).to.include({ userId: user.id });
  });
});
