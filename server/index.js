const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const redis = require('redis');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const AuthRouter = require('./routes/AuthRoutes');
const CartRouter = require('./routes/CartRoutes');
const UserRouter = require('./routes/UserRoutes');
const InvoiceRouter = require('./routes/InvoiceRoutes');
const StatisticsRouter = require('./routes/Statistics_Router');
const CategoriesRouter = require('./routes/CategoriesRoutes');
const ShippingRouter = require('./routes/ShippingRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const VoucherRouter = require('./routes/VoucherRoutes');
const SripeRouter = require('./routes/StripeRoutes');
const OrderRouter = require('./routes/OrderRoutes');
const AdminShippingRouter = require('./routes/AdminShippingRouter');
const AdminRouter = require('./routes/AdminRouter');
const OAuthRouter = require('./routes/OAuthRoutes');

const LogoRouter = require('./routes/LogoRouter');
const BannerRouter = require('./routes/BannerRouter');
const BannerHomeRouter = require('./routes/BannerHomeRouter');
const LogoHomeRouter = require('./routes/LogoHomeRouter');
const LogoHome1Router = require('./routes/LogoHome1Router');
const LogoDetailRouter = require('./routes/LogoDetailRouter');

const { createServer } = require('http');
const { Server } = require('socket.io');
const redisClient = redis.createClient({
    url: process.env.REDIS_URI,
});
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('common'));

const whitelist = [
    'http://localhost:5173',
    'https://www.getpostman.com',
    'https://app.getpostman.com',
    'http://localhost:5000',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(path.join(__dirname, ''), express.static(path.join(__dirname, '')));
app.use(express.static(path.join(__dirname, '')));
// Routes
app.use('/buyzzle/auth', AuthRouter);
app.use('/buyzzle/user', UserRouter);
app.use('/buyzzle/product', ProductRoutes);
app.use('/buyzzle/cart', CartRouter);
app.use('/buyzzle/categories', CategoriesRouter);
// app.use('/buyzzle/chat', ChatRouter);
app.use('/buyzzle/shipping', ShippingRouter);
app.use('/buyzzle/voucher', VoucherRouter);
app.use('/buyzzle/statistics', StatisticsRouter);

app.use('/buyzzle/invoice', InvoiceRouter);
app.use('/buyzzle/stripe', SripeRouter);
app.use('/buyzzle/order', OrderRouter);
app.use('/buyzzle/oauth', OAuthRouter);
app.use('/admin', AdminRouter);

app.use('/shipping/management', AdminShippingRouter);

app.use('/buyzzle/logo', LogoRouter);
app.use('/buyzzle/banner', BannerRouter);
app.use('/buyzzle/bannerhome', BannerHomeRouter);
app.use('/buyzzle/logohome', LogoHomeRouter);
app.use('/buyzzle/logohome1', LogoHome1Router);
app.use('/buyzzle/logodetail', LogoDetailRouter);

// Setup socket.io
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5000', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
    },
    allowEIO3: true,
});

app.set('socketio', io);

// await client.connect();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.on('ready', () => {
    console.log('Redis client connected and ready to process commands');
});

io.on('connection', (socket) => {
    const socketId = socket.id;
    console.log(`user ${socketId} connected`);
    socket.on('disconnect', () => {
        console.log(`user ${socketId} disconnected`);
    });
});

httpServer.listen(process.env.APP_PORT || 5000, () => {
    console.log('Server up and running on port ' + process.env.APP_PORT);
});
