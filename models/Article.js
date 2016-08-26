// require mongoose
var mongoose = require('mongoose');

// mongoose allows for schemas in MongoDB
// descries data construct of a 'document'
// create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is required
  title: {
    type:String,
    required:true
  },
  // link is required
  link: {
    type:String,
    required:true
  },
  text: {
    type:String,
    required:true
  },
  imagePath: {
    type:String
  },
  imageData: {
    data:Buffer,
    contentType: String
  },
  imageData: {
    type:String
  },
  // the word 'default' is a Javascript reserved word. BP to wrap in quotes
  createdOn: {
    type:Date,
    'default':Date.now 
  },
  // this only saves one note's ObjectId. ref refers to the Note model.
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }
});

// a 'model' is a complied version of the schema
// one instance of the model will map to one 'document' in the database
// it is the model that handles the CRUD of documents
// Create the Article model with the ArticleSchema
var Article = mongoose.model('Article', ArticleSchema);

// export the model
module.exports = Article;

// ****************** COLLECTION NAME *************************
//  BP - use singular noun when naming model.  MongoDB collection will be pluralized version of model name.
//  To override this, when defining ArticleSchema, 
//          include collection: 'nameOfCollection'
//  -OR - when building a model, send a third argument
//          mongoose.model('Article', ArticleSchema, 'nameOfCollection');


// ****************** TYPES OF DATA ***************************************
// 8 types of data that can be set in a mongoose schema
// string, number, date, boolean, buffer, objectId, mixed, array
// string - UTF-8 encoded
// number - mongoose does not natively support long and double datatypes. cann
//    be extended using plugins
// date - ISODate object
// boolean - true or false
// buffer - primarily used for storing binary information
// ObjectId - used to assign unique identifier to a key other than _id, for example,
//   a foreign key for referencing another document.  Must specify fully qualified version
//   example:  ArticleSchema.add({owner: mongoose.Schema.Type.ObjectId});
// mixed - can be any type of data.  Can be declared by {} or Schema.Types.Mixed
//   mongoose cannot automatically see changes made to 'mixed' type of adata.  Must
//   manually declare when the data is changed.  Use 'markModified' method.
//   tracking changes to Mixed type:
//     dj.mixedUp = { valueone: "a new value"};
//     dj.markModified('mixedUp');
//     dj.save();
// array - 2 uses: (1) simple array of values of the same data type, or
//     (2) collection of subdocuments using nested schemas
//      WARNING - declare as "Array" instead of "[]" unless you want a 'mixed' type.
// OTHER custom Schema Types available with extension method through Mongoose plugins.  examples: long, double, RegEx and email

//****************** OPTIONS FOR DDOCUMENT DATA ********************
// unique: true / false
//   - checked when saving to database.  If finds pre-existing document, MongoDB will return an E11000 error  This approach also defines a MongoDB index on that field
