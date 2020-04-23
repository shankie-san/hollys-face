import React from "react";

const defaultUserContext = {
  isUserSignedIn: false,
  user: null,
  loginAttempted: false
};

export const UserContext = React.createContext(defaultUserContext);

export const withUser = Component =>
  class GetUser extends React.Component {
    render() {
      return (
        <UserContext.Consumer>
          {context => (
            <Component
              {...this.props}
              user={context.user}
              signOut={context.signOut}
            />
          )}
        </UserContext.Consumer>
      );
    }
  };
