import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material/';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';

// mui의 css 우선순위가 높기때문에 important를 설정 - 실무하다 보면 종종 발생 우선순위 문제
const FormHelperTexts = styled(FormHelperText)`
  width: 100%;
  padding-left: 16px;
  font-weight: 700 !important;
  color: #d32f2f !important;
`;

const Boxs = styled(Box)`
  padding-bottom: 40px !important;
`;

interface JoinData {
  email: string;
  name: string;
  password: string;
  rePassword: string;
}

const Register: React.FC = () => {

  const theme = createTheme();
  const [checked, setChecked] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordState, setPasswordState] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const Navigate = useNavigate();

  const handleAgree = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onhandlePost = async (data: JoinData) => {
    const { email, name, password } = data;
    const postData = { email, name, password };

    // post
  //   await axios
  //     .post('/member/join', postData)
  //     .then(function (response) {
  //       console.log(response, '성공');
  //       history.push('/login');
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //       setRegisterError('회원가입에 실패하였습니다. 다시한번 확인해 주세요.');
  //     });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const joinData: JoinData = {
      email: data.get('email') as string,
      name: data.get('name') as string,
      password: data.get('password') as string,
      rePassword: data.get('rePassword') as string,
    };
    const { email, name, password, rePassword } = joinData;

    // 이메일 유효성 체크
    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!emailRegex.test(email)) setEmailError('올바른 이메일 형식이 아닙니다.');
    else setEmailError('');

    // 비밀번호 유효성 체크
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('비밀번호는 최소 8자 이상, 영문 대소문자와 숫자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }

    // 비밀번호 일치 여부 체크
    if (password !== rePassword) {
      setPasswordState('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordState('');
    }

    // 이름 유효성 체크
    if (name.length < 2 || name.length > 10) {
      setNameError('이름은 2자 이상 10자 이내로 입력해 주세요.');
    } else {
      setNameError('');
    }

    // 모든 유효성 검사 통과 후 회원가입 요청
    if (emailError === '' && passwordError === '' && passwordState === '' && nameError === '' && checked) {
      onhandlePost(joinData);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* 로고 넣을 자리 */}
          </Avatar>
          <Typography component="h1" variant="h5">
  지승구 폴더!! 회원가입
</Typography>
<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
  <FormControl component="fieldset" variant="standard">
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          autoFocus
          fullWidth
          type="email"
          id="email"
          name="email"
          label="이메일 주소"
          error={emailError !== '' || false}
        />
      </Grid>
      <FormHelperText>{emailError}</FormHelperText>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          type="password"
          id="password"
          name="password"
          label="비밀번호 (숫자+영문자+특수문자 8자리 이상)"
          error={passwordState !== '' || false}
        />
      </Grid>
      <FormHelperText>{passwordState}</FormHelperText>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          type="password"
          id="rePassword"
          name="rePassword"
          label="비밀번호 재입력"
          error={passwordError !== '' || false}
        />
      </Grid>
      <FormHelperText>{passwordError}</FormHelperText>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          id="name"
          name="name"
          label="이름"
          error={nameError !== '' || false}
        />
      </Grid>
      <FormHelperText>{nameError}</FormHelperText>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox onChange={handleAgree} color="primary" />}
          label="회원가입 약관에 동의합니다."
        />
      </Grid>
    </Grid>
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
      size="large"
    >
      회원가입
    </Button>
  </FormControl>
  <FormHelperText>{registerError}</FormHelperText>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    );
  };


export default Register;