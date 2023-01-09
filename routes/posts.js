const router = require("express").Router();
const Post = require("../models/Post");

//投稿を作成する
router.post("/", async (req, res) =>{
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  }catch(err){
    return res.status(500).json(err);
  }

});

//投稿を更新する
router.put("/:id", async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿の編集が完了しました。")
    }else {
      return res.status(403).json("あなたは他の人の投稿を編集できません。");
    }
  }catch(err){
    return res.status(403).json(err);
  }
});

//投稿を削除する
router.delete("/:id", async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
      await post.deleteOne();
      return res.status(200).json("投稿の削除が完了しました。")
    }else {
      return res.status(403).json("あなたは他の人の投稿を削除できません。");
    }
  }catch(err){
    return res.status(403).json(err);
  }
});

//投稿を取得する
router.get("/:id", async (req, res) =>{
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  }catch(err){
    return res.status(403).json(err);
  }
});

//特定の投稿に「like」を押す
router.put("/:id/like", async (req, res) =>{
    try{
      const post = await Post.findById(req.params.id);
      //投稿に「like」されていないことを確認する
      if(!post.likes.includes(req.body.userId)) {
        await post.updateOne({
          $push: {
            likes: req.body.userId,
          },
        });
        return res.status(200).json("投稿に「like」をしました。");
      }else{
        await post.updateOne({
          $pull: {
            likes: req.body.userId,
          } 
        });
        return res.status(200).json("投稿の「like」を解除しました。");
      }
    }catch(err){
      return res.status(500).json(err);
    }
})


module.exports = router;