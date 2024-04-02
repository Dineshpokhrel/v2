import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import { connectDB, createMongoStore } from './config/db.js';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import publicEventRoutes from './routes/publicEventRoutes.js'
import horoscopeRoutes from './routes/horoscopeRoutes.js'
import cors from 'cors';

dotenv.config({
  path: './.env'
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


app.use(cors({
  origin:"http://localhost:",
  methods:"GET,POST,PUT,DELETE",
  credentials:true
}));

connectDB();


const mongoStore = await createMongoStore();


app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Routes for authentication
app.use('/auth', authRoutes);

// Routes for CRUD operations on events
app.use('/events', eventRoutes);

// Routes for user-related operations
app.use('/user', userRoutes);

//public routes
app.use('/publicEvents', publicEventRoutes);
app.use('/horoscope', horoscopeRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
