import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Schema takes one argument - an object :) 
// camelCase for Schema
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please enter a message."],
    unique: true,  // from a technical perspective unique: true is not a validator the same as required: true. https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
    trim: true,
    minlength: [5, 'Oops your message needs to be longer than 5 characters'],
    maxlength: [140, 'Oops, message is too long! Max length is 140 characters']
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  author: {
    type: String,
    default: 'Anonymous',
  }
})

// PascalCase for model
// Two arguments ---> 1. name of collection 2. schema
const Thought = mongoose.model('Thought', thoughtSchema)

app.get('/', (req, res) => {
  res.send(listEndpoints(app)),
  res.json({
    message:
      'Hello all thoughts! View all thoughts at https://caro-happy-thoughts.netlify.app/', // add Netlify link to json NOT working, WHY? 
  })
})

// GET This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
// using built in Mongoose methods - otherwise we would need to use .Aggregate([])
app.get('/thoughts', async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: 'descending' }) // or createdAt: 1 äldsta först // -1 senaste först.
      .limit(20)
      .exec()
    res.status(200).json({ length: allThoughts.length, data: allThoughts })
  } catch(err) {
    res
      .status(400)
      .json({ errors: err.errors }) // add a message here when I have seen what could go wrong and which error message pops up.
  }
})

// POST new thought, --> request specify: POST, header, body
// In the POST /thoughts endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to 400 (bad request).
app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({
      message: req.body.message,
      author: req.body.author
    }).save()
    res.status(200).json({ data: newThought })  
  } catch (error) {
    if (error.code === 11000) {
    res.status(400).json({ message: 'Duplicated value', fields: error.keyValue }) //coming from the unique error object (error) in Postman
    }
    res.status(400).json(error)
  }
})

// POST - update like/heart property on on thought object
app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
 // go to the storage and update the amount of hearts IN the storage
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id, 
      { $inc: {
          hearts: 1 
        }
      },
      {
        new: true
      },
    ) 
    if (updatedThought) {
      res.status(200).json({ data: updatedThought })
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Delete thought by id
app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params

  try {                           // specify the model = Thought
    const deletedThought = await Thought.findByIdAndDelete(id) 
    if (deletedThought) {
      res.status(200).json({data: deletedThought})
    } else {
      res.status(404).json({ message: 'Not found' })
    } 
  } catch (error) { 
    res.status(400).json({ message: 'Invalid request', error }) // feature of ES6 key and value are the same (before error: error)
  }
})

// PUT ----> do this --> CHANGE to PUT + change in FRONTEND as well. POST is very generic!
// update the object 
app.put('/thoughts/:id', async (req, res) => {
  const {id} = req.params

  try {                                                   // 3 arguments: 1. id 2. object of the field/s we want to update 3. { new : true } 
    const updatedThought = await Thought.findOneAndReplace({ _id: id }, req.body, { new: true }) //specify what do we want to update = backend send back the new updated object
    if (updatedThought) {
      res.status(200).json({ data: updatedThought })
    } else {
      res.status(404).json({ message: 'Not found'})
    }
  } catch(error) {
    res.status(400).json({ message: 'Invalid request', error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
