import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";

import { Button } from "@material-ui/core/";
import { GoogleLogin } from "react-google-login";

import { login, checkLogin } from "../../actions/auth.js";
import { AUTH_API_STATUS } from "../../constants/actionTypes.js";
import { useBtnStyles } from "../../styles/buttonStyles.js";
import { clientId } from "../../config.js";

const Login = () => {
  const dispatch = useDispatch();
  const btnClasses = useBtnStyles();

  let history = useHistory();

  const { loggedIn } = useSelector((state) => state.user);

  const googleSuccess = async (googleData) => {
    try {
      await dispatch(
        login(
          googleData.tokenId,
          googleData.profileObj.name,
          googleData.profileObj.email
        )
      );
      history.push("/home");
    } catch (err) {
      console.log("Google login error");
    }
  };
  const googleFailure = (err) => {
    console.log("Google login error");
    console.log(err);
  };

  useEffect(() => {
    dispatch({
      type: AUTH_API_STATUS,
      payload: { message: null, success: null, loading: true },
    });
    dispatch(checkLogin());

    if (loggedIn) {
      history.push("/gta/home");
    }
  }, [dispatch, loggedIn, history]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <GoogleLogin
        clientId={clientId}
        render={(renderProps) => (
          <Button
            className={btnClasses.buttons}
            variant="contained"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Google login
          </Button>
        )}
        onSuccess={googleSuccess}
        onFailure={googleFailure}
        cookiePolicy="single_host_origin"
      />
    </div>
  );
};

export default Login;
