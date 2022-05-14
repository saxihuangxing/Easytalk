import React from 'react';

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.title}>Join us and become an online English teacher today!
        Start your flexible life!
         </div>
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
    width: '500px',
    color: '#0f0202',
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

export default Home;
