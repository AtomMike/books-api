require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()
const PORT = 3000

app.use(cors());

const { Sequelize, Model, DataTypes } = require('sequelize');
const book = require('./models/book');
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    process.env.MYSQL_USER, 
    process.env.MYSQL_PASSWORD, {
        host: 'database',
        dialect: 'mysql'
    });

const dbConnect = async () => {

    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
dbConnect()



const Book = sequelize.define('Book', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    datePublished: {
        type: DataTypes.DATE,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
});

const Author = sequelize.define('Author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
  }, {
});


app.use(express.json())

app.listen(
    PORT, () => console.log(`Running on ${PORT}`)
)

app.get('/book', (req, res) => {
    return res.status(418).send({
        'message': 'An id is required.'
    });
})

app.get('/book/:id', (req, res) => {
    const {id} = req.params

    const book = getBookEntry(id)
    .then((response) => {
        if (response === null) {
            return res.send({
                "message": "No results found matching that query"
            });
        }
        return res.send({
            "name": response.name,
            "ISBN": response.isbn,
            "datePublished": response.datePublished,
            "author": response.author
        });
    })

})

app.get('/books', (req, res) => {
    const {id} = req.params

    const books = getBooks()
    .then((response) => {
        if (response === null) {
            return res.send({
                "message": "No results found matching that query"
            });
        }

        const books = response.books

        return res.send({
            books
        });
    })

});

app.post('/book', (req, res) => {
    const {isbn} = req.body
    const {name} = req.body
    const {datePublished} = req.body
    const {authorId} = req.body

    const errors = []

    if (!name) {
        errors.push({'message':'The name field is required'})
    }
    if (!isbn) {
        errors.push({'message':'The isbn field is required'})
    }
    if (!datePublished) {
        errors.push({'message':'The datePublished field is required'})
    }
    if (!authorId) {
        errors.push({'message':'The authorId field is required'})
    }

    if (errors.length > 0) {
        return res.status(418).send({
            'message': 'Some or all parameters were not submitted.',
            'errors': errors
        });
    }
        
    const saveBook = createBookEntry(name, isbn, datePublished, authorId)
    .then((response) => {
        return res.send({
            "message": "Book saved successfully",
            "id":response.id
        });
    })
    
})

app.put('/book/:id', (req, res) => {
    const {id} = req.params
    const {isbn} = req.body
    const {name} = req.body
    const {datePublished} = req.body
    const {authorId} = req.body

    const errors = []

    if (!id) {
        errors.push({'message':'The id field is required'})
    }
    if (!name) {
        errors.push({'message':'The name field is required'})
    }
    if (!isbn) {
        errors.push({'message':'The isbn field is required'})
    }
    if (!datePublished) {
        errors.push({'message':'The datePublished field is required'})
    }
    if (!authorId) {
        errors.push({'message':'The authorId field is required'})
    }

    if (errors.length > 0) {
        return res.status(418).send({
            'message': 'Some or all parameters were not submitted.',
            'errors': errors
        });
    }

    const updateBook = updateBookEntry(id, name, isbn, datePublished, authorId)
    .then((response) => {
        console.log(response)
        return res.send({
            "message": "Book updated successfully"
        });
    })
})

app.delete('/book/:id', (req, res) => {
    const {id} = req.params

    const deleteBook = deleteBookEntry(id)
    .then((response) => {
        if (response === null) {
            return res.status(418).send({
                "message": "Entry could not be deleted."
            })
        }

        return res.send({
            "message": "Entry deleted successfully",
            "id":response.id
        })
    })
})


app.get('/authors', (req, res) => {
    const {id} = req.params

    const authors = getAuthors()
    .then((response) => {
        if (response === null) {
            return res.send({
                "message": "No results found matching that query"
            });
        }

        const authors = response.authors

        return res.send({
            authors
        });
    })

});



const updateBookEntry = async (id, name, isbn_code, datePublished, author_id) => {
    const bookUpdate = await Book.update(
        { name: name, authorId: author_id, isbn: isbn_code, datePublished: datePublished },
        { returning: true, where: { id: id } }
    )
    if (bookUpdate === null) {
        return null   
    }
    return {
        "message":"success"
    }

}

const getBookEntry = async (id) => {
    const book = await Book.findOne({ where: { id: id } })
    let author_data = []

    if (book === null) {
        return null   
    }

    // Get the author:
    const author = await Author.findOne({ where: { id: book.authorId } })

    if (author !== null) {
        author_data = author
    }

    return {
        'name':book.name,
        'isbn':book.isbn,
        'datePublished':book.datePublished,
        'author':author_data
    }
}

const createBookEntry = async (name, isbn, date, authorId) => {
    const book = await Book.create({ 
        name:name,
        isbn:isbn,
        datePublished:date,
        authorId:authorId
    });
    
    return {
        'id':book.id
    }
}

const getBooks = async () => {
    const books = await Book.findAll()

    if (books === null) {
        return null   
    }
    
    return {
        books
    }
}

const deleteBookEntry = async (id) => {
    const deleteBook = await Book.destroy({ where: {id:id}})

    if (deleteBook === null || deleteBook === 0) {
        return null   
    }
    
    return {
        'id':id
    }
}

const getAuthors = async () => {
    const authors = await Author.findAll()

    if (authors === null) {
        return null   
    }
    
    return {
        authors
    }
}