import i18n from 'i18next';
import resources from './locales/index.js';

const instance = i18n.createInstance();

instance.init({
  resources,
  lng: 'ru',
});

export default instance;
