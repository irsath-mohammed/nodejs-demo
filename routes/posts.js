const router = require('express').Router();
const Post = require('../model/Post');
const verify = require('./verifyToken');

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: "Cannot find Post" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

//Get 
router.get("/:id", verify, getPost, (req, res) => {
  console.log(req.user['_id'])
  res.json(res.post);
});

// Patch
router.patch("/:id", verify, getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }
  if (req.body.description != null) {
    res.post.description = req.body.description;
  }
  res.post.userId = req.user['_id'];
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List
router.get('/', verify, async (req, res) => {
	try {
		const posts = await Post.find()
		res.json(posts)

	} catch(err) {
		res.status(400).send(err);
	}
});



// Create Post
router.post('/', verify, async (req, res) => {
	const post = new Post({
		userId: req.user['_id'],
		title: req.body.title,
		description: req.body.description
	});


	try {

		const savedpost = await post.save();
		res.send({post: post._id});

	} catch(err) {
		res.status(400).send(err);
	}

});


module.exports = router;