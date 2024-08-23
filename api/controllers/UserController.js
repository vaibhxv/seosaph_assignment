// controllers/userController.js
const User = require('../models/User');

// Get all users with pagination, filtering, and sorting
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'username', filter = '' } = req.query;
    const query = filter ? { username: { $regex: filter, $options: 'i' } } : {};
    
    const users = await User.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  try {
    const { username, email, description, role } = req.body;

    const newUser = new User({
      username,
      email,
      description,
      role
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
