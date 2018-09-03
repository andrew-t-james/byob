# Build Your Own Backend &middot; [![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![Build Status](https://travis-ci.org/andrew-t-james/byob.svg?branch=master)](https://travis-ci.org/andrew-t-james/byob)

### Some Catchy Text Here

#### GET

`GET '/api/v1/users'`

`JWT` not required. Users endpoint will return a current list of all users in the following format.

```
[
    {
        "id": 1,
        "first_name": "Ty",
        "last_name": "Tanic",
        "created_at": "2018-08-30T22:02:31.433Z",
        "updated_at": "2018-08-30T22:02:31.433Z"
    },
    {
        "id": 2,
        "first_name": "Will",
        "last_name": "Smith",
        "created_at": "2018-08-30T22:02:31.437Z",
        "updated_at": "2018-08-30T22:02:31.437Z"
    }
]
```

`GET '/api/v1/saved_routes'`

JWT not required. Saved Routes endpoint will return a current list of all saved routes in the following format.

```
[
    {
        "id": 1,
        "name": "Home",
        "start_location": "Union Station T1",
        "end_location": "40th & Colorado Station",
        "user_id": 1,
        "created_at": "2018-08-31T23:56:17.044Z",
        "updated_at": "2018-08-31T23:56:17.044Z"
    },
    {
        "id": 2,
        "name": "Your house",
        "start_location": "Denver Airport Station",
        "end_location": "38th & Blake Station",
        "user_id": 2,
        "created_at": "2018-08-31T23:56:17.044Z",
        "updated_at": "2018-08-31T23:56:17.044Z"
    },
]
```

#### Authentication

`GET '/api/v1/authentication'`
A request will return a `JWT` in the following format. For use with protected routes. If you do not have an email ending in `@turing.io` you will not be authenticated but you will still be able to obtaina `JWT`.

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibmV3bWFpbGxAdHVyaW5nLmlvIiwiYXBwX25hbWUiOiJteSBuZXcgYXBwIn0sImlhdCI6MTUzNTkxMTcyOSwiZXhwIjoxNTM2MDg0NTI5fQ._gey5IM5PHyfiMfjsJ8ZYGpyRFrytDfhnR-WU8ipwj8"
}
```

#### Protected Routes

**All of the following Protected routes require the following auth configuration to make a request**

```
{
 headers: {
   "Authorization": "Bearer JWT_GOES_HERE_INSIDE_THE_STRING",
   "Content-Type: "application/json"
 },
 body: {
   email: "someone@turing.io",
   app_name: "some app name"
 }
}
```

1. **GET** user saved routes: `/api/v1/saved_routes/:user_id`

> **Will return saved routes in following format**

```
[
    {
        "id": 1,
        "name": "Home",
        "start_location": "Your moms house",
        "end_location": "40th & Colorado Station",
        "user_id": 1,
        "created_at": "2018-09-02T17:47:42.006Z",
        "updated_at": "2018-09-02T17:47:42.006Z"
    },
    {
        "id": 31,
        "name": "My New Fave Spot",
        "start_location": "Union Station",
        "end_location": "38th and Colorado",
        "user_id": 1,
        "created_at": "2018-09-02T18:23:45.248Z",
        "updated_at": "2018-09-02T18:23:45.248Z"
    }
]
```

2. **POST** user new route to user: `/api/v1/saved_routes/:user_id`

> **On success will return in the following format**

```
[
    {
        "id": 31,
        "name": "My New Fave Spot",
        "start_location": "Union Station",
        "end_location": "38th and Colorado",
        "user_id": 1,
        "created_at": "2018-09-02T18:23:45.248Z",
        "updated_at": "2018-09-02T18:23:45.248Z"
    }
]
```

3. **PATCH** a users saved route: `/api/v1/saved_routes/:user_id`

> **On success will return `1`**

4. **DELETE** delete a users saved route: `/api/v1/saved_routes/:user_id`

> **On success will return `1`**
