
const serviceBD=require('./file.service.js')






module.exports= class UserController {
    // async create(user) {
    //     const fileName = fileService.saveFile(picture);
    //     const createdPost = await Post.create(user);
    //     return createdPost;
    // }

 async getAll(req, res) {
        try {
            const users =await serviceBD.readFile();
            return res.json(users)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }


    // async getOne(id) {
    //     if (!id) {
    //         throw new Error('не указан ID')
    //     }
    //     const post = await Post.findById(id);
    //     return post;
    // }
    //
    // async update(post) {
    //     if (!post._id) {
    //         throw new Error('не указан ID')
    //     }
    //     const updatedPost = await Post.findByIdAndUpdate(post._id, post, {new: true})
    //     return updatedPost;
    // }
    //
    // async delete(id) {
    //     if (!id) {
    //         throw new Error('не указан ID')
    //     }
    //     const post = await Post.findByIdAndDelete(id);
    //     return post;
    // }
}



