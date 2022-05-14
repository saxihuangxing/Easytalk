import React from 'react';

function Contact() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.title}>Send email to us: 1229958344@qq.com </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: '100px'
  },
  content: {
    width: '400px',
    color: '##0f0202',
  },
  title: {
    marginBottom: '20px',
    fontWeight: '700',
    fontSize: '40px',
    lineHeight: '1.5',
  },
  description: {
    margin: '0',
    fontSize: '14px',
    color: '#fff',
    letterSpacing: '0.45px',
    lineHeight: '32px',
  },
};

export default Contact;