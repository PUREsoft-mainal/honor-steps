import React from 'react';

function FloatingWindow({ target, onClose }) {
  const getWindowMeta = () => {
    switch (target) {
      case 'profile_panel':
        return { title: "بوابة الملف الشخصي الملكي", desc: "هنا يمكنك استعراض هويتك الرقمية الـ ID ورفع صورتك الشخصية بملف مخصص." };
      case 'chat_panel':
        return { title: "غرف المحادثة الفورية والرسائل", desc: "نافذة عائمة مخصصة للمراسلات المشفرة محلياً بين أطراف الشبكة الحالية." };
      case 'settings_panel':
        return { title: "لوحة تحكم وتخصيص النيون", desc: "خيارات متقدمة لتغيير الخلفية الكحلية، والتحكم بوهج النيون أو استبدال القوالب." };
      default:
        return { title: "ميزة عائمة", desc: "" };
    }
  };

  const info = getWindowMeta();

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="floating-window">
        <h3 style={{ color: '#ffd700', marginTop: 0 }}>{info.title}</h3>
        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>{info.desc}</p>
        <button
          onClick={onClose}
          style={{ background: '#f22613', color: '#fff', border: 'none', padding: '7px 15px', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}
        >
          إغلاق النافذة
        </button>
      </div>
    </>
  );
}

export default FloatingWindow;

