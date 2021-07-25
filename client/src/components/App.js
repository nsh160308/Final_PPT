import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";

// Main And Error
import DefaultPage from './views/DefaultPage/DefaultPage';
import ErrorPage from './utils/ErrorPage';

// Layout
import NavBar from "./views/NavBar/NavBar";

// Shop 프로젝트 관련 페이지
import ShopLandingPage from "./views/ShopLandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';

// Lookbook 프로젝트 관련 페이지
import UploadVideoPage from './views/UploadVideoPage/UploadVideoPage';
import MyTubePage from './views/MyTubeLandingPage/LandingPage';
import DetailVideoPage from './views/DetailVideoPage/DetailVideoPage';
import SubscriptionPage from './views/SubscriptionPage/SubscriptionPage';

//null   아무나 들어갈 수 있다.
//true   로그인한 사용자만 들어갈 수 있다.
//false  로그인한 사용자는 들어갈 수 없다.
function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          {/* Main and Error */}
          <Route exact path="/" component={Auth(DefaultPage, null)} />
          <Route exact path="/error" component={Auth(ErrorPage, false)} />
          {/* Shop 관련 라우팅 */}
          <Route exact path="/Shop" component={Auth(ShopLandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          {/* Lookbook 관련 라우팅 */}
          <Route exact path="/video/upload" component={Auth(UploadVideoPage, true, true)} />
          <Route exact path="/Lookbook" component={Auth(MyTubePage, null)} />
          <Route exact path="/video/:videoId" component={Auth(DetailVideoPage, null)} />
          <Route exact path="/subscription" component={Auth(SubscriptionPage, true)} />

        </Switch>
      </div>
    </Suspense>
  );
}

export default App;
