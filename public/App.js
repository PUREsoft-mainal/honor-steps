fetch('/api/platform-data')
  .then(res => res.json())
  .then(data => {
    document.getElementById('reg-users').innerText = "المسجلين: " + data.stats.registeredUsers;
    document.getElementById('act-users').innerText = "النشطين: " + data.stats.activeUsers;
    document.getElementById('announcement').innerText = data.announcement;
  }).catch(() => {});

const networkUsers = [
  {id: "HR-101", name: "أحمد علي"}, {id: "HR-202", name: "محمود حسن"},
  {id: "HR-303", name: "سارة محمد"}, {id: "THE-BOSS", name: "الأدمن العام"}
];

let activeRoomId = "global_room";
let pinnedRooms = JSON.parse(localStorage.getItem('honor_pinned_rooms')) || [];
const posts = [{author: "مصطفى البحيرى", body: "تم تأسيس البنية التحتية لمنصة the honor بنجاح على نظام لينكس منت!"}];

// متغيرات مؤقتة لحفظ بيانات الوسائط المرفوعة قبل الضغط على زر النشر
let currentPostMediaData = null;
let currentPostMediaType = null;

function previewPostMedia(type) {
  const inputId = type === 'image' ? 'post-media-image' : 'post-media-video';
  const file = document.getElementById(inputId).files[0];
  const statusEl = document.getElementById('post-media-preview-status');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentPostMediaData = e.target.result;
      currentPostMediaType = type;
      statusEl.innerText = "📎 تم إرفاق الـ " + (type === 'image' ? 'صورة' : 'فيديو') + ": " + file.name;
      statusEl.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

function renderPosts() {
  const feed = document.getElementById('news-feed'); if(!feed) return;
  let res = "";
  for(let i = 0; i < posts.length; i++) {
    let p = posts[i];
    let mediaHtml = "";
    
    // التحقق الفوري وعرض الوسائط بناءً على نوع المرفق (صورة أو فيديو نيون متناسق)
    if (p.mediaData) {
      if (p.mediaType === 'image') {
        mediaHtml = '<img src="' + p.mediaData + '" style="width:100%; max-height:350px; object-fit:cover; border-radius:6px; margin-top:10px; border: 1px solid rgba(25, 181, 254, 0.3); box-shadow: var(--neon-blue);">';
      } else if (p.mediaType === 'video') {
        mediaHtml = '<video src="' + p.mediaData + '" controls style="width:100%; max-height:350px; border-radius:6px; margin-top:10px; border: 1px solid rgba(191, 85, 236, 0.3); box-shadow: var(--neon-purple);"></video>';
      }
    }
    
    res += '<div class="post-box">' +
      '<strong style="color:#ffd700;">' + p.author + '</strong>' +
      '<p style="margin:10px 0; line-height:1.5;">' + p.body + '</p>' +
      mediaHtml +
      '<hr style="border:none; border-top:1px solid rgba(255,255,255,0.05); margin:10px 0;">' +
      '<button style="background:transparent; border:none; color:#19b5fe; font-weight:bold; cursor:pointer;">👍 تفاعل (0)</button>' +
    '</div>';
  }
  feed.innerHTML = res;
}

function addPost() {
  const t = document.getElementById('post-text').value;
  // السماح بالنشر في حال وجود نص أو مادة مرئية مرفقة
  if(!t.trim() && !currentPostMediaData) return;
  
  posts.unshift({
    author: "مصطفى البحيرى",
    body: t,
    mediaData: currentPostMediaData,
    mediaType: currentPostMediaType
  });
  
  // تصفير الخانات ومتغيرات الرفع فوراً بعد إتمام النشر بنجاح
  document.getElementById('post-text').value = '';
  document.getElementById('post-media-image').value = '';
  document.getElementById('post-media-video').value = '';
  document.getElementById('post-media-preview-status').style.display = "none";
  currentPostMediaData = null;
  currentPostMediaType = null;
  
  renderPosts();
}

function triggerAvatarUpload() { 
  document.getElementById('avatar-file-input').click(); 
}

function processAvatar(inp) {
  if (inp.files && inp.files[0]) {
    const r = new FileReader();
    r.onload = function(e) { 
      localStorage.setItem('honor_user_avatar', e.target.result); 
      applyLoadedAvatar(e.target.result); 
    };
    r.readAsDataURL(inp.files[0]);
  }
}

function applyLoadedAvatar(d) {
  if (d) {
    const topAv = document.getElementById('top-avatar'); 
    if (topAv) topAv.style.backgroundImage = "url('" + d + "')";
    const v = document.getElementById('profile-avatar-view'); 
    if (v) v.style.backgroundImage = "url('" + d + "')";
  }
}

let savedAccounts = JSON.parse(localStorage.getItem('honor_crypto_notes')) || [];
function renderAccounts() {
  const c = document.getElementById('saved-accounts-box'); if(!c) return;
  if(savedAccounts.length === 0) { c.innerHTML = '<span style="color:#777;font-size:12px;">المفكرة فارغة.</span>'; return; }
  let res = "";
  for(let i = 0; i < savedAccounts.length; i++) {
    res += '<div class="account-item"><div><strong style="color:#fef160;">' + savedAccounts[i].title + '</strong><span style="color:#aaa;margin-right:15px;font-family:monospace;">🔑 ' + savedAccounts[i].pass + '</span></div><button class="btn-danger-sm" onclick="deleteAccount(' + i + ')">حذف</button></div>';
  }
  c.innerHTML = res;
}

function saveAccountAccount() {
  const t = document.getElementById('acc-title').value; const p = document.getElementById('acc-pass').value; if(!t.trim() || !p.trim()) return;
  savedAccounts.push({title: t, pass: p}); localStorage.setItem('honor_crypto_notes', JSON.stringify(savedAccounts));
  document.getElementById('acc-title').value = ''; document.getElementById('acc-pass').value = ''; renderAccounts();
}
function deleteAccount(i) { savedAccounts.splice(i,1); localStorage.setItem('honor_crypto_notes', JSON.stringify(savedAccounts)); renderAccounts(); }
function executeUserSearch() {
  const q = document.getElementById('user-search-field').value.toLowerCase(); const c = document.getElementById('search-results-users-list'); if(!c) return; let res = "";
  for(let i = 0; i < networkUsers.length; i++) {
    let u = networkUsers[i];
    if(u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)) {
      let p = pinnedRooms.includes(u.id) ? 'pinned' : '';
      res += '<div class="fav-user-item" onclick="switchChatRoom(\'' + u.id + '\', \'' + u.name + '\')"><span>👤 ' + u.name + ' (' + u.id + ')</span><button class="pin-toggle-btn ' + p + '" onclick="event.stopPropagation(); togglePinUserDirectly(\'' + u.id + '\', \'' + u.name + '\')">📌</button></div>';
    }
  }
  c.innerHTML = res;
}

