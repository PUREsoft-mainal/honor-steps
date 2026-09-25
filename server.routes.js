import express from 'express';
const router = express.Router();

router.get('/platform-data', (req, res) => {
  res.json({
    stats: { registeredUsers: 1420, activeUsers: 58 },
    announcement: "📢 إعلان رسمي من الأدمن العام: أهلاً بكم في الإطلاق المحلي التجريبي لمنصة the honor!"
  });
});

export default router;

