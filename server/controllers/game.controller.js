'use strict';
const Game = require('../models/game.model');

class GameController {

    constructor() {}

    async insert(game) {
        return await new Game(game).save();
    }

    async get(query) {
        return await Game.find();
    }

    async getById(id) {
        return await Game.findById(id);
    }

    async update(id, game) {
        return await Game.findByIdAndUpdate(id, game, {new: true});
    }
    async remove(id) {
        return await Game.findByIdAndRemove(id);
    }
}

module.exports = GameController;