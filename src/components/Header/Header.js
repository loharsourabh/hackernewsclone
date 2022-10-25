import styles from './Header.module.css';

export default function Header() {
  const headerLinks = {
    new: 'https://news.ycombinator.com/newest',
    past: 'https://news.ycombinator.com/front',
    comments: 'https://news.ycombinator.com/newcomments',
    ask: 'https://news.ycombinator.com/ask',
    show: 'https://news.ycombinator.com/show',
    jobs: 'https://news.ycombinator.com/jobs',
    submit: 'https://news.ycombinator.com/submit',
  };

  return (
    <div className={styles.header}>
      <img
        className={styles.yCombinatorLink}
        src='https://news.ycombinator.com/y18.gif'
        alt='yCombinator link'
      />
      <div className={styles.links}>
        <a
          className={styles.hackerNewsLink}
          href='https://news.ycombinator.com/news'
        >
          Hacker News
        </a>
        <div className={styles.mainLinks}>
          {Object.keys(headerLinks).map(linkName => (
            <a
              className={styles.link}
              href={headerLinks[linkName]}
              key={linkName}
            >
              {linkName}
            </a>
          ))}
        </div>
      </div>
      <a
        className={styles.loginLink}
        href='https://news.ycombinator.com/login?goto=newest'
      >
        login
      </a>
    </div>
  );
} 