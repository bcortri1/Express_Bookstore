//Tests for books.js
process.env.NODE_ENV = "test"
const request = require("supertest");
const app = require("../app");
const db = require("../db");



const testBook1 = {
    isbn: "111111111",
    amazon_url: "https://amazon.com/TheHangerGangs",
    author: "Me",
    language: "English",
    pages: 100,
    publisher: "District 27 Publishing",
    title: "The Hanger Gangs",
    year: 2023
}

const testBook2 = {
    isbn: "222222222",
    amazon_url: "https://amazon.com/Celcius100",
    author: "You",
    language: "English",
    pages: 200,
    publisher: "Burn It Publishing",
    title: "Celcius 100: The Boiling",
    year: 2022
}

const badBook1 = {
    isbn: "3333333333",
    amazon_url: "https://amazon.com/Fake100",
    author: "You",
    language: "Fakese",
    pages: 999,
    publisher: "Fake It Publishing",
    title: "Fake 100: The Faking"

}

const badBook2 = {
    isbn: "4444444444",
    amazon_url: "https://amazon.com/Fake200",
    author: "Faker Fake",
    language: "Fakese",
    pages: 999,
    publisher: "Fake It Publishing",
    title: "Fake 200: Dark Fake",
    year: 2077,
    FakeBook: "Fake extra data"
}

beforeEach(async function () {
    let result = await db.query(`INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)`, Object.values(testBook1));
});

afterEach(async function () {
    await db.query("DELETE FROM BOOKS");
});


afterAll(async function () {
    await db.end()
});

//GET Tests ===============================================================================
describe("GET /books", function () {
    test("Gets all books", async function () {
        const response = await request(app).get(`/books`);
        const book = response.body.books[0];
        expect(book.isbn).toEqual(testBook1.isbn);
        expect(book.amazon_url).toEqual(testBook1.amazon_url);
        expect(book.author).toEqual(testBook1.author);
        expect(book.language).toEqual(testBook1.language);
        expect(book.pages).toEqual(testBook1.pages);
        expect(book.publisher).toEqual(testBook1.publisher);
        expect(book.title).toEqual(testBook1.title);
        expect(book.year).toEqual(testBook1.year);
    });
});

describe("GET /books/:isbn", function () {
    test("Gets a book", async function () {
        const response = await request(app).get(`/books/${testBook1.isbn}`)
        const book = response.body.book;
        expect(book.isbn).toEqual(testBook1.isbn);
        expect(book.amazon_url).toEqual(testBook1.amazon_url);
        expect(book.author).toEqual(testBook1.author);
        expect(book.language).toEqual(testBook1.language);
        expect(book.pages).toEqual(testBook1.pages);
        expect(book.publisher).toEqual(testBook1.publisher);
        expect(book.title).toEqual(testBook1.title);
        expect(book.year).toEqual(testBook1.year);
    });

    test("Gets an invalid book", async function () {
        const response = await request(app).get(`/books/${badBook1.isbn}`)
        expect(response.statusCode).toBe(404);
    });
});

//POST Tests =============================================================================
describe("POST /books", function () {
    test("Creates a book", async function () {
        const response = await request(app).post(`/books`).send(testBook2);
        const book = response.body.book;
        expect(response.statusCode).toBe(201);
        expect(book.isbn).toEqual(testBook2.isbn);
        expect(book.amazon_url).toEqual(testBook2.amazon_url);
        expect(book.author).toEqual(testBook2.author);
        expect(book.language).toEqual(testBook2.language);
        expect(book.pages).toEqual(testBook2.pages);
        expect(book.publisher).toEqual(testBook2.publisher);
        expect(book.title).toEqual(testBook2.title);
        expect(book.year).toEqual(testBook2.year);
    });

    test("Creates a book without a year", async function () {
        const response = await request(app).post(`/books`).send(badBook1);
        expect(response.statusCode).toBe(400);
    });
});

//PUT Tests =============================================================================
describe("PUT /books/:id", function () {
    test("Updates a book", async function () {
        let editBook = Object.create(testBook1)
        editBook.author = "John Smith"
        const response = await request(app).put(`/books/${editBook.isbn}`).send(editBook);
        const book = response.body.book;
        expect(book.isbn).toEqual(editBook.isbn);
        expect(book.author).toBe("John Smith");
    });

    test("Nonexistent book update", async function () {
        const response = await request(app).put(`/books/${badBook1.isbn}`).send(badBook1);
        expect(response.statusCode).toBe(400);
    });

    test("Updates book with invalid data", async function () {
        const response = await request(app).put(`/books/${testBook1.isbn}`).send(badBook2)
        expect(response.statusCode).toBe(400);
    });
});

//DELETE Tests =============================================================================
describe("DELETE /books/:id", function () {
    test("Deletes a book", async function () {
        let response = await request(app).delete(`/books/${testBook1.isbn}`)
        expect(response.body).toEqual({ message: "Book deleted" });
        response = await request(app).get(`/books`);
        expect(response.body.books).toEqual([]);
    });
});
