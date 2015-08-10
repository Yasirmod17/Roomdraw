angular.module('RoomDraw.services')
  .factory('Refs', ['$cookies', '$firebase',
    function($cookies, $firebase) {
      var rootRef = new Firebase($cookies.rootRef || 'YOUR_FIREBASE_URL');     
      
      // define every standard ref used application wide
      return {
        root: rootRef,
        users: rootRef.child('users'),
        iterations: rootRef.child('iterations'),
        year: rootRef.child('iterations').child('2015'),
        groups :rootRef.child('iterations').child('2015').child('groups'),
        shuffled :rootRef.child('iterations').child('2015').child('shuffled_luv'),
      };
    }
  ]);
