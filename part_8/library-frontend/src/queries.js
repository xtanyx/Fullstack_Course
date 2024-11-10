import {gql} from '@apollo/client'

export const ALL_AUTHORS = gql`
  query{
    allAuthors{
      name
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query{
    allBooks{
      title
      published
      author{
        name
      }
      genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook (
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
        title
        author{
          name
          born
        }
        published
      }
  }
`

export const EDIT_AUTHOR = gql`
  mutation changeBorn($name: String!, $setBornTo: Int!){
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
        name
        born
      }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      value
    }
  }
`

export const ME = gql`
  query{
    me{
      username
      favoriteGenre
    }
  }
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre ($genre: String!){
    booksByGenre(genre: $genre){
      title
      author{
        name
      }
      published
      genres
    }
  }
`

export const BOOK_ADDED = gql`
  subscription{
    bookAdded{
      title
      author{
        name
        born
      }
      published
      genres
    }
  }
`