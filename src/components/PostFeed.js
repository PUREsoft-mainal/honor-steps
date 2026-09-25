import React, { useState } from 'react';

function PostFeed() {
  const [posts, setPosts] = useState([
    { id: 1, author: "مصطفى البحيرى", body: "تم تأسيس البنية التحتية لمنصة the honor بنجاح على نظام لينكس منت!", likes: 7 }
  ]);
  const [textInput, setTextInput] = useState("");

  const publishNewPost = () => {
    if (!textInput.trim()) return;
    const postObj = {
      id: Date.now(),
      author: "مصطفى البحيرى",
      body: textInput,
      likes: 0
    };
    setPosts([postObj, ...posts]);
    setTextInput("");
  };

  return (
    <div className="post-feed-subsystem">
      {/* صندوق النشر كالفيس بوك */}
      <div className="post-box" style={{ borderColor: '#ffd700', boxShadow: '0 0 10px #ffd700' }}>
        <textarea
          placeholder="بماذا تفكر الآن لتنشره في ساحة الشرف؟"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          style={{ width: '100%', background: 'transparent', color: '#fff', border: '1px solid #bf55ec', borderRadius: '5px', padding: '10px', boxSizing: 'border-box', minHeight: '70px', resize: 'none' }}
        />
        <button onClick={publishNewPost} style={{ marginTop: '10px', background: '#ffd700', border: 'none', color: '#060b19', padding: '8px 20px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>نشر</button>
      </div>

      {/* استعراض خلاصة المنشورات */}
      {posts.map(post => (
        <div key={post.id} className="post-box">
          <strong style={{ color: '#ffd700' }}>{post.author}</strong>
          <p style={{ margin: '10px 0', lineHeight: '1.5' }}>{post.body}</p>
          <button style={{ background: 'transparent', border: 'none', color: '#19b5fe', cursor: 'pointer', fontWeight: 'bold' }}>👍 تفاعل ({post.likes})</button>
        </div>
      ))}
    </div>
  );
}

export default PostFeed;

