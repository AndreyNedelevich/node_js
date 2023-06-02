const express = require('express');
const fileService = require('./file.service');

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}))

// CRUD - create, read, update, delete

app.get('/users', async (req, res) => {
    const users = await fileService.readDB();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const {name, age} = req.body;

    if (!name || name.length < 5) {
        return res.status(400).json('name is wrong');
    }
    if (!age || age < 10 || age > 110) {
        return res.status(400).json('age is wrong');
    }

    const users = await fileService.readDB();
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        age,
    }
    users.push(newUser);

    await fileService.writeDB(users);

    res.status(201).json(newUser);
});

app.get('/users/:id', async (req, res) => {
    const {id} = req.params;

    const users = await fileService.readDB();

    const user = users.find((user) => user.id === +id);
    if (!user) {
        return res.status(422).json('user not found');
    }

    res.json(user);
});

app.patch('/users/:id', async (req, res) => {
    const {id} = req.params;
    const {name, age} = req.body;

    if (name && name.length < 5) {
        return res.status(400).json('name is wrong');
    }
    if (age && (age < 10 || age > 110)) {
        return res.status(400).json('age is wrong');
    }

    const users = await fileService.readDB();
    const user = users.find((user) => user.id === +id);

    if (!user) {
        return res.status(422).json('user not found');
    }
    if (name) user.name = name;
    if (age) user.age = age;

    await fileService.writeDB(users);

    res.status(201).json(user);
});

app.delete('/users/:id', async (req, res) => {
    const {id} = req.params;

    const users = await fileService.readDB();
    const index = users.findIndex((user) => user.id === +id);

    if (index === -1) {
        return res.status(422).json('user not found');
    }
    users.splice(index, 1);
    await fileService.writeDB(users);

    res.sendStatus(204);
});

const PORT = 5100;

app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`)
});
