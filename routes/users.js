const router = require("express").Router();
const User = require("../models/User");

//CRUD
//ユーザー情報の更新
router.put("/:id", async(req, res) => {

  if( req.body.userId === req.params.id || req.body.isAdmin) {
    try{
      const user = await User.findByIdAndUpdate(req.params.id,{
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました。"); 
    }catch (err){
      return res.status(500).json(err);
    }
  }else{
    return res.status(403)
    .json("あなたは自分のアカウントのみ情報更新可能です。")
  }
});

//ユーザー情報の削除
router.delete("/:id", async(req, res) => {

  if( req.body.userId === req.params.id || req.body.isAdmin) {
    try{
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("ユーザー情報が削除されました。"); 
    }catch (err){
      return res.status(500).json(err);
    }
  }else{
    return res.status(403)
    .json("あなたは自分のアカウントのみ削除可能です。")
  }
});

//ユーザー情報の取得
// router.get("/:id", async(req, res) => {
//     try{
//       const user = await User.findById(req.params.id);
//       const { password, updatedAt, ...other} = user._doc;
//       return res.status(200).json(other); 
//     }catch (err){
//       return res.status(500).json(err);
//     }
// });

//クエリでユーザー情報を取得
router.get("/", async(req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try{
    const user = userId 
    ? await User.findById(userId) 
    : await User.findOne({username: username});
    
    const { password, updatedAt, ...other} = user._doc;
    return res.status(200).json(other); 
  }catch (err){
    return res.status(500).json(err);
  }
});


//ユーザーのフォロー
router.put("/:id/follow", async (req, res) =>{
  if(req.body.userId !== req.params.id){
    try{

      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      //フォロワーに自分が含まれていないことを確認する
      if(!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });

        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });

        return res.status(200).json("フォローに成功しました。");
      }else{
        return res.status(403).json("あなたはすでにこのユーザーをフォローしています。");
      }

    }catch(err){
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身のフォローはできません。");
  }
})


//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) =>{
  if(req.body.userId !== req.params.id){
    try{

      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      //フォロワーに存在しているユーザーであるか確認する
      if(user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });

        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });

        return res.status(200).json("フォローを解除しました。");
      }else{
        return res.status(403).json("このユーザーはフォロー解除できません。");
      }

    }catch(err){
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身のフォロー解除はできません。");
  }
})

// router.get("/", (req, res) => {
//   res.send("posts router");
// });

module.exports = router;