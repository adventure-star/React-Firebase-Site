import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';

import { withAuthentication } from './services/Session';
import { compose } from 'recompose';
import { withFirebase } from './services/Firebase';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/style.css';
import './css/custom.css';
import 'font-awesome/css/font-awesome.min.css';


import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import PasswordForgot from './pages/Auth/PasswordForgot';
import PasswordReset from './pages/Auth/PasswordReset';

import Home from './pages/Home';

import PartnersList from './pages/Partner/List';
import PartnerAdd from './pages/Partner/Add';
import PartnerEdit from './pages/Partner/Edit';

import CustomersList from './pages/Customer/List';
import CustomerAdd from './pages/Customer/Add';
import CustomerEdit from './pages/Customer/Edit';

import EditorsList from './pages/Editor/List';
import EditorAdd from './pages/Editor/Add';
import EditorEdit from './pages/Editor/Edit';

import GroupsList from './pages/Group/List';
import GroupAdd from './pages/Group/Add';
import GroupEdit from './pages/Group/Edit';

import UsersList from './pages/User/List';
import UserAdd from './pages/User/Add';
import UserEdit from './pages/User/Edit';


import MessagesList from './pages/Message/List';
import MessageAdd from './pages/Message/Add';

import SubscriptionCancel from './pages/Subscription/Cancel';

import ThumballsList from './pages/Thumball/All';
import ThumballAdd from './pages/Thumball/Add';
import ThumballEdit from './pages/Thumball/Edit';

import ThumballAnalyticsIndividual from './pages/Analytics/Individual';
import ThumballAssetLibrary from './pages/Thumball/AssetLibrary';
import ThumballAssign from './pages/Thumball/Assign';
import BuildThumbTrack from './pages/Thumball/BuildThumbTrack';

import NotificationAdd from './pages/Notification/Add';
import ThumballAddSegment from './pages/Notification/AddSegment';


import UpdateCard from './pages/UpdateCard';
import MyAccount from './pages/MyAccount';

import PromosList from './pages/Promo/List';
import PromoAdd from './pages/Promo/Add';
import PromoEdit from './pages/Promo/Edit';


function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <main className="w-full">
          <Switch>
            <Redirect from="/" exact to="/home" />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/password-forgot" component={PasswordForgot} />
            <Route path="/password-reset" component={PasswordReset} />

            <Route path="/home" component={Home} />

            <Route path="/partners/all" component={PartnersList} />
            <Route path="/partners/new" component={PartnerAdd} />
            <Route path="/partners/edit/:id" component={PartnerEdit} />

            <Route path="/customers/all" component={CustomersList} />
            <Route path="/customers/new" component={CustomerAdd} />
            <Route path="/customers/edit/:id" component={CustomerEdit} />

            <Route path="/editors/all" component={EditorsList} />
            <Route path="/editors/new" component={EditorAdd} />
            <Route path="/editors/edit/:id" component={EditorEdit} />

            <Route path="/groups/all" component={GroupsList} />
            <Route path="/groups/new" component={GroupAdd} />
            <Route path="/groups/edit/:id" component={GroupEdit} />

            <Route path="/users/all" component={UsersList} />
            <Route path="/users/new" component={UserAdd} />
            <Route path="/users/edit/:id" component={UserEdit} />


            <Route path="/messages/all" component={MessagesList} />
            <Route path="/messages/new" component={MessageAdd} />

            <Route path="/subscription/cancel" component={SubscriptionCancel} />

            <Route path="/promos/all" component={PromosList} />
            <Route path="/promos/new" component={PromoAdd} />
            <Route path="/promos/edit/:id" component={PromoEdit} />

            <Route path="/thumballs/all" component={ThumballsList} />
            <Route path="/thumballs/new" component={ThumballAdd} />
            <Route path="/thumballs/edit/:id" component={ThumballEdit} />
            
            <Route path="/thumballs/assign" component={ThumballAssign} />
            <Route path="/thumballs/assign/group/:id" component={ThumballAssign} />
            <Route path="/thumballs/build-thumbtrack" component={BuildThumbTrack} />
            <Route path="/thumballs/asset-library" component={ThumballAssetLibrary} />

            <Route path="/notifications/new" component={NotificationAdd} />
            <Route path="/notifications/add-segment" component={ThumballAddSegment} />

            <Route path="/analytics/individual" component={ThumballAnalyticsIndividual} />       

            <Route path="/my-account" component={MyAccount} />

            <Route path="/update-card" component={UpdateCard} />

          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default compose(withFirebase, withAuthentication)(App);
