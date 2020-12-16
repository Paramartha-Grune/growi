import loggerFactory from '~/utils/logger';
import { config as nextI18NextConfig } from '~/i18n';

const path = require('path');
const fs = require('graceful-fs');

const helmet = require('helmet');
const express = require('express');
const { body } = require('express-validator');

const logger = loggerFactory('growi:routes:installer');

const router = express.Router();


module.exports = function(crowi) {
  const apiV3FormValidator = require('../../middlewares/apiv3-form-validator')(crowi);

  const models = crowi.models;
  const { appService } = crowi;

  const User = models.User;
  const Page = models.Page;

  async function initSearchIndex() {
    const { searchService } = crowi;
    if (!searchService.isReachable) {
      return;
    }

    await searchService.rebuildIndex();
  }

  async function createPage(filePath, pagePath, owner, lang) {
    try {
      const markdown = fs.readFileSync(filePath);
      return Page.create(pagePath, markdown, owner, {});
    }
    catch (err) {
      logger.error(`Failed to create ${pagePath}`, err);
    }
  }

  async function createInitialPages(owner, lang) {
    const promises = [];

    // create portal page for '/'
    promises.push(createPage(path.join(crowi.localeDir, lang, 'welcome.md'), '/', owner, lang));

    // create /Sandbox/*
    promises.push(createPage(path.join(crowi.localeDir, lang, 'sandbox.md'), '/Sandbox', owner, lang));
    promises.push(createPage(path.join(crowi.localeDir, lang, 'sandbox-bootstrap4.md'), '/Sandbox/Bootstrap4', owner, lang));
    promises.push(createPage(path.join(crowi.localeDir, lang, 'sandbox-diagrams.md'), '/Sandbox/Diagrams', owner, lang));
    promises.push(createPage(path.join(crowi.localeDir, lang, 'sandbox-math.md'), '/Sandbox/Math', owner, lang));

    await Promise.all(promises);

    try {
      await initSearchIndex();
    }
    catch (err) {
      logger.error('Failed to build Elasticsearch Indices', err);
    }
  }

  const validators = [
    body('username').trim().custom(value => value.match(/^[\da-zA-Z\-_.]+$/)),
    body('name').trim().exists({ checkFalsy: true }),
    body('email').normalizeEmail().exists({ checkFalsy: true }),
    body('password').trim().custom(value => value.match(/^[\x20-\x7F]{6,}$/)),
    body('lang').if(value => value != null).isIn(nextI18NextConfig.allLanguages),
  ];

  router.post('/', helmet.noCache(), validators, apiV3FormValidator, async(req, res) => {

    const {
      username, name, email, password,
    } = req.body;
    const lang = req.body.lang || 'en_US';

    await appService.initDB(lang);

    // create first admin user
    // TODO: with transaction
    let adminUser;
    try {
      adminUser = await User.createUser(name, username, email, password, lang);
      await adminUser.asyncMakeAdmin();
    }
    catch (err) {
      req.form.errors.push(req.t('message.failed_to_create_admin_user', { errMessage: err.message }));
      return res.render('installer');
    }
    // create initial pages
    await createInitialPages(adminUser, lang);

    crowi.setupAfterInstall();
    appService.publishPostInstallationMessage();

    // login with passport
    req.logIn(adminUser, (err) => {
      if (err) {
        req.flash('successMessage', req.t('message.complete_to_install1'));
        req.session.redirectTo = '/admin/app';
        return res.redirect('/login');
      }

      req.flash('successMessage', req.t('message.complete_to_install2'));
      return res.redirect('/admin/app');
    });
  });

  return router;
};