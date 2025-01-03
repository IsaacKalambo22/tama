'use client';

import { BASE_URL } from '@/lib/utils';
import { useEffect, useState } from 'react';

const TwitterPosts = () => {
  const [tweets, setTweets] = useState<any[]>([]);
  const [error, setError] = useState<
    string | null
  >(null);

  const fetchTweets = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/tweets`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }
      const data = await response.json();
      console.log({ data });
      setTweets(data.tweets);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tweets.');
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div>
      <h1>Twitter Posts</h1>
      {error && (
        <p className='text-red-500'>{error}</p>
      )}
      <ul>
        {tweets?.map((tweet, index) => (
          <li
            key={index}
            className='p-4 border-b'
          >
            <p>{tweet.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TwitterPosts;
