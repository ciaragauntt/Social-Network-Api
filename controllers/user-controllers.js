const {User, Thought} = require('../models');

module.exports = {
    // Get all Users
    getAllUsers(req, res) {
        User.find()
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // Get a User
    getUserById(req, res) {
        User.findOne({_id: req.params.userId})
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'NO USER WITH THAT ID'})
                    : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Create a User
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a user
    deleteUser( req, res) {
        User.findOneAndDelete({_id: req.params.userId})
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'NO USER WITH THAT ID'})
                    : Thought.deleteMany({_id: { $in: user.thoughts}})
                )
                .then(() => res.json({ message: 'USER AND THOUGHT DELETED'}))
                .catch((err) => res.status(500).json(err));
    },
    // Update User
    updateUser(req, res) {
        User.findOneAndUpdate (
            {_id: req.params.userId},
            { $set: req.body},
            { runValidators: true, new: true}
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'NO USER WITH THAT ID'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Add a Friend
    addFriend(req, res) {
        User.finOneAndUpdate (
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            { runValidators: true, new: true}
        )
        .then((user) => 
            !user
                ? res.status(404).json({message: 'NO USER FOUND WITH THAT ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete a Friend
    removeFriend(req, res) {
        User.findOneAndDelete(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then((user) =>
            !user
                ? res.status(404).json({message: 'NO USER FOUND WITH THAT ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};