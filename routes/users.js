const router = require('express').Router();
const User = require('../model/User');
const Post = require('../model/Post');
const verify = require('./verifyToken');

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

//Get One
router.get("/:id", verify, getUser, (req, res) => {
  res.json(res.user);
});

//Get One
router.get("/:id/posts", verify, getUser, async (req, res) => {
  try {
    posts = await Post.find({userId: res.user.id});
    console.log(res.user.id)
    if (!posts) {
      return res.status(404).json({ message: "There are no posts available for this user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.json(posts);
});

// Update
router.patch("/:id", verify, getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Listing all user
router.get('/', verify, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)

  } catch(err) {
    res.status(400).send(err);
  }
});



module.exports = router;