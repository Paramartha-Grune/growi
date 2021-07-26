import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withUnstatedContainers } from './UnstatedUtils';
import { toastSuccess, toastError } from '../util/apiNotification';
import AppContainer from '../services/AppContainer';


const PasswordResetRequestForm = (props) => {
  // TODO: apply i18n by GW-6861
  // const { t } = props;

  const {
    appContainer,
  } = props;

  const onClickSendPasswordResetRequestMail = async(email) => {
    try {
      const res = await appContainer.apiPost('/forgot-password', { });
      const { failedToSendEmail } = res.data;
      if (failedToSendEmail == null) {
        const msg = `Email has been sent<br>・${email}`;
        toastSuccess(msg);
      }
      // else {
      //   const msg = { message: `email: ${failedToSendEmail.email}<br>reason: ${failedToSendEmail.reason}` };
      //   toastError(msg);
      // }
    }
    catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-6 mt-5">
            <div className="text-center">
              <h1><i className="icon-lock large"></i></h1>
              <h2 className="text-center">Forgot Password?</h2>
              <p>You can reset your password here.</p>
              <form role="form" className="form" method="post">
                <div className="form-group">
                  <div className="input-group">
                    <input name="email" placeholder="email address" className="form-control" type="email" />
                  </div>
                </div>
                <div className="form-group">
                  <input
                    name="reset-password-btn"
                    className="btn btn-lg btn-primary btn-block"
                    value="Reset Password"
                    type="submit"
                    onClick={() => { onClickSendPasswordResetRequestMail() }}
                  />
                </div>
                <a href="/login">
                  <i className="icon-login mr-1"></i>Return to login
                </a>
              </form>
            </div>
          </div>

        </div>
      </div>

    </>
  );
};

/**
 * Wrapper component for using unstated
 */
const PasswordResetRequestFormWrapper = withUnstatedContainers(PasswordResetRequestForm, [AppContainer]);

PasswordResetRequestForm.propTypes = {
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  t: PropTypes.func.isRequired, //  i18next
};

export default withTranslation()(PasswordResetRequestFormWrapper);
