-- Active: 1693573647442@@127.0.0.1@3306

--USERS
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
);

INSERT INTO users (id, name, email, password, role, created_at)
VALUES
    ('u001', 'Fulana', 'fulana@fulaninha.com', '1234', 'admin', date ('now')),
    ('u002', 'Ciclano', 'ciclano@cici.com', '12345', 'geral', date ('now'));

SELECT * FROM users

DROP TABLE users;

--POSTS
CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT UNIQUE NOT NULL,
    comments TEXT NOT NULL,
    likes TEXT NOT NULL,
    deslikes TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

INSERT INTO posts (id, creator_id, content, comments, likes, deslikes, created_at, updated_at)
VALUES
    ('post001', 'u002', 'minha primeira postagem!', '12', '52', '2', date ('now'), date ('now')),
    ('post002', 'u002', 'bla bla bla minha segunda postagem', '15', '60', '5', date ('now'), date ('now'));

SELECT * FROM posts

DROP TABLE posts;

--LIKES-DESLIKES
CREATE TABLE likes_deslikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

INSERT INTO likes_deslikes (user_id, post_id, like)
VALUES
    ('u001', 'post002', 1);

SELECT * FROM likes_deslikes;

DROP TABLE likes_deslikes;

--COMMENTS-POSTS
CREATE TABLE comments_posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

INSERT INTO comments_posts (id, user_id, post_id, content, created_at, updated_at)
VALUES
    ('comment001', 'u001', 'post001', 'Que legal!! <3', date ('now'), date ('now'));

SELECT * FROM comments_posts;

DROP TABLE comments_posts;

--COMMENTS-LIKES
CREATE TABLE comments_likes (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments_posts (id)
			ON UPDATE CASCADE
			ON DELETE CASCADE
);

INSERT INTO comments_likes (user_id, comment_id, like)
VALUES
    ('u002', 'comment001', 0);

SELECT * FROM comments_likes;

DROP TABLE comments_likes;