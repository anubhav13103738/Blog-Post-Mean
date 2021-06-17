const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  // console.log("post hit");
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  })
  // console.log('creator: req.userData.userId', req.userData.userId);
  post.save().then(result => {
    // console.log(result);
    res.status(201).json({
      message: 'Post Added Successfully!',
      post: {
        id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath,
        creator: result.creator
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Post could not be saved!"
    })
  });
}

exports.getAllPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let postQuery = Post.find();
  let fetchedPost;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  // posts = [
  //   { id: 'dasdadrty', title: '1st server title', content: '1st server content' },
  //   { id: 'dasdadaqw', title: '2nd server title', content: '2nd server content' }
  // ]
  postQuery.then(documents => {
    fetchedPost = documents;
    return Post.countDocuments();
  }).then((count) => {
    //console.log('documents:', documents);
    res.status(200).json({ message: 'Data fetched successfully', posts: fetchedPost, maxPosts: count });
  }).catch(error => {
    res.status(500).json({
      message: "Posts could not be fetched!"
    })
  });
}

exports.getPostbyId = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found!' })
    }
  }).catch(error => {
    res.status(500).json({
      message: "Post could not be fetched!"
    })
  });
}


exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
    // console.log('got file:', imagePath);
  }
  // console.log('Got path:', imagePath);
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    // console.log('result:', result);
    if (result.n > 0) {
      res.status(200).json({
        message: 'post updated successfully'
      });
    } else {
      res.status(401).json({
        message: 'Not Auth!'
      })
    }

  }).catch(error => {
    res.status(500).json({
      message: "Post could not be updated!"
    })
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
    // console.log('Post removed successfully!');
    if (result.n > 0) {
      res.status(200).json({
        message: 'post deleted successfully'
      });
    } else {
      res.status(401).json({
        message: 'Not Auth!'
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: "Post could not be deleted!"
    })
  });
}
