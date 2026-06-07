const User = require("../models/User");

exports.getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
