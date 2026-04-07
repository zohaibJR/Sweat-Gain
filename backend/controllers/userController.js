import User from '../models/user.js';
import bcrypt from 'bcrypt';

// ------------------- SIGNUP -------------------
export const signupUser = async (req, res) => {
  try {
    const { name, email, country, password } = req.body;

    if (!name || !email || !country || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      country,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------- LOGIN -------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ success: true, user: { id: user._id, name: user.name, email: user.email, country: user.country, isPro: user.isPro } });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ------------------- LOGOUT -------------------
export const logoutUser = (req, res) => {
  try {
    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout Error:', err);
    return res.status(500).json({ message: 'Logout failed' });
  }
};