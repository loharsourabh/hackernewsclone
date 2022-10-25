function makeUrl(baseUrl, query = {}) {
  let url = 'http://hn.algolia.com/api/v1' + baseUrl + '?';

  for (let param in query) {
    url += `${param}=${encodeURIComponent(query[param])}&`;
  }

  return url.slice(0, -1);
}

export function getSearch(query) {
  return makeUrl('/search', query);
}

export function getSearchByDate(query) {
  return makeUrl('/search_by_date', query);
}