'use client';

import { Input } from '@/components/ui/input';
import {
  BlogProps,
  EventProps,
  FileProps,
  ShopProps,
} from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import CustomError from '@/modules/common/custom-error';
import CustomLoader from '@/modules/common/custom-loader';
import { debounce } from 'lodash';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import EventCard from '../../event-calendar/event-card';
import ShopCard from '../../shop/shop-card';
import SearchBlogCard from '../search-blog-card';
import SearchFileCard from '../search-file-card';
import SearchModal from '../search-modal';

const SearchDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
}) => {
  const [searchQuery, setSearchQuery] =
    useState('');
  const [searchResults, setSearchResults] =
    useState<any>(null);
  const [isLoading, setIsLoading] =
    useState(false);
  const [isError, setIsError] = useState(false);

  const debouncedFetchResults = useRef(
    debounce(async (query) => {
      if (query.length < 3) return;

      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch(
          `${BASE_URL}/search?query=${query}`
        );
        if (!response.ok)
          throw new Error(
            'Failed to fetch search results'
          );

        const data = await response.json();
        setSearchResults(data.data);
      } catch (error) {
        console.error('Search Error:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000)
  ).current;
  console.log({ searchResults });
  // Handle search input change
  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedFetchResults(query); // Call debounced function
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedFetchResults.cancel();
  }, []);

  // Disable scrolling when dialog is open
  useEffect(() => {
    document.body.style.overflow = isOpen
      ? 'hidden'
      : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle clicks outside the dialog
  const dialogRef = useRef<HTMLDivElement | null>(
    null
  );
  const handleOutsideClick = (
    e: React.MouseEvent<
      HTMLDivElement,
      MouseEvent
    >
  ) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(
        e.target as Node
      )
    ) {
      setIsOpen();
    }
  };

  return (
    <div className='max-w-xl sm:px-16 flex flex-col w-full gap-10 sm:gap-16 mb-16 min-h-40 h-full'>
      {isOpen && (
        <SearchModal
          name='search'
          isOpen={isOpen}
          onClose={setIsOpen}
        >
          <Input
            type='search'
            placeholder='What are you looking for?...'
            value={searchQuery}
            onChange={handleSearch}
            className='w-full h-11 pl-5 pr-4  rounded-lg focus:outline-none'
          />
          {/* 🔎 Search Results Container */}
          <div className='w-full flex flex-col overflow-y-auto max-h-[70vh]'>
            {isLoading && <CustomLoader />}
            {isError && (
              <CustomError message='Error fetching data' />
            )}

            {!isLoading &&
              !isError &&
              searchResults && (
                <div className='w-full flex flex-col gap-4'>
                  {/* ✅ Section for Forms */}
                  {searchResults.forms &&
                    searchResults.forms.length >
                      0 && (
                      <>
                        <h2 className='text-lg font-semibold mb-4'>
                          Current Forms
                        </h2>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
                          {searchResults.forms.map(
                            (form: FileProps) => (
                              <SearchFileCard
                                file={form}
                                key={form.id}
                              />
                            )
                          )}
                        </div>
                      </>
                    )}
                  {searchResults.publications &&
                    searchResults.publications
                      .length > 0 && (
                      <>
                        <h2 className='text-lg font-semibold mb-4'>
                          Publications
                        </h2>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
                          {searchResults.publications.map(
                            (
                              publication: FileProps
                            ) => (
                              <SearchFileCard
                                file={publication}
                                key={
                                  publication.id
                                }
                              />
                            )
                          )}
                        </div>
                      </>
                    )}
                  {searchResults.shops &&
                    searchResults.shops.length >
                      0 && (
                      <>
                        <h2 className='text-lg font-semibold mb-4'>
                          Shops
                        </h2>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
                          {searchResults.shops.map(
                            (shop: ShopProps) => (
                              <ShopCard
                                shop={shop}
                                key={shop.id}
                              />
                            )
                          )}
                        </div>
                      </>
                    )}
                  {searchResults.blogs &&
                    searchResults.blogs.length >
                      0 && (
                      <>
                        <h2 className='text-lg font-semibold mb-4'>
                          Blogs
                        </h2>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
                          {searchResults.blogs.map(
                            (blog: BlogProps) => (
                              <SearchBlogCard
                                blog={blog}
                                key={blog.id}
                              />
                            )
                          )}
                        </div>
                      </>
                    )}
                  {searchResults.news &&
                    searchResults.news.length >
                      0 && (
                      <>
                        <h2 className='text-lg font-semibold mb-4'>
                          News
                        </h2>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-6'>
                          {searchResults.news.map(
                            (news: BlogProps) => (
                              <SearchBlogCard
                                blog={news}
                                key={news.id}
                              />
                            )
                          )}
                        </div>
                      </>
                    )}
                  {searchResults.events &&
                    searchResults.events.length >
                      0 && (
                      <>
                        <h2 className='text-lg font-semibold mb-4'>
                          Events
                        </h2>
                        <div className='w-full grid grid-cols-1 gap-6'>
                          {searchResults.events.map(
                            (
                              event: EventProps
                            ) => (
                              <EventCard
                                event={event}
                                key={event.id}
                              />
                            )
                          )}
                        </div>
                      </>
                    )}
                </div>
              )}
          </div>
        </SearchModal>
        // <div
        //   className='fixed w-full max-w-[20rem] inset-0 bg-opacity-50 backdrop-blur-lg flex justify-center items-start overflow-hidden bg-white'
        //   onClick={handleOutsideClick}
        // >
        //   <div
        //     ref={dialogRef}
        //     className='fixed h-full w-full max-w-[70rem] top-5 px-4'
        //   >
        //     <div className='relative w-full mb-6'>
        //       <input
        //         type='search'
        //         placeholder='Search products...'
        //         value={searchQuery}
        //         onChange={handleSearch}
        //         className='w-full h-14 pl-10 pr-4 bg-zinc-500 placeholder-white text-white rounded-lg focus:outline-none'
        //       />
        //       <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        //         <Search className='text-white h-4 w-5' />
        //       </div>
        //     </div>

        //     <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-full w-full overflow-y-auto'>
        //       {isLoading && <CustomLoader />}
        //       {isError && (
        //         <CustomError message='Error fetching data' />
        //       )}
        //       {!isLoading &&
        //         !isError &&
        //         searchResults && <>hello</>}
        //     </div>
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default SearchDialog;