function switchChatRoom(id, t) { activeRoomId = id; document.getElementById('active-chat-title').innerText = t || "المحادثة العامة"; const b = document.getElementById('pin-current-chat-btn'); if(pinnedRooms.includes(id)) b.classList.add('pinned'); else b.classList.remove('pinned'); renderChatMessages(); }
function renderFavoritesList() {
  const c = document.getElementById('favorites-users-list'); if(!c) return; let html = '<div class="fav-user-item" onclick="switchChatRoom(\'global_room\', \'المحادثة العامة\')">📢 المحادثة العامة</div>';
  for(let i = 0; i < pinnedRooms.length; i++) {
    let id = pinnedRooms[i]; let u = networkUsers.find(function(x) { return x.id === id; }); let name = u ? u.name : "مجموعة";
    html += '<div class="fav-user-item" onclick="switchChatRoom(\'' + id + '\', \'' + name + '\')"><span>📌 ' + name + '</span><button class="pin-toggle-btn pinned" onclick="event.stopPropagation(); togglePinUserDirectly(\'' + id + '\')">❌</button></div>';
  }
  c.innerHTML = html;
}

function togglePinUserDirectly(id, n) { const idx = pinnedRooms.indexOf(id); if(idx > -1) pinnedRooms.splice(idx, 1); else pinnedRooms.push(id); localStorage.setItem('honor_pinned_rooms', JSON.stringify(pinnedRooms)); renderFavoritesList(); if(id === activeRoomId) switchChatRoom(activeRoomId, n); }
function togglePinCurrentRoom() { if(activeRoomId === "global_room") return; togglePinUserDirectly(activeRoomId, document.getElementById('active-chat-title').innerText); }
let chatDatabase = JSON.parse(localStorage.getItem('honor_chat_db')) || {};
function renderChatMessages() {
  const b = document.getElementById('chat-messages-box'); if(!b) return; const m = chatDatabase[activeRoomId] || []; const av = localStorage.getItem('honor_user_avatar') || '';
  if(m.length === 0) { b.innerHTML = '<span style="color:#555;font-size:12px;">لا توجد رسائل.</span>'; return; }
  let res = "";
  for(let i = 0; i < m.length; i++) {
    let isMe = m[i].senderId === "HR-1991"; let cls = isMe ? 'msg-bubble-card my-msg' : 'msg-bubble-card'; let src = isMe ? av : '';
    res += '<div class="' + cls + '"><div class="msg-sender-meta"><div class="msg-sender-avatar" style="background-image:url(\'' + src + '\')"></div><strong>' + m[i].senderName + '</strong></div><div class="msg-body-content">' + m[i].text + '</div><button class="msg-delete-action-btn" onclick="deleteMessageFromAll(\'' + activeRoomId + '\',' + i + ')">🗑️ حذف</button></div>';
  }
  b.innerHTML = res; b.scrollTop = b.scrollHeight;
}

