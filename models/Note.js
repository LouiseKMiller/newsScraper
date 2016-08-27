// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the Note schema
var NoteSchema = new Schema({
  // just a string
  user: {
    type:String
  },
  // just a string
  body: {
    type:String
  },
  lastUpdate: {
  	type:Date
  }
});

NoteSchema.methods.lastUpdatedDate = function(){
  // make lastUpdatedDate the ccurrent date
  this.lastUpdated = Date.now();
  // return this new date
  return this.lastUpdated;
};
// Remember, Mongoose will automatically save the ObjectIds of the notes.
// These ids are referred to in the Article model.

// create the Note model with the NoteSchema
var Note = mongoose.model('Note', NoteSchema);

// export the Note model
module.exports = Note;
