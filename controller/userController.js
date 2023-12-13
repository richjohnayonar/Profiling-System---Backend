const userdb = require("../model/userModel");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Login user
const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await userdb.findOne({ email: email });

    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Password does not match!",
      });
    }

    res.status(200).json({
      message: "Login Successfully!",
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register user
const register = async (req, res) => {
  try {
    const existingUser = await userdb.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    await userdb.create({
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    res.status(200).json({
      message: "User Created",
      role: req.body.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//fetch all user
const getUser = async (req, res) => {
  try {
    const users = await userdb.find().select("email role");
    if (!users || users.length === 0) {
      return res.status(401).json({ message: "No Users Found." });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//fetch user by id

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userdb.findById(id);
    if (!user) {
      res.status(401).json({ message: `No user with ID:${id}` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update user
const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Assuming req.body contains the updated user data with a 'password' field
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      req.body.password = hashedPassword;
    }

    const user = await userdb.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res
        .status(401)
        .json({ message: `No User Found with this id ${id}` });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//delete user

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userDeleted = await userdb.findByIdAndDelete(id);
    if (!userDeleted) {
      return res.status(401).json({ message: `No user found with id: ${id}` });
    }
    return res
      .status(200)
      .json({ message: `User with id ${id} is successfully deleted!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  //create
  loginUser,
  register,

  //fetch
  getUser,
  getUserById,

  //update
  updateUser,

  //delete
  deleteUser,
};
