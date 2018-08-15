const router = require('express').Router();

const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const eventController = require('./controllers/eventController');

const authMiddleware = require('./middlewares/auth');


// Auth Routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Protected Routes
router.use(authMiddleware);

// User Routes
router.put('/user', userController.update);

// Events Routes
router.post('/event', eventController.create);
router.get('/event', eventController.show);
router.delete('/event', eventController.destroy);
router.post('/event/share', eventController.share);

// Error Handling Routes
router.use((req, res) => {
  res.status(404).json({ error: 'route not found' });
});

router.use((err, req, res, _next) => {
  res.status(500).json({ error: err.stack });
});

module.exports = router;