function sendNewChatMessage() {
  const s = document.getElementById('chat-message-input'); let text = s.value.trim(); if(!text) return;
  if(text.includes('http') || text.includes('earth.google')) { text = '<a class="attachment-link-preview" href="' + text + '" target="_blank">🌐 رابط وموقع تفاعلي اضغط للفتح</a>'; }
  if(!chatDatabase[activeRoomId]) chatDatabase[activeRoomId] = []; chatDatabase[activeRoomId].push({senderId: "HR-1991", senderName: "مصطفى البحيرى", text: text});
  localStorage.setItem('honor_chat_db', JSON.stringify(chatDatabase)); s.value = ''; renderChatMessages();
}

function handleChatFileAttach(inp) {
  if(inp.files && inp.files[0]) {
    const f = inp.files[0]; const r = new FileReader();
    r.onload = function(e) {
      const link = '<a class="attachment-link-preview" href="' + e.target.result + '" download="' + f.name + '">📂 مستند: ' + f.name + '</a>';
      if(!chatDatabase[activeRoomId]) chatDatabase[activeRoomId] = []; chatDatabase[activeRoomId].push({senderId: "HR-1991", senderName: "مصطفى البحيرى", text: link});
      localStorage.setItem('honor_chat_db', JSON.stringify(chatDatabase)); renderChatMessages();
    }; r.readAsDataURL(f);
  }
}
function deleteMessageFromAll(r, i) { if(chatDatabase[r]) { chatDatabase[r].splice(i,1); localStorage.setItem('honor_chat_db', JSON.stringify(chatDatabase)); renderChatMessages(); } }
let platformBalance = parseFloat(localStorage.getItem('honor_platform_balance')) || 0; let savedLoans = JSON.parse(localStorage.getItem('honor_loans_db')) || [];
function updateBalanceDisplay() { const el = document.getElementById('platform-global-balance'); if(el) el.innerText = platformBalance.toLocaleString('ar-EG'); }
function switchBankingTab(t) {
  document.getElementById('bank-tab-loans').style.display = t === 'loans' ? 'block' : 'none'; document.getElementById('bank-tab-installments').style.display = t === 'installments' ? 'block' : 'none'; document.getElementById('bank-tab-invoices').style.display = t === 'invoices' ? 'block' : 'none';
  if(t === 'installments') renderInstallmentsReport(); if(t === 'invoices') previewInvoiceTemplate();
}

