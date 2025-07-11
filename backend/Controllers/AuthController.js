const bcrypt = require('bcrypt');
const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists. Please Login to Continue" });
    }
    const userModel = new UserModel({name, email, password, role});
    userModel.password = await bcrypt.hash(password, 10); // Hash the password
    await userModel.save(); // Save the user to the database
    res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
};

const login = async(req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Invalid email or password";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign({email: user.email, _id: user._id}, process.env.JWT_SECRET, { expiresIn: '24h' }); // Sign the JWT token
    res.status(200).json({ message: "Successfully logged in", success: true, jwtToken, email, name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message, success: false });
  }
}

module.exports = {signup, login};
