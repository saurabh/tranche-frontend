import React, { useState, useEffect } from 'react';
import { Layout } from 'app/components';
import SummaryCards from '../components/Summary/SummaryCards';
import Table from '../components/Earning/Table/Table';
import { PagesData } from 'config/constants';

export default function Trade() {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
  return (
    <Layout>
      {
        isDesktop &&
        <SummaryCards />
      }
      <Table pageType={PagesData.earn.pageType} />
    </Layout>
  );
}