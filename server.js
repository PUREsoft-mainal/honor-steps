import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import apiRoutes from './server.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// رابط قاعدة البيانات السحابية الحية المعتمد لمنصتك
const MONGO_URI = 'mongodb+srv://db_username:21FA0PLS0nnbU8AM@honor-steps.tposnpo.mongodb.net/the_honor_db?retryWrites=true&w=majority';

// الاتصال الفوري بالسحاب بدلاً من الحفظ المحلي المؤقت
mongoose.connect(MONGO_URI)
  .then(() => console.log('✔ [MongoDB] تم الاتصال بنجاح بقاعدة البيانات السحابية الحية لـ The Honor!'))
  .catch(err => console.error('❌ [MongoDB] فشل الاتصال بالسحاب، راجع الإعدادات والـ IP:', err));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log('[The Honor] خادم المنصة يعمل ومستعد للانتقال للعالمية!');
  console.log('👉 الرابط المحلي للمعاينة: http://localhost:' + PORT);
});

