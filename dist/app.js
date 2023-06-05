"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users = [
    {
        name: "Oleh",
        age: 20,
        gender: "male",
    },
    {
        name: "Anton",
        age: 10,
        gender: "male",
    },
    {
        name: "Inokentiy",
        age: 25,
        gender: "female",
    },
    {
        name: "Anastasiya",
        age: 15,
        gender: "female",
    },
    {
        name: "Cocos",
        age: 25,
        gender: "other",
    },
];
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/users", (req, res) => {
    res.status(200).json(users);
});
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    res.status(200).json(users[+id]);
});
app.post("/users", (req, res) => {
    users.push(req.body);
    res.status(201).json({
        message: "User created.",
    });
});
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    users[+id] = req.body;
    res.status(200).json({
        message: "User updated",
        data: users[+id],
    });
});
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    users.splice(+id, 1);
    res.status(200).json({
        message: "User deleted",
    });
});
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT} 🥸`);
});
