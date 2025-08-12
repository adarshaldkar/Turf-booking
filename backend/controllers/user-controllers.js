const User = require('../db/models/user-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkToken = require('../middlewares/check-token');
const { sendEmail, emailTemplates } = require('../config/email');

//Signup setup
module.exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirmpassword } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      //checking is there user
      res.status(400).json({ message: 'Email already Taken' });
    }

    if (password != confirmpassword) {
      //checking both passwords
      return res.status(400).json({ message: 'Passwords does Not Match' });
    }

    const hashedPassowrd = await bcrypt.hash(password, 2); //encrypting pass for sequrity using bcrypt package

    await User.create({
      firstname, //firstname key will get the value in firstname
      lastname,
      email,
      password: hashedPassowrd,
    });

    // Send welcome email
    try {
      const template = emailTemplates.welcomeEmail(firstname);
      await sendEmail(email, template.subject, template.html);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the registration if email fails
    }

    return res.status(200).json({ message: 'User signedup successfully' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// LOGIN SETUP

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Email or Password is incurrect' });
    }

    const isMatching = await bcrypt.compare(password, user.password);

    if (!isMatching) {
      return res
        .status(400)
        .json({ message: 'Email or Password is incurrect' });
    }

    //Token generating all both are right

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: '7d',
      }
    );

    console.log(
      'Token Generate and returning the token to front is next step : "user-controllers.js" file '
    );

    return res.status(200).json({ message: 'Logined Sucessfully', token });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Get Users
module.exports.users = async (req, res) => {
  try {
    const response = await User.find({ role: 'USER' });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// get by id
module.exports.accountDetails = async (req, res) => {
  const userId = req.headers.authorization.split(' ')[1]; // Get the userId from Authorization header
  console.log('User ID:', userId);

  try {
    const response = await User.find({ _id: userId });
    console.log(response);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ messsage: e.message, error: e });
  }
};
