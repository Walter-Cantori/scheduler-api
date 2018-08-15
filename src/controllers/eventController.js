const mongoose = require('mongoose');
const moment = require('moment');

const sendMail = require('../services/mailer');
const notificationCron = require('../services/cron');

const Event = mongoose.model('Event');
const User = mongoose.model('User');

module.exports = {
  async create(req, res, next) {
    try {
      const {
        title,
        location,
        date,
        time,
      } = req.body;

      if (!title || !location || !date || !time) {
        return res.status(400).json({ error: 'title, location, date, time are required' });
      }

      const dupEvent = await Event.find({ user: req.userId, date, time });

      if (dupEvent.length > 0) {
        return res.status(400).json({ error: 'There is already one event created for the same date and time' });
      }

      const result = await Event.create({
        title,
        location,
        date,
        time,
        user: req.userId,
      });

      const user = await User.findById(req.userId);
      result.name = user.name;
      result.email = user.email;
      notificationCron(result);

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }

      const events = await Event.find({ user: req.userId, date });

      return res.json(events);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      if (!req.body.id) {
        return res.status(400).json({ error: 'Id is required' });
      }
      const result = await Event.findOneAndRemove({ _id: req.body.id, user: req.userId });

      if (!result) {
        return res.status(400).json({ error: 'Event not found' });
      }

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  },

  async share(req, res, next) {
    try {
      const { id, email } = req.body;

      if (!id || !email) {
        return res.status(400).json({ error: 'Event id and contact email are required' });
      }

      const user = await User.findById(req.userId);
      const event = await Event.findOne({ user: req.userId, _id: id });

      if (event.length < 1) {
        return res.status(400).json({ error: 'Event not found' });
      }

      const formattedDate = moment(event.date, 'DD-MM-YYYY').locale('pt-BR').format('dddd DD MMMM');

      sendMail({
        from: 'Scheduler app noreply@schedullerapp.com',
        to: email,
        subject: `${event.title}`,
        template: 'share',
        context: {
          name: user.name,
          title: event.title,
          date: formattedDate,
          time: event.time,
        },
      });

      return res.json(event);
    } catch (err) {
      return next(err);
    }
  },
};
