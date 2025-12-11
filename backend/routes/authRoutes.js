// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ 
      loggedIn: true, 
      user: req.session.user,
      sessionId: req.sessionID,
      sessionStore: "MongoDB"
    });
  } else {
    res.json({ 
      loggedIn: false,
      sessionId: req.sessionID,
      sessionStore: "MongoDB"
    });
  }
});

// Debug endpoint to check session health
router.get("/session-debug", (req, res) => {
  res.json({
    sessionId: req.sessionID,
    sessionData: req.session,
    cookies: req.headers.cookie,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;