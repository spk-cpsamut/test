import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'please authorize by token'})
    }
    //1. เราจะ ดึง jwt token ที่ติดมาใน header 
     let token = req.headers.authorization;
     if (!token.startsWith('Bearer')) {
        return res.status(401).json({ message: 'unsupport authorize method'})
     }

     // ตัดคำว่า Bearer ออกจาก req.headers.authorization
     token = token.replace('Bearer', '').trim();
    //2. เราจะทำการ verify (ตรวจสอบยืนยัน) ว่า token ที่ส่งเข้ามาเป็น token ที่สร้างจากระบบของเรา
    try {
    const payload = jwt.verify(token, 'safdsafkjkULDFSD<!@*&_!@#M<ND');
    //3. set ข้อมูลจาก payload ของ token เข้ามาใน request เพื่อให้ controler function ได้ใช้งาน
    req.user = {};
    req.user.id = payload.id; 
    // เช่น id ของ user
    next()
    } catch (error) {
        return res.status(401).json({ message: ' token is invalid'})
    }
}