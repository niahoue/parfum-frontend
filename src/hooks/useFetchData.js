// src/hooks/useFetchData.js
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const cache = {}; 

export const useFetchData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (cache[url]) {
        setData(cache[url]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosClient.get(url);
        cache[url] = response.data;
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, ...dependencies]);

  return { data, loading, error };
};