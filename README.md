<p align="center" id="top">
  <img loading="lazy" src="https://res.cloudinary.com/omzi/image/upload/v1623254340/node-json-api.png" alt="Node JSON API logo">
</p>
<h4 align="center">An advanced, production-grade Node JSON API with CRUD functionalities🚩</h4>
<br>
<div>

<div align="center">

[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-purple.svg?style=flat)](https://github.com/omzi/node-book-api/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
![](https://img.shields.io/twitter/follow/o_obioha.svg?style=social&label=@o_obioha)

</div>
<br>


## **API Documentation** 📝

### Indices

* [Authentication 🔐](#authentication)

  * [Forgot Password](#1-forgot-password)
  * [Get Logged In User Details](#2-get-logged-in-user-details)
  * [Login User](#3-login-user)
  * [Logout User](#4-logout-user)
  * [Register User](#5-register-user)
  * [Reset Password](#6-reset-password)

* [Books 📘](#books)

  * [Add A Book](#1-add-a-book)
  * [Delete A Book](#2-delete-a-book)
  * [Get A Book](#3-get-a-book)
  * [Get All Books](#4-get-all-books)
  * [Update A Book](#5-update-a-book)


--------

<h2 id"authentication"><b>Authentication</b></h2>

Contains **ALL** routes for user authentication (register, login, reset password, etc).


### **1**. Forgot Password
Generate password token & send a reset URL email to the email address if valid.

***Endpoint:***
```bash
Method: POST
Type: RAW (JSON)
URL: https://json-node-api.herokuapp.com/api/v1/auth/forgotPassword/
```

***Headers:***
| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON Content Type |

***Body:***
```js        
{
    "email": "john@example.com"
}
```


### **2**. Get Logged In User Details
Get the details of the current logged in user. This can be helpful when user details are required in a Front-End with any CRUD action.

***Endpoint:***
```bash
Method: GET
URL: https://json-node-api.herokuapp.com/api/v1/auth/me/
```


### **3**. Login User
Validates the credentials passed in. Returns a JWT token & cookie.

***Endpoint:***
```bash
Method: POST
Type: RAW (JSON)
URL: https://json-node-api.herokuapp.com/api/v1/auth/login/
```

***Headers:***
| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON Content Type |

***Body:***
```js        
{
    "email": "john@example.com",
    "password": "Qwert0"
}
```


### **4**. Logout User
Clears out token cookie.

***Endpoint:***
```bash
Method: GET
URL: https://json-node-api.herokuapp.com/api/v1/auth/logout/
```


### **5**. Register User
Creates a user if account with email address sent is non-existing. Returns a JWT token & cookie.


***Endpoint:***
```bash
Method: POST
Type: RAW (JSON)
URL: https://json-node-api.herokuapp.com/api/v1/auth/register/
```

***Headers:***
| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON Content Type |


***Body:***
```js        
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Qwert0"
}
```


### **6**. Reset Password
Checks if the reset token sent is valid & updates the validated password respectively.

***Endpoint:***
```bash
Method: PUT
Type: RAW (JSON)
URL: https://json-node-api.herokuapp.com/api/v1/auth/resetPassword/8a9f8b89881ad27f0cb0150f2ede3ef15115fc25
```

***Headers:***
| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON Content Type |

***Body:***
```js        
{
    "password": "Qwert0"
}
```

<br>

<h2 id"books"><b>Books</b></h2>

Books **CRUD** functionality. This includes routes for
- Getting all books
- Getting a single book
- Adding a book
- Updating a book
- Deleting a book


### **1**. Add A Book
***Endpoint:***

```bash
Method: POST
Type: RAW (JSON)
URL: https://json-node-api.herokuapp.com/api/v1/books/
```

***Headers:***
| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON Content Type |

***Body:***
```js        
{
    "title": "The Debugger",
    "price": 10.99,
    "author": "Omezibe Obioha",
    "datePublished": "06-09-2021",
    "pages": 153,
    "publisher": "Diamonds Books 💎",
    "description": "This book talks about the \"adventures\" of the author in his programming journey so far: the good, bad, and ugly.",
    "isbn": "9876543210"
}
```

### **2**. Delete A Book

***Endpoint:***

```bash
Method: DELETE
URL: https://json-node-api.herokuapp.com/api/v1/books/e297d1d4-8050-4368-85c2-75aa7e8c5c04/
```

### **3**. Get A Book

***Endpoint:***

```bash
Method: GET
URL: https://json-node-api.herokuapp.com/api/v1/books/e297d1d4-8050-4368-85c2-75aa7e8c5c05/
```

### **4**. Get All Books

***Endpoint:***

```bash
Method: GET
URL: https://json-node-api.herokuapp.com/api/v1/books/
```

***Query Params:***

| Key | Value | Description |
| --- | ------|-------------|
| select | title,author,price,isbn | Allows you to select the fields you want the API to send. By default, ALL fields are sent. Also, the "id" field can't be deselected. |
| limit | 5 | Sets the number of records the APi sends per request. The default value is 5. |
| page | 1 | Allows to navigate to a "page" to get the next or previous set of records as required. The default value is 1. |

<br>

### **5**. Update A Book

***Endpoint:***

```bash
Method: PUT
Type: RAW (JSON)
URL: https://json-node-api.herokuapp.com/api/v1/books/e297d1d4-8050-4368-85c2-75aa7e8c5c05/
```

***Headers:***

| Key | Value | Description |
| --- | ------|-------------|
| Content-Type | application/json | JSON Content Type |


***Body:***

```js        
{
    "title": "Purple Hibiscus (Revised Edition)"
}
```

---
[Back To Top ↺](#top)
> Made with &#9829; by [Omzi](https://github.com/omzi)
