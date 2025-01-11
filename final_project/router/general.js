const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
     const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Task 10: Get the list of books available in the shop using async/await
public_users.get('/', async (req, res) => {
    try {
        // Since books are stored locally, we don't need an external request
        return res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
        return res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Books not found for this author" });
        }
    } catch (error) {
        console.error("Error fetching books by author:", error);
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});


// Get all books based on title
// Task 13: Get book details based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const filteredBooks = Object.values(books).filter(book => book.title === title);
        if (filteredBooks.length > 0) {
            return res.status(200).json(filteredBooks);
        } else {
            return res.status(404).json({ message: "Books not found for this title" });
        }
    } catch (error) {
        console.error("Error fetching books by title:", error);
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
