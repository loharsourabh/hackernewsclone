import styles from './HomePage.module.css';
import { useFetch } from "../../hooks/useFetch";
import { getSearchByDate } from "../../endpoints";
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

export default function HomePage() {
  const footerLinks = [
    { name: 'Guidelines', value: 'https://news.ycombinator.com/newsguidelines.html' },
    { name: 'FAQ', value: 'https://news.ycombinator.com/newsfaq.html' },
    { name: 'Lists', value: 'https://news.ycombinator.com/lists' },
    { name: 'API', value: 'https://github.com/HackerNews/API' },
    { name: 'Security', value: 'https://news.ycombinator.com/security.html' },
    { name: 'Legal', value: 'https://www.ycombinator.com/legal/' },
    { name: 'Apply to YC', value: 'https://www.ycombinator.com/apply/' },
    { name: 'Contact', value: 'mailto:hn@ycombinator.com' }
  ];
  const navigate = useNavigate();
  const { pageNumber = 0 } = useParams();
  const [rawData, isFetched] = useFetch(getSearchByDate({
    tags: 'story',
    page: pageNumber,
    hitsPerPage: 30,
  }));
  const hits = isFetched ? rawData.hits : null;

  function getHostname(url) {
    const hostname = (new URL(url)).hostname;

    return hostname.startsWith('www.') ? hostname.replace('www.', '') : hostname;
  }

  return (
    <>
      <Header />
      {hits && (
        <div>
          <div className={styles.homePage}>
            <div>
              {hits.map((hit, i) => (
                <div className={styles.hit} key={hit.objectID}>
                  <div className={styles.hitTitle}>
                    <span className={styles.hitNumber}>{i + 1 + pageNumber * 30}.</span>
                    <a
                      className={styles.hitLink}
                      href={hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`}
                    >
                      {hit.title}
                    </a>
                    {hit.url && (
                      <a
                        className={styles.hitLinkVisible}
                        href={`https://news.ycombinator.com/from?site=${getHostname(hit.url)}`}
                      >
                        ({getHostname(hit.url)})
                      </a>
                    )}
                  </div>
                  <div className={styles.hitInfo}>
                    <a href={`https://news.ycombinator.com/item?id=${hit.objectID}`}>
                      {hit.points || 0} points by {hit.author}
                    </a>
                    <a href={`https://news.ycombinator.com/item?id=${hit.objectID}`}>
                      {hit.num_comments ? `${hit.num_comments} comments` : 'discuss'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <Link className={styles.nextPage} to={`/page/${Number(pageNumber) + 1}`}>More</Link>
          </div>
          <div className={styles.footer}>
            <a href='https://www.ycombinator.com/apply'>
              Applications are open for YC Winter 2023
            </a>
            <div className={styles.footerLinks}>
              {footerLinks.map(link => (
                <a href={link.value} key={link.value}>{link.name}</a>
              ))}
            </div>
            <form className={styles.searchForm} onSubmit={event => event.preventDefault()}>
              <label className={styles.searchInputLabel} htmlFor={styles.searchInput}>
                Search:
              </label>
              <input
                id={styles.searchInput}
                size={17}
                onKeyUp={event => {if (event.key === 'Enter') navigate(`/search?query=${event.target.value}`)}}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}