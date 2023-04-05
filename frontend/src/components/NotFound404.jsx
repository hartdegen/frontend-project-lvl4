import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const NotFound404 = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <p>
        {t('pageNotExist')}
        <br />
        <Link to="/">{t('toMainPage')}</Link>
      </p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </>
  );
};

export default NotFound404;
