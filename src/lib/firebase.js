import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
export var useAuthentication = function () {
    var _a = useState(), app = _a[0], setApp = _a[1];
    var _b = useState(), auth = _b[0], setAuth = _b[1];
    var _c = useState(), db = _c[0], setDb = _c[1];
    var _d = useState(), user = _d[0], setUser = _d[1];
    var firebaseConfig = {
        apiKey: 'AIzaSyD5py7LKDwgqD3eWT8aqbz5nLrdAN_nkQE',
        authDomain: 'project-beta-407300.firebaseapp.com',
        projectId: 'project-beta-407300',
        storageBucket: 'project-beta-407300.appspot.com',
        messagingSenderId: '228605374820',
        appId: '1:228605374820:web:eafa82421da1a679bbca71',
    };
    useEffect(function () {
        var fbApp = initializeApp(firebaseConfig);
        var authObj = getAuth(fbApp);
        var userObj = authObj.currentUser;
        var dbApp = getFirestore(fbApp);
        setUser(userObj);
        setApp(fbApp);
        setDb(dbApp);
        setAuth(authObj);
    }, []);
    return { app: app, auth: auth, db: db, user: user };
};
//# sourceMappingURL=firebase.js.map