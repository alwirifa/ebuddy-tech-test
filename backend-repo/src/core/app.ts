import express from 'express';
import router from '../routes/userRoutes';
import cors from 'cors';

const app = express();

app.use(express.json());

// Setup CORS
const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use('/', router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