function calculateLoanData() {
  const a = parseFloat(document.getElementById('loan-amount').value) || 0;
  const i = parseFloat(document.getElementById('loan-interest').value) || 0;
  const m = parseInt(document.getElementById('loan-months').value) || 1;
  const p = parseFloat(document.getElementById('user-percentage').value) || 0;
  const firstDateVal = document.getElementById('loan-first-date').value;

  // حساب الفائدة السنوية النسبية بناءً على عدد الشهور الفعلي بدقة
  const annualInterestRate = i / 100;
  const timeInYears = m / 12;
  const interest = a * annualInterestRate * timeInYears;
  
  const cost = a + interest;
  const inst = cost / m;
  const share = interest * (p / 100);

  // منطق الحساب التلقائي لتاريخ سداد آخر قسط بدقة تامة
  let finalDateStr = "---";
  if (firstDateVal) {
    let firstDate = new Date(firstDateVal);
    firstDate.setMonth(firstDate.getMonth() + m);
    finalDateStr = firstDate.toLocaleDateString('ar-EG');
  }

  document.getElementById('loan-total-output').innerText = Math.round(cost).toLocaleString('ar-EG');
  document.getElementById('loan-month-output').innerText = Math.round(inst).toLocaleString('ar-EG');
  document.getElementById('user-share-output').innerText = Math.round(share).toLocaleString('ar-EG');
  document.getElementById('loan-final-date-output').innerText = finalDateStr;
  
  // إرجاع البيانات بشكل صريح وآمن للدوال الأخرى
  return {amt: a, totalCost: cost, installment: inst, userShare: share, months: m, finalDate: finalDateStr};
}

function executeAndSaveLoan() {
  const client = document.getElementById('loan-client-name').value.trim();
  if(!client) { alert('برجاء إدخال اسم العميل أولاً لحفظ العقد البنكي الصحيح'); return; }
  
  const data = calculateLoanData();
  if(data.amt <= 0) { alert('برجاء إدخال بيانات قرض صالحة ومبالغ أكبر من الصفر'); return; }

  // إضافة نسبة عمولة المستخدم الحالية لـ رصيد المنصة الإجمالي وحفظها فورا
  platformBalance += data.userShare;
  localStorage.setItem('honor_platform_balance', platformBalance);
  updateBalanceDisplay();

  // قيد العقد في قاعدة البيانات المحلية متضمناً التواريخ البنكية المجدولة والعمولات
  savedLoans.push({
    client: client,
    amount: data.amt,
    totalCost: data.totalCost,
    installment: data.installment,
    months: data.months,
    userShare: data.userShare,
    firstDate: document.getElementById('loan-first-date').value ? new Date(document.getElementById('loan-first-date').value).toLocaleDateString('ar-EG') : 'غير محدد',
    finalDate: data.finalDate,
    date: new Date().toLocaleDateString('ar-EG')
  });
  localStorage.setItem('honor_loans_db', JSON.stringify(savedLoans));

  alert('✅ تم تنفيذ العقد بنجاح وإضافة الأرباح للرصيد بنجاح عارم لمؤسستكم!');
  
  // تصفير الخانات فوراً بعد إتمام الحفظ
  document.getElementById('loan-client-name').value = '';
  document.getElementById('loan-amount').value = '';
  document.getElementById('loan-interest').value = '';
  document.getElementById('loan-months').value = '';
  document.getElementById('user-percentage').value = '';
  document.getElementById('loan-first-date').value = '';
  calculateLoanData();
}


