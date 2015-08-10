angular.module('RoomDraw.services')
  .factory('Authentication', ['$timeout', '$cookies', '$http', '$rootScope', 'Refs', '$location',
    function($timeout, $cookies, $http, $rootScope, Refs,$location) {
      return {
        login: function(cb) {
          var self = this, options = { remember: true, scope: "email" };
          Refs.root.authWithOAuthPopup("google", function(error, authData) {
            if(cb) cb(error, authData);

            var user = {
              uid: authData.uid,
              name: authData.google.displayName,
              email: authData.google.email,
              accessToken: authData.google.accessToken,
              picture: authData.google.cachedUserProfile.picture
            };

            $http.post('/users/register', user)
              .success(function(data){
                // console.log(data);
                $timeout(function() {
                  self.user = data;
                });
                Materialize.toast('You have successfully logged in!', 5000, 'teal accent-4');
                return;
              })
              .error(function(error) {
                console.log(error);
              });

            // console.log(authData);
          }, options);
        },

        logout: function() {
          Refs.root.unauth();
          $rootScope.currentUser = null;
        },

        auth: function() {
          var self = this;
          // Refs.root.onAuth(function(authData) {
          //   if(authData) {
          //     var user = {
          //       uid: authData.uid,
          //       name: authData.google.displayName,
          //       email: authData.google.email,
          //       accessToken: authData.google.accessToken,
          //       picture: authData.google.cachedUserProfile.picture
          //     };
          //     $rootScope.currentUser = user;
          //   }
          //   else {
          //     Authentication.logout();
          //   }
          // });

          // are we dealing with a new user? find out by checking for a user record
          // var userRef = Refs.users.child(authData.uid);
          // userRef.once('value', function(snap) {
          //   var user = snap.val();

          //   if(user) {
          //     // google user logging in, update their access token
          //     if(authData.provider === "google") {
          //       userRef.update({access_token: authData.token});
          //     }
          //     // save the current user in the global scope
          //     $rootScope.currentUser = user;
          //     // navigate to home page
          //     // $state.go('default');
          //   }
          //   else {
          //     // construct the user record the way we want it
          //     user = self.buildUserObjectFromGoogle(authData);
          //     // save it to firebase collection of users
          //     userRef.set(user);
          //     // save the current user in the global scope
          //     $rootScope.currentUser = user;
          //     // navigate to home page
          //     // $state.go('default');
          //   }

          //   // ...and we're done
          //   return cb(user);
        }
      };
    }
  ]);
