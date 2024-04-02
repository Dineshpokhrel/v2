import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; 
import dotenv from "dotenv"
import axios from 'axios'; 

dotenv.config({
  path: './.env'
})

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL =  process.env.GOOGLE_CALLBACK_URL;

passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL,
    authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenURL: "https://oauth2.googleapis.com/token",
    scope: [
        "profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
    ],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
        console.log(user);
        return done(null, user);
      } else {
        const userEmail = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (!userEmail) {
          return done(new Error('User email not found in profile'));
        }

        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: userEmail,
          accessToken, 
          refreshToken,
        });
        
        if (profile.photos && profile.photos.length > 0) {
          const photoUrl = profile.photos[0].value;
          const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
          if (response && response.data) {
            const imageBuffer = Buffer.from(response.data, 'binary');
            user.profileImage = {
              data: imageBuffer,
              contentType: response.headers['content-type'],
            };
          }
        }

        await user.save();
        console.log(user);
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  }
));

export default passport;
