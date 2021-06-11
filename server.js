require('dotenv').config();

const express = require('express');
const errorHandler = require('errorhandler');
const path = require('path');
const app = express();
const port = 3000;

const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');

// Initialize the prismic.io api
function initApi(req) {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
}

const handleLinkResolver = (doc) => {
  if (doc.type === 'about') {
    return `/about`;
  }
  if (doc.type === 'contact') {
    return `/contact`;
  }
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`;
  }

  return '/';
};

const handleRequest = async (api) => {
  const meta = await api.getSingle('meta');
  const navigation = await api.getSingle('navigation');
  const preloader = await api.getSingle('preloader');

  return {
    meta,
    navigation,
    preloader,
  };
};

app.use(errorHandler());

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  };

  res.locals.PrismicDOM = PrismicDOM;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const homepage = await api.getSingle('homepage');

  res.render('pages/home', {
    ...defaults,
    homepage,
  });
});

app.get('/about', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const about = await api.getSingle('about');

  res.render('pages/about', {
    ...defaults,
    about,
  });
});

app.get('/contact', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const contact = await api.getSingle('contact');

  res.render('pages/contact', {
    ...defaults,
    contact,
  });
});

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const product = await api.getByUID('product', req.params.uid);

  res.render('pages/detail', {
    ...defaults,
    product,
  });
});

app.listen(port, () => {
  console.log('example app listening at http://localhost:3000');
});
