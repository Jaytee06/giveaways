'use strict';
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

class PostController {

    constructor() {}

    async insert(post) {
        return await new Post(post).save();
    }

    async get(query) {
        return await Post.find(query.query).populate('author', 'fullname profileImage').populate('categories').sort(query.sort || {createdAt:-1}).skip(query.skip || 0).limit(query.limit || 10);
    }

    async getById(id) {
        return await Post.findById(id);
    }

    async getByTitle(title) {
        // fix title
        title = title.replace(/-/g, ' ');
        return await Post.findOne({title: {$regex: title, $options: 'i'}}).populate('author', 'fullname profileImage').populate('categories');
    }

    async update(id, post) {
        return await Post.findByIdAndUpdate(id, post, {new: true});
    }
    async remove(id) {
        return await Post.findByIdAndRemove(id);
    }
    async getCount(query) {
        const agg = [
            {$match: query.query},
            {$group: {_id:null, count:{$sum:1}}},
        ];
        return await Post.aggregate(agg);
    }

    async insertComment(postId, comment) {
        const com = await new Comment(comment).save().then(t => t.populate('user', 'fullname profileImage').execPopulate());

        if( com ) {
            let post = await Post.findById(postId);
            if( post ) {
                if( !post.comments ) post.comments = [];
                post.comments.push(com._id);
                await Post.findByIdAndUpdate(postId, post);
                return com;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async getComments(postId, query) {
        let comments = [];

        const post = await Post.findById(postId);

        if( post && post.comments && post.comments.length ) {
            comments = await Comment.find({_id:{$in:post.comments}}).populate('user', 'fullname profileImage').sort(query.sort || {createdAt:-1}).skip(query.skip || 0).limit(query.limit || 10);
        }

        return comments;
    }
}

module.exports = PostController;