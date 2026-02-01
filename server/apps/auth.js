import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้

authRouter.post('/register', async (req, res) => {
    // 1. เราปั้น object จาก request body ที่ client ส่งเข้ามา
    const user = {
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.firstname
    }
    // 2. validation เช็คว่า username ที่เขาส่งมาเคยมีมาแล้วหรือยังในระบบของเรา
   const existingUser = await db.collection('auth').find({ username: user.username}).toArray();

    if (existingUser.length > 0) {
        return res.status(400).json({message: 'มีนะจ๊ะ ไปคิดมาใหม่'})
    }

    // 3. เราทำการเข้ารหัส password
    const salt = await bcrypt.genSalt()
    user.password = await bcrypt.hash(user.password, salt)


    // 4. เรา บันทึก user เข้าระบบ

    await db.collection('auth').insertOne(user);
  // 5. เราส่ง response คืนให้ client

  return res.status(201).json({message: 'register successfully'})
});

authRouter.post('/login', async (req, res) => {
    //1. เข้าถึงข้อมูล credential ที่ client ส่งเข้ามา แล้วเก็บค่านั้นไว้ใน ตัวแปล
    const { username, password } = req.body;

    //2. validation
    //2.1 เช็คว่า มี user อยู่ในระบบหรือเปล่า
    const user = await db.collection('auth').findOne({ username });
    if (!user) {
        return res.status(404).json({message: 'username not found'})
    };
    //2.2 เช็คว่า password ที่ส่งมาถูกต้อง $2b$10$loytP80hbwH
    // bcrypt.hash(password, $2b$10$loytP80hbwH)
    const isValidPassword = await bcrypt.compare(password, user.password);


    if (!isValidPassword) {
        return res.status(400).json({ message: 'password is invalid'})
    }
    
    //3. สร้าง token

    const jwtToken = jwt.sign(
        { id: user._id },
        'safdsafkjkULDFSD<!@*&_!@#M<ND',
        {
            expiresIn: '10m'
        }
    )

    //4. ส่ง token ไปให้ client

    return res.status(201).send({ token: jwtToken});
})





// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้

export default authRouter;
