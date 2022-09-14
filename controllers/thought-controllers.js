const {Thought, User} = require('../models');

module.exports = {
    //get all thoughts
    getAllThought(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
          .then((thought) => res.json(thought))
          .catch((err) => res.status(500).json(err));
    },
    //get on thought by id
    getThoughtById(req, res) {
        Thought.findOne({_id: req.params.thoughtsId})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thought) => 
            !thought
                ? res.status(404).json({message: 'NO THOUGHT WITH THAT ID'})
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //create thought
    //push the created thoughts id to th associate users thoughts array field
    createThought(req, res) {
        Thought.create(req.body)
            .then(({username, _id}) => {
                return User.findOneAndUpdate(
                    {username: username},
                    {$push: {thought: _id }},
                    {new: true}
                );
            })
        .then((thought) => res.json(thought))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    //update thought by id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            { runValidators: true, new: true}
        )
        .then((user) =>
            !user
                ? res.status(404).json({message: 'NO THOUGHT WITH THAT ID'})
                : res.json(user))
            
                .catch((err) => res.staus(500).json(err));
    },
    //delete thought
    //remove thought id from users thoughts field
    deleteThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId})
            .then((thought) =>
                !thought
                    ? res.status(404).json({message: 'NO THOUGHT FOUND WITH THAT ID'})
                    : User.findOneAndUpdate (
                        {thoughts: req.params.thoughtId},
                        {$pull: {thoughts: req.params.thoughtId}},
                        {new: true}
                    )
            )
            .then((user) =>
            !user
              ? res.status(404).json({ message: 'THOUGHT DELETED, BUT NO USER FOUND'})
              : res.json({ message: 'THOUGHT DELETED!' })
          )
          .catch((err) => res.status(500).json(err));
    },
    //add reaction
    addReaction (req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
          )
            .then((thought) =>
              !thought
                ? res.status(404).json({ message: 'NO THOUGHT FOUND WITH THAT ID'})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    //delete reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId }}},
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'NO THOUGHT FOUND WITH THAT ID' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
};