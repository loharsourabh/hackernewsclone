import { useState, useEffect, useRef } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState();
  const urlRef = useRef(url);
  const optionsRef = useRef(options);
  const isFetchedRef = useRef(false);

  useEffect(() => {
    let canIgnore = false;

    async function makeRequest() {
      const response = await fetch(url, optionsRef.current);
      const data = await response.json();

      if (!canIgnore) {
        setData(data);
        urlRef.current = url;
        isFetchedRef.current = true;
      }
    }

    makeRequest();

    return () => {canIgnore = true}
  }, [url]);

  if (url !== urlRef.current) {
    optionsRef.current = options;
    isFetchedRef.current = false;
  }

  return [data, isFetchedRef.current];
}