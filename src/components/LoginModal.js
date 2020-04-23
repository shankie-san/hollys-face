import React, { Component } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

import Cross from "./icons/Cross";
import FormError from "./FormError";

class LoginModal extends Component {
  componentDidMount() {
    Modal.setAppElement("body");
  }

  render() {
    const { isOpen, onRequestClose } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="modal"
        overlayClassName="modal-wrapper"
      >
        <header className="modal-header">
          <div className="modal-closer" onClick={onRequestClose}>
            <Cross className="modal-closer-icon" />
          </div>
        </header>
        <div className="modal-content">
          <h2>Log in</h2>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values, actions) => {
              firebase
                .auth()
                .sendSignInLinkToEmail(values.email, {
                  // Additional state showPromo=1234 can be retrieved from URL on
                  // sign-in completion in signInSuccess callback by checking
                  // window.location.href.
                  url: window.location.origin,
                  // Always true for email link sign-in.
                  handleCodeInApp: true
                })
                .then(function() {
                  // The link was successfully sent. Inform the user.
                  // Save the email locally so you don't need to ask the user for it again
                  // if they open the link on the same device.
                  window.localStorage.setItem("emailForSignIn", values.email);
                  onRequestClose();
                  alert("Check your email for a one-time sign-in link.");
                })
                .catch(function(error) {
                  console.error(error);
                  alert(
                    "Oops, we encountered a problem. Please try again, or if you continue to have problems, please let us know."
                  );
                });
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Please enter a valid email address")
                .required("Required")
            })}
            render={({
              isSubmitting,
              isInitialValid,
              status,
              errors,
              touched,
              values
            }) => (
              <Form className="loginForm">
                <div className="fieldWrapper">
                  <label htmlFor="email">Email address</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name="email" component={FormError} />
                </div>
                <input
                  className="profileForm-submit"
                  type="submit"
                  value="Submit"
                  disabled={isSubmitting}
                />
                {status && status.msg && (
                  <div className={"field-error"}>{status.msg}</div>
                )}
              </Form>
            )}
          />
        </div>
      </Modal>
    );
  }
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired
};

export default LoginModal;
