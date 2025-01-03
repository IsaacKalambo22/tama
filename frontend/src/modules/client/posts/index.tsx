'use client';

import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import CustomLoader from '@/modules/common/custom-loader';
import HeaderText from '@/modules/common/header-text';
import { Facebook, Twitter } from 'lucide-react'; // Icons from lucide-react
import { useEffect, useState } from 'react';
import PostCard from './post-card';
import TwitterPosts from './twitter-posts';

const Posts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const accessToken =
        process.env
          .NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

      const response = await fetch(
        `https://graph.facebook.com/543889322136808/feed?fields=message,created_time,attachments&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.data);
    } catch (err: any) {
      setError(
        err.message || 'Failed to fetch posts'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (error) {
    return (
      <div className='text-center text-red-500 mt-10'>
        {error}
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto flex w-full flex-col gap-8 mb-16'>
      <HeaderText
        title='Social Media Highlights'
        subtitle='Stay connected with our latest updates and stories from Facebook and Twitter'
      />

      <Tabs
        defaultValue='facebook'
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-2 mb-8 gap-4'>
          <TabsTrigger asChild value='facebook'>
            <Button
              variant='ghost'
              size='lg'
              className='w-full justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400'
            >
              <Facebook className='mr-2 h-5 w-5' />
              Facebook
            </Button>
          </TabsTrigger>
          <TabsTrigger asChild value='twitter'>
            <Button
              variant='ghost'
              size='lg'
              className='w-full justify-center text-gray-700 hover:text-sky-600 hover:bg-sky-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400'
            >
              <Twitter className='mr-2 h-5 w-5' />
              Twitter
            </Button>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='facebook'>
          <div className='max-w-4xl mx-auto flex flex-col gap-10'>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value='twitter'>
          <TwitterPosts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Posts;
