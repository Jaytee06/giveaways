'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('../config/config');
//const admin = require('firebase-admin').initializeApp(config.firebase);
const admin = require('firebase-admin');
console.log(config.firebase);
admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
});

class FireStoreController {

    constructor() {}

    async instertNotification(userId, noti) {
        let db = admin.firestore();
        let document = db.collection('notifications').doc(userId+'');

        noti._id = mongoose.Types.ObjectId()+'';
        noti.created = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        document.update({
            pending:admin.firestore.FieldValue.arrayUnion(noti._id),
            notSeen:admin.firestore.FieldValue.arrayUnion(noti._id),
            notis:admin.firestore.FieldValue.arrayUnion(noti)
        }).catch(async(err) => {
            document.set({pending:[noti._id], notSeen:[noti._id], notis:[noti]});
        });
    }
}

module.exports = FireStoreController;