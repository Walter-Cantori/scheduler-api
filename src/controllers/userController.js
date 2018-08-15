const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = {
  async update(req, res, next) {
    try {
      const {
        name,
        password,
        newPassword,
        confirmPassword,
      } = req.body;

      if (!name && !password) {
        return res.status(400).json({ error: 'Invalid request' });
      }

      if (name && !password) {
        return res.status(400).json({ error: 'Password required' });
      }

      if ((newPassword && !confirmPassword) || (!newPassword && confirmPassword)) {
        return res.status(400).json({ error: 'Old password, new password and confirm password required' });
      }

      if (newPassword && newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirm password don`t match' });
      }

      const user = await User.findById(req.userId);

      if (!await user.compareHash(password)) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      if (name) {
        user.name = name;
      }

      if (newPassword) {
        user.password = newPassword;
      }
      await user.save();

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },
};
