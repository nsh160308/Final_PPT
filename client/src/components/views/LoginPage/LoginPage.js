import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
import { GoogleOutlined, MessageOutlined, } from '@ant-design/icons';

const { Title } = Typography;
const { Text } = Typography;
const LoginFormStyle = {
  fontFamily:"Nanum-Gothic",
  fontWeight:"bold",
  color: 'black'
}
const SocialFormStyle ={
  fontFamily:"Nanum-Gothic",
  fontWeight:"bold",
  color: 'white'
}
const IconsStyle = {
  fontSize: '20px', 
  color: 'white' 
}
const BtnStyle = {
  margin: '0px',
  width: '350px', 
  height: '32px', 
  marginBottom: '10px', 
}

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
  //useState
  const [formErrorMessage, setFormErrorMessage] = useState('')
  const [rememberMe, setRememberMe] = useState(rememberMeChecked)

  const handleRememberMe = (e) => {
    console.log('자동 로그인 체크', e.target);
    setRememberMe(!rememberMe)
  };
  const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('이메일 형식이 아닙니다.')
          .required('필수'),
        password: Yup.string()
          .min(6, '최소 6자 이상 입력하세요.')
          .required('필수'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password
          };
          dispatch(loginUser(dataToSubmit))//액션 값을 반환받음
            .then(response => {
              console.log('action에서 준 정보', response.payload);
              if (response.payload.loginSuccess) {//액션이 정상적으로 정보를 줬다면
                //로컬 스토리지에 userId이름으로 고유아이디 저장
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {//자동로그인을 체크했다면
                  window.localStorage.setItem('rememberMe', values.id);
                } else {//체크하지 않았다면
                  localStorage.removeItem('rememberMe');
                }
                props.history.push("/");//메인페이지 이동
              } else {//액션이 정보를 주지 않았다면
                setFormErrorMessage('이메일과 비밀번호를 다시 확인해 주세요.')
                setTimeout(() => {
                  setFormErrorMessage("")
                }, 3000);
              }
            })
            .catch(err => {
              setFormErrorMessage('치명적 오류!', err);
              setTimeout(() => {
                setFormErrorMessage("")
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="app">
            <Title level={2} style={{...LoginFormStyle}}>Log In</Title>
            <Form onSubmit={handleSubmit} style={{ width: '350px', }}>
              {/* 이메일 입력 */}
              <Form.Item required>
                <Input
                  id="email"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="이메일을 입력하세요."
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>
              {/* 비밀번호 입력 */}
              <Form.Item required>
                <Input
                  id="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="비밀번호를 입력하세요."
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>
              {/* 로그인 정보 불일치 시 보여주는 에러 메세지 */}
              {formErrorMessage && (
                <label >
                  <p className="formError">
                    {formErrorMessage}
                  </p>
                </label>
              )}
              <Form.Item>
                <Checkbox id="rememberMe" onChange={handleRememberMe} style={{...LoginFormStyle,}} checked={rememberMe} >자동 로그인</Checkbox>
                <a className="login-form-forgot" href="/modifyPassword" style={{ float: 'right' }}>
                  비밀번호 찾기
                  </a>
                <div>
                  <Button type="primary" 
                  htmlType="submit" 
                  className="login-form-button" 
                  style={{ minWidth: '100%', ...BtnStyle, ...LoginFormStyle }} 
                  disabled={isSubmitting} 
                  onSubmit={handleSubmit}>
                    Log In
                  </Button>
                </div>
                <span style={{...LoginFormStyle}}>회원이 아니신가요?<a href="/register" >지금 가입하러 가기!</a></span>
              </Form.Item>
            </Form>
              {/* 구글 로그인 */}
              <a href="http://localhost:5000/auth/google">
                <Button style={{...BtnStyle, background: '#ec4646'}}>
                  <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <GoogleOutlined style={{...IconsStyle}}/>&nbsp;
                    <Text strong="true" style={{...SocialFormStyle}}>구글 로그인</Text>
                  </div>
                </Button>
              </a>
              {/* 카카오 로그인 */}
              <a href="http://localhost:5000/auth/kakao">
                <Button style={{...BtnStyle, background: '#FEDE00'}}>
                  <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <MessageOutlined style={{...IconsStyle, color: '#3E2224' }}/>&nbsp;
                    <Text strong="true" style={{...SocialFormStyle, color: '#3E2224'}}>카카오 로그인</Text>
                  </div>
                </Button>
              </a>
              {/* 네이버 로그인 */}
              <a href="http://localhost:5000/auth/naver">
                <Button style={{...BtnStyle, background: '#04CF5C'}}>
                  <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <MessageOutlined style={{...IconsStyle}}/>&nbsp;
                    <Text strong="true" style={{...SocialFormStyle}}>네이버 로그인</Text>
                  </div>
                </Button>
              </a>
          </div>
        );
      }}
    </Formik>
  );
};

export default withRouter(LoginPage);


