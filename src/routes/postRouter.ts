import express from "express"
import { PostsController } from "../controller/PostController"
import { PostBusiness } from "../business/PostBusiness"
import { PostsDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { UserDatabase } from "../database/UserDatabase"
import { LikesDatabase } from "../database/LikesDatabase"


export const postRouter = express.Router()

const postsController = new PostsController(new PostBusiness(new PostsDatabase(), new IdGenerator(), new TokenManager(), new UserDatabase(), new LikesDatabase()))

postRouter.get("/", postsController.getAllPosts)
postRouter.post("/:id/comments/:commentid", postsController.likeComment)
postRouter.post("/:id/comments", postsController.commentPost)
postRouter.get("/:id/comments", postsController.getPost)
postRouter.get("/:id/comments/:commentid", postsController.getCommentsLike)
postRouter.post("/", postsController.createPost)
postRouter.put("/:id", postsController.editPost)
postRouter.delete("/:id", postsController.deletePost)
postRouter.post("/:id/like", postsController.likePost)
postRouter.get("/:id/like", postsController.getLikes)