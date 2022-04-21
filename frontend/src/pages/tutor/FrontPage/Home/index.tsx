import React from 'react';

function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.title}>Become an Online English teacher Today! </div>
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
  },
  content: {
    width: '400px',
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