function renderInstallmentsReport() {
  const b = document.getElementById('installments-report-capture'); if(!b) return;
  if(savedLoans.length === 0) { b.innerHTML = '<span style="color:#777;">لا توجد عقود مسجلة.</span>'; return; }
  
  let res = ""; 
  for(let i = 0; i < savedLoans.length; i++) { 
    let l = savedLoans[i]; 
    res += '<div style="border-bottom:1px dashed rgba(255,255,255,0.1);padding:8px 0;line-height:1.6; display:flex; justify-content:space-between; align-items:center;">' +
      '<div style="flex:1;">' +
        '<strong style="color:#bf55ec; font-size:13px;">👤 العميل: ' + l.client + '</strong>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;color:#ccc;margin-top:3px;">' +
          '<div>المبلغ الأصلي: ' + Math.round(l.amount).toLocaleString('ar-EG') + ' ج.م</div>' +
          '<div>الإجمالي: ' + Math.round(l.totalCost).toLocaleString('ar-EG') + ' ج.م</div>' +
          '<div>القسط: ' + Math.round(l.installment).toLocaleString('ar-EG') + ' ج.م</div>' +
          '<div>المدة: ' + l.months + ' شهور</div>' +
        '</div>' +
        '<div style="font-size:10px; color:#555; margin-top:2px;">📅 فترة السداد: من (' + (l.firstDate || '---') + ') إلى (' + (l.finalDate || '---') + ') | تاريخ القيد: ' + l.date + '</div>' +
      '</div>' +
      '<div>' +
        '<button class="btn-danger-sm" style="background:#f22613; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:3px; font-weight:bold;" onclick="deleteBankingTransaction(' + i + ')">❌ حذف المعاملة</button>' +
      '</div>' +
    '</div>'; 
  }
  b.innerHTML = res;
}


function deleteBankingTransaction(index) {
  if(confirm('هل أنت متأكد من حذف هذه المعاملة البنكية نهائياً وإلغاء عمولتها من الرصيد؟')) {
    const targetLoan = savedLoans[index];
    
    // حساب قيمة العمولة التي دخلت الرصيد مسبقاً وتخصيمها تلقائياً لإعادة المقاصة الصحيحة
    const totalInterest = targetLoan.totalCost - targetLoan.amount;
    // استرجاع نسبة العقد، وفي حال عدم وجودها يتم حساب الفارق الكلي بناءً على العقد
    const userShare = targetLoan.userShare || 0; 
    
    platformBalance -= userShare;
    if(platformBalance < 0) platformBalance = 0; // حماية الرصيد من النزول تحت الصفر
    
    localStorage.setItem('honor_platform_balance', platformBalance);
    updateBalanceDisplay();
    
    // إزالة المعاملة من قاعدة البيانات المحلية
    savedLoans.splice(index, 1);
    localStorage.setItem('honor_loans_db', JSON.stringify(savedLoans));
    
    // إعادة تحديث العرض فوراً
    renderInstallmentsReport();
    alert('🗑️ تم حذف المعاملة وتحديث الرصيد المالي للمنصة بنجاح!');
  }
}



function previewInvoiceTemplate() {
  // نقوم باستدعاء التحديث التفاعلي الحر مباشرة عند فتح التبويب
  liveUpdateInvoice();
}

