const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");
const Profile = require("./models/profile");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Google should always return a verified email for the "email" scope,
        // but guard against a malformed profile so we fail as an auth error
        // (redirect to login) instead of crashing on a null dereference.
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "No email from Google" });
        }

        // 1. Returning Google user — matched by googleId.
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Existing account with the same email (e.g. signed up with
        //    email/password). Link Google to it instead of creating a
        //    duplicate, which would violate the unique email index.
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // 3. Brand-new user — create the account and its profile.
        user = await User.create({
          googleId: profile.id,
          email,
          username:
            email.split("@")[0] + Math.random().toString(36).substr(2, 8),
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          password: "google-oauth", // or leave blank/null if you handle it
        });
        await Profile.create({
          user: user._id,
          displayName: profile.displayName,
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
