import cors from 'cors';

const whitelist = ['https://theswampofstudying.netlify.app'];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default cors(corsOptions);
