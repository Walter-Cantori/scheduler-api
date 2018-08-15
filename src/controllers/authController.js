const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async signin(req, res, next) {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) {
        return res.status(400).json({ error: 'Phone number and password required' });
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!await user.compareHash(password)) {
        return res.status(400).json({ error: 'Invalid Password' });
      }

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },

  async signup(req, res, next) {
    try {
      const {
        name,
        password,
        phone,
        email,
      } = req.body;

      if (await User.findOne({ $or: [{ phone }, { email }] })) {
        return res.status(400).json({ error: 'User with same phone or email already exist' });
      }

      const user = await User.create({
        name, password, phone, email,
      });

      return res.json({ user, token: user.generateToken() });
    } catch (err) {
      return next(err);
    }
  },
};
