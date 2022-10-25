import styles from './SearchPage.module.css';
import { getSearch, getSearchByDate } from '../../endpoints';
import { useFetch } from '../../hooks/useFetch';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo } from 'react';

export default function SearchPage() {
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const navigate = useNavigate();
  const urlValues = {
    query: urlSearchParams.get('query') || '',
    tags: urlSearchParams.get('tags'),
    baseUrl: urlSearchParams.get('baseUrl') || 'search',
    numericFilters: urlSearchParams.get('numericFilters'),
    hitsPerPage: urlSearchParams.get('hitsPerPage') || 30,
    page: Number(urlSearchParams.get('page')) || 0,
  }

  const [inputValue, setInputValue] = useState(urlValues.query);
  let baseUrl;

  if (urlValues.baseUrl === 'search') {
    baseUrl = getSearch;
  }

  else if (urlValues.baseUrl === 'search_by_date') {
    baseUrl = getSearchByDate;
  }

  const queryParams = Object.keys(urlValues).reduce((prev, curr) => {
    const value = urlValues[curr];

    if (value === null || curr === 'baseUrl') return prev;

    return { ...prev, [curr]: value };
  }, {});

  const [rawData] = useFetch(baseUrl(queryParams))
  const hits = rawData?.hits;
  const debounceTimeoutRef = useRef();
  const filterArr = useMemo(() => [
    {
      label: 'Search',
      queryParam: 'tags',
      options: [
        { name: 'All', value: null },
        { name: 'Stories', value: 'story' },
        { name: 'Comments', value: 'comment' }
      ]
    },
    {
      label: 'by',
      queryParam: 'baseUrl',
      options: [
        { name: 'Popularity', value: 'search' },
        { name: 'Date', value: 'search_by_date' }
      ]
    },
    {
      label: 'for',
      queryParam: 'numericFilters',
      options: [
        { name: 'All time', value: null },
        { name: 'Last 24h', value: `created_at_i>${Date.now() / 1000 - 86400}` },
        { name: 'Past Week', value: `created_at_i>${Date.now() / 1000 - 604800}` },
        { name: 'Past Month', value: `created_at_i>${Date.now() / 1000 - 2628000}` },
        { name: 'Past Year', value: `created_at_i>${Date.now() / 1000 - 31540000}` }
      ]
    }
  ], []);
  const activeFilterRef = useRef();

  useEffect(() => {
    return () => clearTimeout(debounceTimeoutRef.current);
  }, []);

  function updateQuery(event) {
    const { value } = event.target;

    setInputValue(value);
    clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      value ? urlSearchParams.set('query', value) : urlSearchParams.delete('query');
      updateSearchParams(urlSearchParams, true);
    }, 250);
  }

  function showFilters(event) {
    const filterList = event.currentTarget.parentElement;

    if (filterList.className.includes(styles.filterVisible)) {
      filterList.classList.remove(styles.filterVisible);
    }

    else {
      activeFilterRef.current?.classList.remove(styles.filterVisible);
      activeFilterRef.current = filterList;
      filterList.classList.add(styles.filterVisible);
    }
  }

  function selectFilter(param, value) {
    activeFilterRef.current.classList.remove(styles.filterVisible);

    value ? urlSearchParams.set(param, value) : urlSearchParams.delete(param);
    updateSearchParams(urlSearchParams, true);
  }

  function updateSearchParams(searchParams, replace) {
    navigate(`/search?${searchParams.toString()}`, { replace: replace ? true : false })
  }

  function nextPageUrl(pageValue) {
    const searchParams = new URLSearchParams(search);

    searchParams.set('page', pageValue);

    return `/search?${searchParams.toString()}`
  }

  return (
    <div>
      <div className={styles.searchHeader}>
        <a className={styles.logo} href='https://news.ycombinator.com'>
          <img
            src='https://hn.algolia.com/packs/media/images/logo-hn-search-a822432b.png'
            alt='hackers news logo'
          />
        </a>
        <div className={styles.searchLabel}>
          <span>Search</span>
          <span>Hacker News</span>
        </div>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='11' cy='11' r='8'></circle>
              <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
            </svg>
          </span>
          <input
            value={inputValue}
            onChange={updateQuery}
            className={styles.searchInput}
            placeholder='Search stories by title, url or author'
          />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.filters}>
          {filterArr.map(filter => (
            <div className={styles.filter} key={filter.label}>
              <span className={styles.filterLabel}>{filter.label}</span>
              <div className={styles.filterButton}>
                <button className={styles.selectedFilter} onClick={showFilters}>
                  {filter.options.find(v => v.value === urlValues[filter.queryParam])?.name}
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='6 9 12 15 18 9'></polyline>
                  </svg>
                </button>
                <ul className={styles.filterOptions}>
                  {filter.options.map(option => (
                    <li
                      className={styles.filterOption}
                      key={option.name}
                      onClick={() => selectFilter(filter.queryParam, option.value)}
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {hits && (
            <div className={styles.searchResultsInfo}>
              {rawData.nbHits} results ({rawData.processingTimeMS / 1000} seconds)
            </div>
          )}
        </div>
        {hits && (
          <div className={styles.hits}>
            {hits.map(hit => (
              <div className={styles.hit} key={hit.objectID}>
                <div className={styles.hitTitle}>
                  <a
                    className={styles.hitLink}
                    href={`https://news.ycombinator.com/item?id=${hit.objectID}`}
                  >
                    {hit.title}
                  </a>
                  {hit.url && (
                    <a className={styles.hitLinkVisible} href={hit.url}>({hit.url})</a>
                  )}
                </div>
                <div className={styles.hitInfo}>
                  <a href={`https://news.ycombinator.com/item?id=${hit.objectID}`}>
                    {hit.points || 0} points
                  </a>
                  <a href={`https://news.ycombinator.com/user?id=${hit.author}`}>
                    {hit.author}
                  </a>
                  <a href={`https://news.ycombinator.com/item?id=${hit.objectID}`}>
                    {hit.num_comments || 0} comments
                  </a>
                  {(hit.comment_text || hit.story_text) && (
                    <div
                      className={styles.hitComment}
                      dangerouslySetInnerHTML={{ __html: hit.comment_text || hit.story_text }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={styles.pagination}>
          <Link className={styles.paginationLink} to={nextPageUrl(0)}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='11 17 6 12 11 7'></polyline>
              <polyline points='18 17 13 12 18 7'></polyline>
            </svg>
          </Link>
          {Array.from({ length: 11 }, (v, i) => (urlValues.page + i > 4) && (urlValues.page + i < 39) && (
            <Link
              className={`${styles.paginationLink} ${(i === 5 ? styles.currentPage : '')}`}
              to={nextPageUrl(urlValues.page - 5 + i)}
              key={i}
            >
              {urlValues.page - 4 + i}
            </Link>
          ))}
          <Link className={styles.paginationLink} to={nextPageUrl(33)}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='13 17 18 12 13 7'></polyline>
              <polyline points='6 17 11 12 6 7'></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}