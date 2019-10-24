const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/userModel');

router.post('/register', async ( req, res ) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  try {
      await Users.addUser(user);
      res.status(201).json({message: "New User Registered", user: user})
  }
  catch(error) {
      res.status(500).json({message: "Could Not Register User", error: error})
  }
})

router.post('/login', async (req, res) => {
  let { username, password } = req.body;

  try {
    const user = await Users.findBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: `Welcome ${user.username}!` });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch(error) {
    res.status(500).json({message: "Error logging in user", error: error})
  }
});

module.exports = router;