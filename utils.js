function getUser(req) {
  const userAuthToken = req.header["authorization"].split(" ")[1];
  if (userAuthToken) {
    jwt.verify(userAuthToken, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return null;
      } else {
        return user;
      }
    });
  } else {
    return null;
  }
}
module.exports = {
  getUser,
};
