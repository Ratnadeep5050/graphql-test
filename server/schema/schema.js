const { query } = require('express');
const graphql = require('graphql');
const _= require('lodash');

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
            type: Author,
            resolve(parent, args) {
                return _.find(authors, {id: parent.authorId});
            }
        }
    })
});

const Author = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return _.filter(books, {authorId: parent.id});
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
                return _.find(books, {id: args.id});
            }
        },
        author:{
            type: Author,
            args:{
                id:{ type: GraphQLID }
            },
            resolve(parent, args){
                return _.find(authors, {id: args.id});
            }
        },
        book:{
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            }
        },
        author:{
            type: new GraphQLList(Author),
            resolve(parent, args) {
                return authors;
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
});