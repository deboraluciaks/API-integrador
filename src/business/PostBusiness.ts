import { PostsDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/deletePost.dto";
import { editPostInputDTO, editPostOutputDTO } from "../dtos/editPost.dto";
import { GetPostOutputDTO, GetPostsInputDTO } from "../dtos/getPost.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { TokenManager, TokenPayLoad } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";
import { LikesDB, Post, PostsDB } from "../models/Post";
import { LikesDatabase } from "../database/LikesDatabase";
import { LikeDislikeInputDTO } from "../dtos/likedislikePost.dto";
import { User, UserDB } from "../models/User";
import { Comments, CommentsDB, CommentsLikeDB } from "../models/Comment";
import { CommentPostInputDTO, CommentPostOutputDTO } from "../dtos/commentPost.dto";
import { LikeCommentInputDTO, LikeCommentOutputDTO } from "../dtos/likeComment.dto";
import { CommentDTO, GetPostInfoInputDTO, GetPostInfoOuputDTO } from "../dtos/getPostInf.dto";

export class PostBusiness {
    constructor(private postsDatabase: PostsDatabase, private idGenerator: IdGenerator, private tokenManager: TokenManager, private userDatabase: UserDatabase, private likesDatabase: LikesDatabase) { }

    public getAllPosts = async (input: GetPostsInputDTO): Promise<GetPostOutputDTO | GetPostOutputDTO[]> => {

        const { auth, id } = input

        const payload = await this.tokenManager.getPayLoad(auth)

        if (!payload || payload === null) {
            throw new BadRequestError("Invalid token.")
        }
        
        if (id !== undefined) {
            const [postDB]: PostsDB[] = await this.postsDatabase.getPostsById(id)

            if (!postDB) {
                throw new NotFoundError("Post not found.")
            }

            const post: Post = new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.comments,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at
            )

            const postModel = post.postToDBModel()

            const [userDB]: UserDB[] = await this.userDatabase.getUsers(postDB.creator_id)

            const user: User = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )

            const userModel = user.toBusinessModel()

            const output: GetPostOutputDTO = {
                id: postModel.id,
                content: postModel.content,
                comments: postModel.comments,
                likes: postModel.likes - postModel.dislikes,
                createdAt: postModel.created_at,
                uploadedAt: postModel.updated_at,
                creator: {
                    id: userModel.id,
                    name: userModel.name
                }
            }

            return output
        } else {
            const postsDB = await this.postsDatabase.getPosts()
    
            const output = []
            for (const post of postsDB) {

                const [user]: UserDB[] = await this.userDatabase.getUsers(post.creator_id)

                const postDB: GetPostOutputDTO = {
                    id: post.id,
                    content: post.content,
                    comments: post.comments,
                    likes: post.likes - post.dislikes,
                    createdAt: post.created_at,
                    uploadedAt: post.updated_at,
                    creator: {
                        id: await user.id,
                        name: await user.name
                    }

                }

                output.push(postDB)
            }

            return output
        }
    }

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {

        const { content, token } = input

        const payload = this.tokenManager.getPayLoad(token)
        if (!payload) {
            throw new BadRequestError("Token não encontrado.")
        }

        const [user]: UserDB[] = await this.userDatabase.getUsers(payload.id)
        if (!user) {
            throw new NotFoundError("User não encontrado, tente novamente.")
        }
        const postId: string = this.idGenerator.generate()

        const newPost: PostsDB = {
            id: postId,
            creator_id: user?.id,
            content: content,
            comments: 0,
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        await this.postsDatabase.createNewPost(newPost)

        const output: CreatePostOutputDTO = {
            id: newPost.id,
            content: newPost.content,
            comments: newPost.comments,
            likes: newPost.likes,
            dislikes: newPost.dislikes,
            createdAt: newPost.created_at,
            updatedAt: newPost.updated_at,
            creator: {
                id: newPost.creator_id,
                name: user?.name,
            }
        }

        return output
    }

    public editPost = async (input: editPostInputDTO): Promise<editPostOutputDTO> => {

        const { token, postId, content } = input

        const payLoad: TokenPayLoad | null = this.tokenManager.getPayLoad(token)
        if (!payLoad) {
            throw new BadRequestError("Token não encontrado.")
        }

        const [user]: UserDB[] = await this.userDatabase.getUsersById(payLoad.id)

        if (!user) {
            throw new NotFoundError("User não encontrado.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPostsById(postId)

        if (!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        if (user.id !== post.creator_id) {
            throw new BadRequestError("Apenas o criador pode editar!")
        }


        const editedPostModel: Post = new Post(
            post.id, post.creator_id, content, post.comments, post.likes, post.dislikes, post.created_at, new Date().toISOString()
        )

        const editedPostDB: PostsDB = {
            id: editedPostModel.getId(),
            creator_id: editedPostModel.getCreatorId(),
            content: editedPostModel.getContent(),
            comments: editedPostModel.getComments(),
            likes: editedPostModel.getLikes(),
            dislikes: editedPostModel.getDislikes(),
            created_at: editedPostModel.getCreatedAt(),
            updated_at: editedPostModel.getUpdatedAt()
        }

        await this.postsDatabase.editPost(editedPostDB)

        const output: editPostOutputDTO = {
            message: `Post edited.`
        }

        return output
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        const { token, postId } = input

        const payLoad = this.tokenManager.getPayLoad(token)
        if (!payLoad) {
            throw new BadRequestError("Token invalido.")
        }

        const [user]: UserDB[] = await this.userDatabase.getUsersById(payLoad.id)

        const [post]: PostsDB[] = await this.postsDatabase.getPostsById(postId)



        if (!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        if (user.id !== post.creator_id) {
            throw new BadRequestError("Apenas o criador pode editar!")
        }

        await this.postsDatabase.deletePost(post.id)

        const output: DeletePostOutputDTO = {
            message: "Post excluído."
        }

        return output

    }

    public likePost = async (input: LikeDislikeInputDTO): Promise<any> => {
        const { token, postId, like } = input

        let output;
        let likeValue;
        if (like === true) {
            likeValue = 1
        } else if (like === false) {
            likeValue = 0
        }


        const payload: TokenPayLoad | null = await this.tokenManager.getPayLoad(token)

        if (!payload) {
            throw new BadRequestError("Token inválido.")
        }

        const [userDB]: UserDB[] = await this.userDatabase.getUsers(payload.id)

        if (!userDB) {
            throw new NotFoundError("User não encontrado.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPosts(postId)

        if (!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        const likePostDB: LikesDB = {
            user_id: userDB.id,
            post_id: post.id,
            like: Number(likeValue)
        }

        if (post.creator_id === likePostDB.user_id) {
            throw new BadRequestError("Criadores não podem curtir ou dar deslike em seu próprio post.")
        }


        const [liked]: LikesDB[] = await this.likesDatabase.getLikes(likePostDB)

        if (liked) {
            if (liked.like === 1 && likePostDB.like === 1) {
                await this.likesDatabase.deleteLike(likePostDB)
                output = "Você tirou o seu like."

            } else if (liked.like === 0 && likePostDB.like === 0) {
                await this.likesDatabase.deleteLike(likePostDB)
                output = "Você tirou o seu dislike."

            } else if (liked.like === 1 && likePostDB.like === 0) {
                await this.likesDatabase.editLike(likePostDB)
                output = "Voce mudou seu like para dislike."

            } else if (liked.like === 0 && likePostDB.like === 1) {
                await this.likesDatabase.editLike(likePostDB)
                output = "Voce mudou seu dislike para like."

            }
        } else {
            if (likePostDB.like === 1) {
                output = "Você curtiu este post."

            } else if (likePostDB.like === 0) {
                output = "Você deu deslike este post."

            }
            await this.likesDatabase.likeDislike(likePostDB)
        }

        const likesFromDB = await this.likesDatabase.postLikes(likePostDB.post_id)

        const dislikesFromDB = await this.likesDatabase.postDislikes(likePostDB.post_id)


        await this.postsDatabase.editLikePost(likePostDB.post_id, Number(likesFromDB), Number(dislikesFromDB))

        return output

    }
    
    public getLikes =async (input:any) => {
        const {token, postId} = input
        
        const payload = await this.tokenManager.getPayLoad(token)
        
        if(!payload){
            throw new BadRequestError("Invalid token.")
        }
        
        const [user] = await this.userDatabase.getUsersById(payload.id)
        if(!user){
            throw new NotFoundError("User não encontrado.")
        }
        
        const [post] = await this.postsDatabase.getPostsById(postId)
        
        if(!post){
            throw new NotFoundError("Post não encontrado.")
        }
        
        const searchInDb = {
            user_id: user.id,
            post_id: post.id      
        }

        const output = await this.likesDatabase.getLikes(searchInDb)
        return output
        
    }

    public commentPost = async (input: CommentPostInputDTO): Promise<CommentPostOutputDTO> => {
        const { token, postId, comment } = input

        const payLoad: TokenPayLoad | null = await this.tokenManager.getPayLoad(token)

        if (!payLoad) {
            throw new BadRequestError("Token inválido.")
        }

        const [user] = await this.userDatabase.getUsersById(payLoad.id)

        if (!user) {
            throw new NotFoundError("User não encontrado.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPosts(postId)

        if (!post) {
            throw new NotFoundError("Post não encontrado.")
        }

        const postModel: Post = new Post(
            post.id,
            post.creator_id,
            post.content,
            post.comments + 1,
            post.likes,
            post.dislikes,
            post.created_at,
            post.updated_at
        )

        const editedPostDB: PostsDB = {
            id: postModel.getId(),
            creator_id: postModel.getCreatorId(),
            content: postModel.getContent(),
            comments: postModel.getComments(),
            likes: postModel.getLikes(),
            dislikes: postModel.getDislikes(),
            created_at: postModel.getCreatedAt(),
            updated_at: postModel.getUpdatedAt()
        }

        const newComment: Comments = new Comments(
            this.idGenerator.generate(),
            user.id,
            post.id,
            comment,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )

        const newCommentDB: CommentsDB = {
            id: newComment.getId(),
            user_id: newComment.getUserId(),
            post_id: newComment.getPostId(),
            content: newComment.getContent(),
            likes: newComment.getLikes(),
            dislikes: newComment.getDislikes(),
            created_at: newComment.getCreatedAt(),
            updated_at: newComment.getUploadedAt()
        }


        await this.postsDatabase.commentPost(newCommentDB)
        await this.postsDatabase.editPost(editedPostDB)



        const output: CommentPostOutputDTO = {
            message: `comentou neste post`
        }
        return output

    }

    public getPost = async (input: GetPostInfoInputDTO): Promise<GetPostInfoOuputDTO> => {
        const { token, id } = input

        const payLoad = await this.tokenManager.getPayLoad(token)

        if (!payLoad) {
            throw new BadRequestError("Token inválido.")
        }

        const [postDB]: PostsDB[] = await this.postsDatabase.getPostsById(id)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado.")
        }
        const commentsDB: CommentsDB[] = await this.postsDatabase.getCommentsByPostId(id)
    
        let comments = [];

        for (const comment of commentsDB) {

            const [user]: UserDB[] = await this.userDatabase.getUsers(comment.user_id)
   
            
            

            const commentInfo: CommentDTO = {
                commentId: comment.id,
                commentUserId: comment.user_id,
                commentUserName: user.name,
                commentContent: comment.content,
                commentLikes: comment.likes - comment.dislikes,
                commentCreatedAt: comment.created_at,
                commentUpdatedAt: comment.updated_at,
            }

            comments.push(commentInfo)
        }
         const [creator]: UserDB[] = await this.userDatabase.getUsersById(postDB.creator_id)
       
         const output: GetPostInfoOuputDTO = {
            
            postId: postDB.id,
            postCreatorId: creator.id,
            postCreatorName: creator.name,
            postContent: postDB.content,
            postLikes: postDB.likes - postDB.dislikes,
            postCreatedAt: postDB.created_at,
            postUpdatedAt: postDB.updated_at,
            postComments: comments
        }

        return output
    }
    
    public getCommentsLikes  =async (input:any) => {
        const {token, commentId} = input
        
        const payload = await this.tokenManager.getPayLoad(token)
        
        if(!payload){
            throw new BadRequestError("Token inválido.")
        }
        
        const [user] = await this.userDatabase.getUsersById(payload.id)
        if(!user){
            throw new NotFoundError("User não encontrado.")
        }
        
        const [comment] = await this.postsDatabase.getCommentsById(commentId)
        
        if(!comment){
            throw new NotFoundError("Comentário não encontrado.")
        }
        const searchInDb = {
            user_id: user.id,
            comment_id: comment.id     
        }

        
        const output = await this.postsDatabase.getCommentLikesByCommentId(searchInDb)

        return output
        
    }

    public likeComment = async (input: LikeCommentInputDTO): Promise<LikeCommentOutputDTO> => {
        const { token, postId, commentId, like } = input

        const payLoad: TokenPayLoad | null = await this.tokenManager.getPayLoad(token)
        if (!payLoad) {
            throw new BadRequestError("Token inválido.")
        }

        let output;
        let likeValue = like ? 1 : 0



        const [userDB] = await this.userDatabase.getUsersById(payLoad.id)

        if (!userDB) {
            throw new NotFoundError("User não encontrado.")
        }
        const [postDB] = await this.postsDatabase.getPostsById(postId)
        if (!postDB) {
            throw new NotFoundError("Post não encontrado.")
        }
        const [comment] = await this.postsDatabase.getCommentsById(commentId)
        if (!comment) {
            throw new NotFoundError("Comment não encontrado.")
        }

        const commentsLikeDB: CommentsLikeDB = {
            user_id: userDB.id,
            comment_id: comment.id,
            like: Number(likeValue)
        }

        const [commentLike]: CommentsLikeDB[] = await this.postsDatabase.getCommentLikesByCommentId(commentsLikeDB)

        if (commentLike) {

            if (commentLike.like === 1 && likeValue === 1) {

                await this.postsDatabase.deleteLike(commentsLikeDB)
                output = "Você retirou seu like."

            } else if (commentLike.like === 0 && likeValue === 0) {

                await this.postsDatabase.deleteLike(commentsLikeDB)
                output = "Você retirou seu dislike."

            } else if (commentLike.like === 1 && commentsLikeDB.like === 0) {

                await this.postsDatabase.editCommentLike(commentsLikeDB)
                output = "Você deu dislike no comentário."

            } else if (commentLike.like === 0 && commentsLikeDB.like === 1) {
                await this.postsDatabase.editCommentLike(commentsLikeDB)
                output = "Você deu like no comentário."

            }


        } else {
            if (commentsLikeDB.like === 1) {

                output = "Você deu like no comentário."

            } else if (commentsLikeDB.like === 0) {

                output = "Você deu dislike no comentário."

            }

            await this.postsDatabase.likeComment(commentsLikeDB)
        }


        const commentsLikesFromDB = await this.postsDatabase.getCommentLikes(commentsLikeDB.comment_id)

        const commentsDislikesFromDB = await this.postsDatabase.getCommentDislikes(commentsLikeDB.comment_id)


        await this.postsDatabase.editCommentPost(commentsLikeDB.comment_id, Number(commentsLikesFromDB), Number(commentsDislikesFromDB))
        return output

    }

}