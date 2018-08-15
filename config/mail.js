const path = require('path');

module.exports = {
  host: process.env.MAIL_HOST_PROD,
  port: process.env.MAIL_PORT_PROD,
  user: process.env.MAIL_USER_PROD,
  pass: process.env.MAIL_PASS_PROD,

  templatePath: path.resolve('./resources/mail'),
};
