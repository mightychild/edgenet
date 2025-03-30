const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { type, description } = req.body;

  try {
    const task = new Task({
      type,
      description,
      userId: req.userId,
    });
    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// Verify and complete a task
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    // Mark task as completed
    task.status = 'completed';
    await task.save();

    // Reward the user with $EDGE points
    const user = await User.findById(req.userId);
    user.edgeBalance += task.reward || 0; // Default reward is 0 if not specified
    await user.save();

    res.json({ task, edgeBalance: user.edgeBalance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};