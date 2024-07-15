import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

type Props = {};

const Page: React.FC<Props> = (props) => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the workflow name and description page
    router.push('/workflows/_components');
  }, [router]);

  return null; // or you can return a loading spinner if you want
};

export default Page;
