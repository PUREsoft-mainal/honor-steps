import React, { useState, useEffect } from 'react';
import PostFeed from './components/PostFeed.jsx';
import FloatingWindow from './components/FloatingWindow.jsx';
import './App.css';

function App() {
  const [stats, setStats] = useState({ registeredUsers: 0, activeUsers: 0 });
  const [announcement, setAnnouncement] = useState("جاري جلب إعلانات الأدمن...");
  const [activePopup, setActivePopup] = useState(null);

  // بيانات المستخدم الافتراضية للمنصة محلياً
  const identity = {
    name: "مصطفى البحيرى",
    uid: "ID: 1991-0611"
  };

  useEffect(() => {
    // الاتصال بروابط السيرفر المحلي لجلب الإحصائيات والإعلانات
    fetch('http://localhost:5000/api/platform-data')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setAnnouncement(data.announcement);
      })
      .catch(() => {
        setStats({ registeredUsers: "مفتوح", activeUsers: "مفتوح" });
        setAnnouncement("📢 إعلان: السيرفر الخلفي server.js لم يتم تشغيله بعد، تعمل الواجهة بوضع الطوارئ.");
      });
  }, []);

  return (
    <div className="honor-app-root">
      <header className="main-header">
        {/* الشريط الأول: الإحصائيات، اللوجو، وبيانات المستخدم */}
        <div className="user-info-bar">
          <div className="stats-container">
            <span>المسجلين: {stats.registeredUsers}</span>
            <span>النشطين: {stats.activeUsers}</span>
          </div>

          <div className="logo-container">
            <h1>THE HONOR</h1>
          </div>

          <div className="user-profile-side">
            <div className="user-text-details">
              <strong>{identity.name}</strong>
              <span className="uid-span">{identity.uid}</span>
            </div>
            <div className="avatar-frame"></div>
            <button className="logout-button">خروج</button>
          </div>
        </div>

        {/* الشريط الثاني: شريط إعلانات الأدمن العام */}
        <div className="admin-announcement-bar">
          {announcement}
        </div>

        {/* الشريط الثالث: شريط الأزرار لفتح الشاشات العائمة */}
        <div className="navigation-buttons-bar">
          <button className="nav-btn btn-gold" onClick={() => setActivePopup('profile_panel')}>الملف الشخصي</button>
          <button className="nav-btn btn-purple" onClick={() => setActivePopup('chat_panel')}>غرف المحادثة</button>
          <button className="nav-btn btn-blue" onClick={() => setActivePopup('settings_panel')}>التخصيص والنيون</button>
        </div>
      </header>

      {/* ساحة المنشورات (مثل الفيس بوك تماماً) */}
      <main className="feed-layout">
        <PostFeed />
      </main>

      {/* إدارة ظهور المكونات المستقلة العائمة */}
      {activePopup && (
        <FloatingWindow target={activePopup} onClose={() => setActivePopup(null)} />
      )}
    </div>
  );
}

export default App;

