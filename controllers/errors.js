exports.getError404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page not found",
    isLoggedIn: req.session.isLoggedIn,
  });
};
exports.getError500 = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "500",
    isLoggedIn: req.session.isLoggedIn,
  });
};