function liveUpdateInvoice() {
  const clientName = document.getElementById('inv-input-client').value.trim() || '---';
  const subjectText = document.getElementById('inv-input-subject').value.trim() || 'تمويل قروض تجارية بنكية نشطة';
  const baseAmount = parseFloat(document.getElementById('inv-input-base').value) || 0;
  const interestRate = parseFloat(document.getElementById('inv-input-interest').value) || 0;

  const compCheck = document.getElementById('toggle-company-logo').checked;
  const bankCheck = document.getElementById('toggle-bank-logo').checked;
  const customCompUrl = document.getElementById('inv-custom-comp-logo').value.trim();
  const customBankUrl = document.getElementById('inv-custom-bank-logo').value.trim();
  const myAvatar = localStorage.getItem('honor_user_avatar') || '';

  const compBox = document.getElementById('inv-logo-comp-placeholder');
  const bankBox = document.getElementById('inv-logo-bank-placeholder');

  // التحكم المرن بشعار الشركة (لوجو الشركة المخصص أو الصورة الشخصية)
  if (compCheck) {
    if (customCompUrl) {
      compBox.innerHTML = '<img src="' + customCompUrl + '" style="width:100%; height:100%; object-fit:contain;">';
    } else if (myAvatar) {
      compBox.innerHTML = '<img src="' + myAvatar + '" style="width:100%; height:100%; object-fit:cover;">';
    } else {
      compBox.innerHTML = '<span style="font-size:9px; color:#ffd700;">لا توجد صورة</span>';
    }
  } else {
    compBox.innerHTML = '<span style="font-size:9px; color:#555;">شركة</span>';
  }

  // التحكم المرن بشعار البنك (لوجو البنك المخصص أو شعار المنصة الافتراضي)
  if (bankCheck) {
    if (customBankUrl) {
      bankBox.innerHTML = '<img src="' + customBankUrl + '" style="width:100%; height:100%; object-fit:contain;">';
    } else {
      bankBox.innerHTML = '<img src="/logo.png" style="width:100%; height:100%; object-fit:contain;" onerror="this.parentElement.innerHTML=\'بنك\'">';
    }
  } else {
    bankBox.innerHTML = '<span style="font-size:9px; color:#555;">البنك</span>';
  }

  // الحسابات الرياضية الفورية للفاتورة المفتوحة
  const calculatedInterest = baseAmount * (interestRate / 100);
  const totalInvoiceAmount = baseAmount + calculatedInterest;

  // حقن البيانات المدخلة في قالب الفاتورة بلحظتها
  document.getElementById('inv-preview-name').innerText = clientName;
  document.getElementById('inv-table-subject-view').innerText = subjectText;
  document.getElementById('inv-table-base').innerText = Math.round(baseAmount).toLocaleString('ar-EG') + ' ج.م';
  document.getElementById('inv-table-total').innerText = Math.round(totalInvoiceAmount).toLocaleString('ar-EG') + ' ج.م';

  // المحافظة على التواريخ والأرقام العشوائية مستقرة
  if (document.getElementById('invoice-current-date-span').innerText === '---') {
    document.getElementById('invoice-current-date-span').innerText = new Date().toLocaleDateString('ar-EG');
  }
  if (document.getElementById('invoice-random-number-span').innerText === '---') {
    document.getElementById('invoice-random-number-span').innerText = 'INV-' + Math.floor(Math.random() * 90000 + 10000);
  }
}


function exportInstallments(t) {
  const r = document.getElementById('installments-report-capture');
  if(t === 'print' || t === 'pdf') { const w = window.open('', '', 'height=500,width=800'); w.document.write('<html><body style="direction:rtl;"><h2>كشف الأقساط</h2>' + r.innerHTML + '</body></html>'); w.document.close(); w.print(); }
  else if(t === 'txt') { const blob = new Blob([r.innerText], {type: 'text/plain;charset=utf-8'}); const lnk = document.createElement('a'); lnk.href = URL.createObjectURL(blob); lnk.download = 'كشف_' + new Date().toLocaleDateString('ar-EG') + '.txt'; lnk.click(); }
}

function openModal(t) {
  const m = document.getElementById('modal'); const o = document.getElementById('overlay'); const p = document.getElementById('modal-profile-content'); const c = document.getElementById('modal-chat-content'); const b = document.getElementById('modal-banking-content'); const w = document.getElementById('banking-balance-wrapper');
  p.style.display = 'none'; c.style.display = 'none'; b.style.display = 'none'; w.style.display = 'none';
  if(t === 'profile') { p.style.display = 'block'; renderAccounts(); }
  else if(t === 'chat') { c.style.display = 'block'; executeUserSearch(); renderFavoritesList(); renderChatMessages(); }
  else if(t === 'banking') { b.style.display = 'block'; w.style.display = 'block'; updateBalanceDisplay(); switchBankingTab('loans'); }
  m.style.display = 'block'; o.style.display = 'block';
}
function closeModal() { document.getElementById('modal').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; }

window.onload = function() { renderPosts(); applyLoadedAvatar(localStorage.getItem('honor_user_avatar')); };
