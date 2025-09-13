require('dotenv').config();
const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const app = express();
app.use(express.json());

const requireAuth = ClerkExpressRequireAuth();

app.get('/api/users/profile', requireAuth, async (req, res) => {
    const clerkUserId = req.auth.userId;
    res.json({ message: 'Authenticated!', userId: clerkUserId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
