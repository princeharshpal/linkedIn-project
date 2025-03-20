const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const profileModel = require("../models/profile.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const convertUserDataToPdf = async (userData) => {
  try {
    const doc = new PDFDocument();
    const outputPath =
      jwt.sign({ userId: userData.userId }, process.env.JWT_SECRET) + ".pdf";
    console.log(outputPath);

    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, {
      align: "center",
      width: 100,
    });
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);

    doc.fontSize(14).text("Past Work: ");
    userData.pastWork.forEach((work, index) => {
      doc.fontSize(14).text(`Company Name: ${work.CompanyName}`);
      doc.fontSize(14).text(`Position: ${work.position}`);
      doc.fontSize(14).text(`Years: ${work.years}`);
    });

    doc.end();

    return outputPath;
  } catch (error) {
    console.log(error);
  }
};

module.exports.register = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "All Fields are Required!" });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User with this Email Already Exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const profile = await profileModel.create({ userId: newUser._id });

    return res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are Required!" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    const token = jwt.sign(email, process.env.JWT_SECRET);

    await userModel.updateOne({ _id: user._id }, { token });

    res.status(200).json({ token, message: "Login Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await userModel.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "Uer not Found!" });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    res.status(200).json({ message: "Profile Picture Updated Successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await userModel.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "Uer not Found!" });
    }

    const { username, email } = newUserData;

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User Already exists!" });
      }
    }

    Object.assign(user, newUserData); //coppies all values of newUserData to user

    await user.save();

    return res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await userModel.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "Uer not Found!" });
    }

    const userProfile = await profileModel
      .findOne({ userId: user._id })
      .populate("userId", "name email username profilePicture");

    return res.status(200).json({ Profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await userModel.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "Uer not Found!" });
    }

    const profile_to_update = await profileModel.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUserProfile = async (req, res) => {
  try {
    const allProfiles = await profileModel
      .find()
      .populate("userId", "name username email profilePicture");

    return res.status(200).json({ allProfiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.downloadProfile = async (req, res) => {
  try {
    const user_id = req.params.id;

    const userProfile = await profileModel
      .findOne({ userId: user_id })
      .populate("userId", "name username email profilePicture");

    let outputPath = await convertUserDataToPdf(userProfile);

    return res.status(200).json({ message: outputPath });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
