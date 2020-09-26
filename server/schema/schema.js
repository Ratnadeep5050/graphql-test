const { query } = require('express');
const graphql = require('graphql');
const _= require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLList 
} = graphql;

const books = [
    {
        id: '1',
        name: 'The Last Mughals',
        genre: 'History', 
        authorId: '1'
    },
    {
        id: '2',
        name: 'The Will to Power',
        genre: 'Philosophy',
        authorId: '2' 
    },
    {
        id: '3',
        name: 'The Phenomenology of Spirit',
        genre: 'Philosophy',
        authorId: '3' 
    },
    {
        id: '4',
        name: 'The Return of a King',
        genre: 'History', 
        authorId: '1'
    },
    {
        id: '5',
        name: 'Nausea',
        genre: 'Fiction', 
        authorId: '4'
    },
    {
        id: '6',
        name: 'The Pursuit of Happiness',
        genre: 'Non-Fiction', 
        authorId: '5'
    },
]

const authors = [
    {
        id: '1',
        name: 'William Dalrymple',
        country: 'Scotland', 
    },
    {
        id: '2',
        name: 'Friedrich Nietzsche',
        country: 'Germany', 
    },
    {
        id: '3',
        name: 'Georg Wielhelm Hegel',
        country: 'Germany', 
    },
    {
        id: '4',
        name: 'Jean Paul Satre',
        country: 'France', 
    },
    {
        id: '5',
        name: 'Bertrand Russell',
        country: 'England', 
    },
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book:{
            type: BookType,
            args:{
                id:{ type: GraphQLID }
            },
            resolve(parent, args){
                return Book.findById(args.id);
            }
        },
        author:{
            type: AuthorType,
            args:{
                id:{ type: GraphQLID }
            },
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },
        book:{
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        author:{
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: GraphQLString},
                country: {type: GraphQLString}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    country: args.country
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLString}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});