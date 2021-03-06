var express = require('express');
var router = express.Router();
var paths = require( '../../paths.js' );
var Sequencer = require( paths.models + '/sequencerModel.js');
var levelsController = require( paths.controllers + '/levelsController.js' );
var usersController = require( paths.controllers + '/usersController.js' );
var matchController = require( paths.controllers + '/matchController.js' );

module.exports = function( passport ) {
  router.use( levelsController.getLastLevel );

  // Authenticate requests to '/'
  router.use( '/', usersController.findUserById );
  router.get( '/', function( request, response, next ) {
    if ( request.isAuthenticated( ) ) {
      response.sendFile( paths.index );
    } else {
      response.sendFile( paths.index );
    }
  });

  router.use( '/', express.static( paths.root ) );
  router.use( '/samples', express.static( paths.samples ) );

  /* Handle Login POST */

  router.post('/login', passport.authenticate('login', {
    failureRedirect: '/'
  }), usersController.findUserById, function (req, res) {
    res.status(200).end();
  });

  /* Handle Signup POST */

  router.post( '/signup', passport.authenticate('signup', {
    failureRedirect: '/'
  }), usersController.findUserById, function (req, res) {
    res.status(200).end();
  });

  /* Handle Logout */
  router.post('/logout', function( request, response ) {
    request.logout( );
    response.status( 200 ).end();
  });

  /* Handle requests to '/users' */
  router.get( '/auth', usersController.findUserById, function ( request, response ) {
      response.status( 200 ).send();
  });

  router.get( '/users/all', usersController.getUsers );

  /* Handle Requests to '/levels' */

  router.get( '/levels/:id', levelsController.getLevel );
  router.get( '/levels' , levelsController.getLevels );
  router.post( '/levels', levelsController.saveLevel );
  router.delete( '/levels/:id', levelsController.deleteLevel );
  router.put( '/levels', levelsController.updateLevel );

  router.post('/match', matchController.createMatch );
  router.get('/match', matchController.getAllMatches );
  router.get('/match/:id', matchController.getMatchById );
  router.put('/match/:id', matchController.updateMatch );

  return router;

};
