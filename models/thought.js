//require schema and model from mongoose
const mongoose = require('mongoose');

//construct a new instance of the schema class
const thoughtsSchema = new mongoose.Schema({
    //configure individual properties using schema types
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },

    username: {
        type: String,
        required: true,
    },

    reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);
thoughtsSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
  });

  const reactionSchema = new mongoose.Schema({
    //configure individual properties using schema types
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
},
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

  
  const Thought = model("Thought", thoughtsSchema);
  
  module.exports = Thought;