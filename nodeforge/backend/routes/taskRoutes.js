const express = require('express');
const taskController = require('../controllers/taskController'); // Ensure this path is correct
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all task routes with authentication
router.use(authMiddleware.authenticate);

// Get all tasks for the logged-in user
router.get('/', taskController.getTasks);

// Create a new task
router.post('/', taskController.createTask);

// Verify and complete a task
router.put('/:taskId/complete', taskController.completeTask);

module.exports = router;