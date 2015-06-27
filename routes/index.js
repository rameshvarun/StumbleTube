//Index page
module.exports = function(req, res) {
  //If the user is already logged in, take them to the player
  if(req.session.tokens) res.redirect('/player');
  else res.render( 'index.html', { loginurl: GAUTH_URL })
};
