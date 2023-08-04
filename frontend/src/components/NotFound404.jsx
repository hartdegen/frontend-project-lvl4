import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import paths from '../routes.js';

const NotFound404 = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('pageNotExist')}</h1>
      <Link to={paths.mainPage}>{t('toMainPage')}</Link>
    </>
  );
};

export default NotFound404;
