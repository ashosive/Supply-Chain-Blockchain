const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Farmer = require('./models/Farmer');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/mern_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));


app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", (request, response) => {
    User.findOne({ email: request.body.email })
        .then((user) => {

            bcrypt
                .compare(request.body.password, user.password)
                .then((passwordCheck) => {

                    if(!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords does not match",
                            error,
                        });
                    }
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email,
                        },
                        "RANDOM-TOKEN",
                        { expiresIn: "24h" }
                    );
                    response.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                    });
                })
                .catch((error) => {
                    response.status(400).send({
                        message: "Passwords does not match",
                        error,
                    });
                });
        })

        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e,
            });
        });
});




// Start the server
app.listen(PORT, () => {
    console.log('connected')
});
