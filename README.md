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

JWT not required.

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

#### POST

`POST '/api/v1/saved_routes/:user_id'`

```
{
 headers: {
   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoibmV3bWFpbGxAbWFpbC5jb20ifSwiaWF0IjoxNTM1OTA1NzA0LCJleHAiOjE1MzYwNzg1MDR9.qbm6hfCCxmNZut7q7CeaOzdTRp0dEG_WM4xE7dsFGcs",
   "Content-Type: "application/json"
 },
 body: {
   email: "someone@email.com"
 }
}
```
