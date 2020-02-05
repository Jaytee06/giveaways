'use strict';

const request = require('request');

const Game = require('../models/game.model');

class GameController {

    constructor() {}

    async insert(game) {
        return await new Game(game).save();
    }

    async get(query) {
        return await Game.find(query.query).sort(query.sort).skip(query.skip).limit(query.limit);
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
    async importGames(provider) {

        if( provider === 'sfGames' ) {
            return new Promise((resolve, reject) => {

                let url = 'https://publishers.softgames.com/categories/top_grossing_games.json?p=pub-16845-16872&categories=&languages=&title='

                const req = request(url, {json: true}, async (err, res, body) => {
                    if (err) {
                        console.log(err);
                        return reject(new Error(err));
                    }

                    // body = [body[0], body[1]];

                    let promise = body.map(async(sfGame) => {
                        // fix game structure
                        let game = {
                            name: sfGame.title,
                            description: sfGame.description,
                            thumb: sfGame.thumb,
                            thumbBig: sfGame.thumbBig,
                            tags:[sfGame.categories],
                            screenShots: sfGame.screenshots,
                            active: true,
                            externalSite: 'softGames',
                            rewardAmount: 1,
                            externalGameTag: sfGame.title.toLowerCase().replace(/ /g, '-')
                        };

                        game.screenShots.splice(0, 0, sfGame.teaser);

                        let g = await this.get({query:{externalSite:game.externalSite, externalGameTag: game.externalGameTag}, sort:"-createdAt", skip:0, limit:1000});
                        if( !g.length ) await this.insert(game);
                    });

                    await Promise.all(promise);

                    resolve(true);
                });
                req.on('error', function (err) {
                    reject(err);
                });
                req.end();
            });
        }

    }
}

module.exports = GameController;