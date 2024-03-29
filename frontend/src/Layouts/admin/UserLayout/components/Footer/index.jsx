export default function Footer(){
  return (
    <div style={styles.footer}>
      <div style={styles.links}>
      </div>
      <div style={styles.copyright}>FunTalk*Roselyn © 2022 copyright</div>
    </div>
  );
};

const styles = {
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    left: '0',
    right: '0',
    bottom: '20px',
  },
  links: {
    marginBottom: '8px',
  },
  link: {
    fontSize: '13px',
    marginRight: '40px',
    color: '#fff',
  },
  copyright: {
    fontSize: '13px',
    color: '#fff',
    lineHeight: 1.5,
    textAlign: 'right',
  },
};
