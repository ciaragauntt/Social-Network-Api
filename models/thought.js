//require schema and model from mongoose
const {Schema, model, Types} = require('mongoose');

const reactionSchema = new Schema({
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
        get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),
    },
},
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);
//construct a new instance of the schema class
const thoughtsSchema = new Schema({
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
        get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a'),
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
            getters: true
        },
        id: false,
    }
);
thoughtsSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
  });

  const Thought = model("Thought", thoughtsSchema);
  
  module.exports = Thought;