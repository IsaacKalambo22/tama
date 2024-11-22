'use client';

import {
  fetchReportsAndPublications,
  FileProps,
} from '@/lib/api';
import CustomForm from '@/modules/admin/custom-form';
import AddNewHeader from '@/modules/common/add-new-header';
import { useEffect, useState } from 'react';

const ReportsAndPublicationsPage = () => {
  const [reports, setReports] = useState<
    FileProps[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const fetchedReports =
          await fetchReportsAndPublications();
        setReports(fetchedReports);
      } catch (err) {
        console.error(
          'Failed to fetch reports:',
          err
        );
        setError(
          'Failed to load reports and publications.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <div>
      <AddNewHeader
        name='Reports and Publications'
        buttonName='New Report or Publication'
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <CustomForm files={reports} />
      )}
    </div>
  );
};

export default ReportsAndPublicationsPage;
