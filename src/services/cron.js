const { CronJob } = require('cron');
const moment = require('moment');

const sendMail = require('./mailer');

module.exports = (data) => {
  const jobDate = moment(`${data.date} ${data.time}`, 'DD-MM-YYYY HH:mm')
    .subtract(30, 'm')
    .format('MM/DD/YYYY HH:mm');

  const job = new CronJob(new Date(jobDate),
    () => {
      sendMail({
        from: 'Scheduler app noreply@schedullerapp.com',
        to: data.email,
        subject: `Lembrete - ${data.title} em 30 mintutos`,
        template: 'reminder',
        context: {
          name: data.name,
          title: data.title,
        },
      });
      job.stop();
    },
    () => {},
    true,
    'America/Sao_Paulo');
};
