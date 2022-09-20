const {Thoughts, User} = require('../models');

module.exports = {
    //get all thoughts
    getAllThought(req, res) {
        Thoughts.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
          .then((thoughts) => res.json(thoughts))
          .catch((err) => res.status(500).json(err));
    },
    //get on thought by id
    getThoughtById(req, res) {
        Thoughts.findOne({_id: req.params.id})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then((thoughts) => 
            !thoughts
                ? res.status(404).json({message: 'NO THOUGHT WITH THAT ID'})
                : res.json(thoughts)
        )
        .catch((err) => res.status(500).json(err));
    },
    //create thought
    //push the created thoughts id to th associate users thoughts array field
    createThought(req, res) {
        Thoughts.create(req.body)
            .then(({username, _id}) => {
                return User.findOneAndUpdate(
                    {username: username},
                    {$push: {thoughts: _id }},
                    {new: true, runValidators: true}
                );
            })
        .then((thoughts) => res.json(thoughts))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    //update thought by id
    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            { runValidators: true, new: true}
        )
        .then((thoughts) =>
            !thoughts
                ? res.status(404).json({message: 'NO THOUGHT WITH THAT ID'})
                : res.json(thoughts))
            
                .catch((err) => res.staus(500).json(err));
    },
    //delete thought
    //remove thought id from users thoughts field
    deleteThought( req, res) {
        Thoughts.findOneAndDelete({ _id: req.params.id })
            .then(({ username }) => {
                return User.findOneAndUpdate(
                    { username: username },
                    { $pull: { thoughts: req.params.id } },
                    { new: true }
                )
            })
            .then(user => {
                if (user) {
                    res.status(404).json({ message: 'No user found at this id' });
                    return;
                }

                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
    //add reaction
    addReaction (req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true }
          )
            .then((thoughts) =>
              !thoughts
                ? res.status(404).json({ message: 'NO THOUGHT FOUND WITH THAT ID'})
                : res.json(thoughts)
            )
            .catch((err) => res.status(500).json(err));
    },
    //delete reaction
    removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId }}},
          { runValidators: true, new: true }
        )
          .then((thoughts) =>
            !thoughts
              ? res.status(404).json({ message: 'NO THOUGHT FOUND WITH THAT ID' })
              : res.json(thoughts)
          )
          .catch((err) => res.status(500).json(err));
      },
};