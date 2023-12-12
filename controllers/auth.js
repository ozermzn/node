exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[2].trim().split("=")[1];
  const isLoggedIn = true;
  console.log(req.session.isLoggedIn);
  res.render("shop/login", {
    path: "/login",
    pageTitle: "Login",
    isLoggedIn: isLoggedIn,
  });
};
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};
