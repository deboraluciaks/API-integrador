export interface PostsDB {
    id: string,
    creator_id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface PostsModel {
    id: string,
    creatorId: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string
}

export interface LikesDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface LikesModel {
    userId: string,
    postId: string,
    like: number
}

export class Post {
    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private comments: number,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string

    ) {
        this.id = id
        this.creatorId = creatorId
        this.content = content
        this.comments = comments
        this.likes = likes
        this.dislikes = dislikes
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getCreatorId(): string {
        return this.creatorId
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getComments(): number {
        return this.comments
    }
    public setComments(): void {

    }
    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public postToDBModel(): PostsDB {
        return {
            id: this.getId(),
            creator_id: this.getCreatorId(),
            content: this.getContent(),
            comments: this.getComments(),
            likes: this.getLikes(),
            dislikes: this.getDislikes(),
            created_at: this.getCreatedAt(),
            updated_at: this.getUpdatedAt()
        }
    }
}