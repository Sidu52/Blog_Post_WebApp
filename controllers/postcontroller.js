const Postsch = require("../models/post");
const Comment = require("../models/comment");
const Like = require('../models/like');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue')
const commentMailer = require('../mailers/comments_mailer');
module.exports.createpost = async(req, res) => {
    try{
        let post =await Postsch.create({
            content: req.body.content,
            user: req.user._id
        });

        if (req.xhr) {
            post = await post.populate('user', 'name');//.execPopulate();

            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created!"
            });
        }
        req.flash('success','Post Created Successfull!');
        return res.redirect('back');
    }
    catch(err){
        console.log("Error",err);
    }
}
module.exports.comment =async (req, res) => {
    try{
        let post= await Postsch.findById(req.body.post);

        if (post) {
            let comment =await Comment.create({
                content: req.body.content,
                post:req.body.post,
                user: req.user._id
            });
                post.comments.push(comment);
                post.save();
                comment = await comment.populate('user','username email');//.execPopulate();
                commentMailer.newComment(comment);
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message: "Post created!"
                    })
                }
                req.flash("success","Comment Create Successfull!")
                res.redirect('back');
        }
    }
    catch(err){
        console.log("Error",err);
        return;
    }
    
}

// DeletePost
module.exports.destroy=async (req,res)=>{
    try{
        let post= await Postsch.findById(req.params.id);
    if(post.user == req.user.id){

        //CHANGE :: delete the associated likes for the post and all its comments likes too
        await Like.deleteMany({likeable:post,onModel:'Post'});
        await Like.deleteMany({_id:{$in: post.comments}});
        post.remove();
        
        await Comment.deleteMany({post:req.params.id});

        if (req.xhr) {
            return res.status(200).json({
                data:{
                    post_id: req.params.id
                },
                message:"Post deleted"
            });
        }
        req.flash("error","Post Deleted!")
        return res.redirect('back');
    }else{
        return res.redirect('back');
    }
    }
    catch(err){
        console.log("Error",err);
    } 
}

// DeleteComment
module.exports.deletecomment=async (req,res)=>{
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            let post =Postsch.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}})

            //Destroy the assiciated likes for this comment
            await Like.deleteMany({likeable: comment._id,onModel:'Comment'});

            //send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data:{
                        comment_id: req.params.id
                    },
                    message:"Post deleted"
                });
            }

            req.flash('error','Comment Deleted!')
            return res.redirect('back')
        }else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log("Error",err);
        return;
    } 
}