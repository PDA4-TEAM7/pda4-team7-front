import { useDispatch, useSelector } from "react-redux";
import authAPI, { IAuth } from "../apis/authAPI";
import { setUser, clearUser } from "../store/user";
import { useEffect } from "react";
import { RootState } from "../store/store";

export function useAuth() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const service = new authAPI();

  // POST signIn
  async function signIn(auth: { user_id: string; password: string }) {
    try {
      const res = await service.signIn(auth);
      if (res && res.user) {
        dispatch(
          setUser({
            userName: res.user.username,
            userId: res.user.user_id,
          })
        );
        return true;
      } else {
        throw Error;
      }
    } catch (err) {
      //복구
      console.log("Error to login", err);
      return false;
      //실패 케이스에 따라 로그아웃 실패 노출(존재하지않는계정 )
    }
  }

  // POST signup
  async function signUp({ user_id, username, password, confirm_password }: IAuth) {
    const res = await service.signUp({
      user_id,
      username,
      confirm_password,
      password,
    });
    if (res && res.user) {
      dispatch(
        setUser({
          userName: res.user.username,
          userId: res.user.user_id,
        })
      );
      return res;
    } else {
      console.error("signup failed");
      return res;
    }
  }
  //POST validateUserId 유저아이디 유효성(중복)체크
  async function validateUserId(user_id: string) {
    try {
      const res = await service.validateUserId(user_id);
      //true: 사용가능한 이메일 false: 중복 이메일
      return res;
    } catch (err) {
      //이메일 중복체크 실패
      console.log("Error to verify email", err);
    }
  }
  //POST validateUsername 유저이름 유효성(중복)체크
  async function validateUsername(username: string) {
    try {
      const res = await service.validateUsername(username);
      //true: 사용가능한 이메일 false: 중복 이메일
      return res;
    } catch (err) {
      //이메일 중복체크 실패
      console.log("Error to verify email", err);
    }
  }

  //logout 유저정보 clear
  async function signOut() {
    try {
      const res = await service.signOut();
      if (res) dispatch(clearUser());
    } catch (err) {
      console.log(err);
    }
  }

  //마운트시 로그인여부체크(쿠키)해서 유저정보 세팅
  useEffect(() => {
    async function init() {
      if (!user.userId) {
        const res = await service.isLogin();
        if (res) {
          dispatch(
            setUser({
              userName: res.user.username,
              userId: res.user.user_id,
            })
          );
        }
      }
    }
    init();
  }, []);
  return {
    user,
    signIn,
    signUp,
    signOut,
    validateUserId,
    validateUsername,
  };
}
