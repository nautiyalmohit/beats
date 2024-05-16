const express = require('express'); 
const songRoutes = require('./routes/songRoutes');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:'*'}));

app.use('/song', songRoutes);
// app.post('/')
app.listen(port, () => {
    console.log('Server listening on port', port);
})