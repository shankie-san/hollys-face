import React from "react";
import { firestore, auth } from "./fire";
import { withRouter } from "react-router";
import { Component } from "react";
import { UserContext } from "./UserContext";
import LoadingSpinner from "./components/LoadingSpinner";

const defaultUserContext = {
  isUserSignedIn: false,
  user: null,
  loginAttempted: false,
  loading: true
};

class UserProvider extends Component {
  state = defaultUserContext;

  getUser = uid => {
    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then(snap => {
        this.setState({
          loading: false,
          isUserSignedIn: true,
          user: snap.data(),
          loginAttempted: true
        });
        // !snap.exists && this.props.history.push("/profile");
      })
      .catch(err => {
        console.error(err);
        alert("An error occurred while logging in. Please try again");
      });
  };

  componentDidMount() {
    // Watch for change in auth state and set app state
    this.unregisterAuthObserver = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.getUser(authUser.uid);
      } else {
        console.log("no user found");
        this.setState({
          isUserSignedIn: false,
          user: null,
          loading: false
        });
      }
    });

    // Do email sign in

    // Confirm the link is a sign-in with email link.
    if (auth.isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.
      auth
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser

          window.localStorage.setItem("user", JSON.stringify(result.user));
          window.history.replaceState(
            // Get rid of the nasty query string
            {},
            document.title,
            window.location.href.split("?")[0]
          );
        })
        .catch(error => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.

          this.setState({
            isUserSignedIn: false,
            user: null
          });
        });
    } else if (window.localStorage.getItem("user")) {
      this.getUser(JSON.parse(window.localStorage.getItem("user")).uid);
    }
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const { children, history } = this.props;
    const { isUserSignedIn, user } = this.state;

    if (user) {
      user.signOut = () => {
        auth
          .signOut()
          .then(() => {
            window.localStorage.removeItem("user");
            this.setState({
              isUserSignedIn: false,
              user: null
            });
          })
          .then(() => history.push("/"))
          .catch(() => console.log("unable to sign out"));
      };
    }

    return (
      <UserContext.Provider
        value={{
          isUserSignedIn,
          user
        }}
      >
        {this.state.loading ? <LoadingSpinner /> : children}
      </UserContext.Provider>
    );
  }
}

export default withRouter(UserProvider);
