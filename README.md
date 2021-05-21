# Project Happy Thoughts API
This was part of week 19 in the Technigo bootcamp. I've created an API with GET, POST, DELETE and PUT endpoints to the week 11 FrontEnd project Happy Thoughts. 

## Endpoints
The API has the following endpoints 

| METHOD | Path                                      | Description                                                                            |
| :------|------------------------------------------ | --------------------------------------------------------------------------------------:|
| https://caroline-happy-thoughts-api.herokuapp.com/ | Welcome page - contains a list of available routes                                     |
| GET    | /thoughts                                 | Endpoint that returns 20 thoughts, sorted by createdAt to show the most recent thoughts first. |
| POST | /thoughts                                   | POST a new thought                                                                     |
| POST | thoughts/:id/like                           | Update like/heart property on a thought object                                         |
| DELETE | /thoughts/:id                             | Delete a thought                                                                       |
| PUT | /thoughts/:id                                | Update thought object by id                                                            |

## TECH
- MongoDB
- Mongoose
- Node
- Express
- JavaScript
- Heroku
- MongoDB Atlas & Compass
- Postman

## Reflections
It was a useful exercise to see that I sent in data in another format than the frontend expected when I first created the endpoints, and then it was a quick fix. Otherwise I enjoyed connecting back- and frontend for the first time this week, although I am not a hundred that everything has landed yet.

If I had more time I would continue to experiement with features that created a virtual "contract" between the frontend and the backend such as  pagination, or experiment with infinite scrolling on the frontend part. 

## View it live
Backend: https://caroline-happy-thoughts-api.herokuapp.com/
|:-----------------------------------------------------------------------------------------------------------------------------------------------:|
FrontEnd - view all thoughts at: https://caro-happy-thoughts.netlify.app/
