// api/app.js
import express from 'express';
import securityRoutes from './routes/securityRoute.js';

const app = express();
app.use(express.json());

app.use('/api/security', securityRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 