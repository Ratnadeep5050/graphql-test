import React from 'react';
import BookList from './components/BookList';
import { ApolloClient } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-boost';


const httpLink = new createHttpLink({
  uri: 'https://127.0.0.1:4000/graphql'
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
      <h1>Introvert Readers</h1>
      <BookList/>
    </div>
    </ApolloProvider>  
  );
}

export default App;
