import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { auth, createUserProfileDocument } from './firebase/firebase-utils';
import { setCurrentUser } from './redux/user/user-actions';
import { selectCurrentUser } from './redux/user/user-selectors';

import './App.css';

import Header from './components/header/header';
import SignInPage from './pages/sign-in-page/sign-in-page';
import HomePage from './pages/homepage/homepage';
import SettingsPage from './pages/settingspage/settingspage';
import SearchPage from './pages/searchpage/searchpage';
import FeaturedPage from './pages/featuredpage/featuredpage';
import NotesPage from './pages/notespage/notespage';
import MyBoardPage from './pages/myboardpage/myboardpage';
import FollowingPage from './pages/followingpage/followingpage';
import FollowersPage from './pages/followerspage/followerspage';



class App extends Component {

  unsubscribeFromAuth = null;

  componentDidMount() {

    const {setCurrentUser} = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        console.log(userAuth.uid);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
              id:snapShot.id,
              ...snapShot.data()
          });
        });
      } else {
        setCurrentUser(userAuth);
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

    render() {
        return (
            <div>
              <Header />
              <Switch>
                <Route exact path='/' render={() => this.props.currentUser ? (<HomePage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/signin' render={() => this.props.currentUser ? (<Redirect to='/' />) : (<SignInPage />)} />
                <Route exact path='/settings' render={() => this.props.currentUser ? (<SettingsPage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/search' render={() => this.props.currentUser ? (<SearchPage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/featured' render={() => this.props.currentUser ? (<FeaturedPage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/following' render={() => this.props.currentUser ? (<FollowingPage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/followers' render={() => this.props.currentUser ? (<FollowersPage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/myboard' render={() => this.props.currentUser ? (<MyBoardPage />) : (<Redirect to='/signin' />)} />
                <Route exact path='/notes' render={() => this.props.currentUser ? (<NotesPage />) : (<Redirect to='/signin' />)} />

              </Switch>
           </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

