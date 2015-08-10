var Firebase = require('firebase'),
needle = require('needle');
_ = require('lodash');

module.exports = function(app, config) {
  var root = new Firebase(config.firebase.rootRefUrl);
  app.route('/users/register').post(function(req, res) {
    var data = req.body;
    var user = {
      name : data.name,
      accessToken : data.accessToken,
      picture: data.picture,
      email: data.email
    };
    root.child('users').child(data.uid)
      .set(user, function(err) {
        if (!err) {
          res.status(200)
            .send(data);
        };
      });
  });

  app.route('/users/:userId/team').post(function(req, res) {
   var team = req.body;
   team.members = true;
   root.child('teams').once('value', function(snap) {
     var data = snap.val();
     for (var uid in data) {
       if (uid === req.params.userId) {
        return res.json('You can create only one team');
       } 
     }

     root.child('teams').child(req.params.userId)
      .set(team, function(err) {
        if (!err) {
          res.status(200).json('Team Successfully created');
        }
      });

   });
  });

  app.route('/teams/:userId/join').post(function(req, res) {
   var member = req.body.userId;
   console.log("member: ", member);
   root.child('teams').once('value', function(snap) {
     var data = snap.val();
     for (var uid in data) {
       if (data.hasOwnProperty(uid)) {

        data[uid].members = [member];
         console.log(data[uid]);
         return;
         root.child('teams').child(req.params.userId)
         .update(data[uid], function(err) {
          if (!err) {
            res.status(200).json('Successfully joined team');
          };
         });
       }
     }

   });
  });
};
