import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert("./src/config/sethor-7e29f-firebase-adminsdk-by1dk-e5d2aaac84.json")
});

export default admin;