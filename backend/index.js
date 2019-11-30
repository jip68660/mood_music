import { https } from 'firebase-functions';

import { initializeApp, database } from 'firebase-admin';
initializeApp();

export const addMessage = https.onRequest(async (req, res) => {
    const original = req.query.text;
    const snapshot = await database().ref('/messages').push({ original: original });
    res.redirect(303, snapshot.ref.toString());
});