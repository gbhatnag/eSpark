// Routing and app
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

var app = firebase.initializeApp({
  apiKey: "AIzaSyC1GIOZUV0QF5MgIL_XvqWeMWYp5dFI1Io",
  authDomain: "espark-50d82.firebaseapp.com",
  databaseURL: "https://espark-50d82.firebaseio.com",
  storageBucket: "espark-50d82.appspot.com",
  messagingSenderId: "92877010944"
});

var App = React.createClass({
  render: function () {
    return (
      <div>
        <main className="container-fluid">
          <p>
            <Link to="/" className="btn btn-link">Home</Link>
          </p>
          {this.props.children}
        </main>
      </div>
    );
  }
});

var Home = React.createClass({
  render: function () {
    return (
      <div className="btn-group btn-group-justified">
        <Link to="/test" className="btn btn-lg btn-primary">Start Test</Link>
        <Link to="/data" className="btn btn-lg btn-warning">Review Data</Link>
      </div>
    );
  }
});

var Test = React.createClass({
  render: function () {
    return (
      <div>
        <p>Setup the test with this form</p>
        <Link to="/test/ready" className="btn btn-primary btn-lg">Ready</Link>
      </div>
    );
  }
});

var Ready = React.createClass({
  render: function () {
    return (
      <div>
        <p>Present a ready dialog to user (where will the state come from?)</p>
        <Link to="/test/play" className="btn btn-primary btn-lg">Play</Link>
      </div>
    );
  }
});

var Play = React.createClass({
  render: function () {
    return (
      <div>
        <p>Play the video; next step depends on method a/b/c</p>
        <Link to="/test/review" className="btn btn-primary btn-lg">Review</Link>
      </div>
    );
  }
});

var Review = React.createClass({
  render: function () {
    return (
      <div>
        <p>Review the video; UI depends on method a/b/c</p>
        <Link to="/test/quiz" className="btn btn-primary btn-lg">Quiz</Link>
      </div>
    );
  }
});

var Quiz = React.createClass({
  render: function () {
    return (
      <div>
        <p>Present quiz questions; independent of testing method. Need to cycle through different quiz questions.</p>
        <Link to="/test/done" className="btn btn-primary btn-lg">Done</Link>
      </div>
    );
  }
});

var Done = React.createClass({
  render: function () {
    return (
      <div>
        <p>Present a done message for hand-back to tester.</p>
        <Link to="/" className="btn btn-primary btn-lg">Ok</Link>
      </div>
    );
  }
});

var Data = React.createClass({
  render: function () {
    return (
      <div>
        <p>Show some data here.</p>
        <Link to="/" className="btn btn-primary btn-lg">Go back home</Link>
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={App}>
      <Route path="/" component={Home} />
      <Route path="/test" component={Test} />
      <Route path="/test/ready" component={Ready} />
      <Route path="/test/play" component={Play} />
      <Route path="/test/review" component={Review} />
      <Route path="/test/quiz" component={Quiz} />
      <Route path="/test/done" component={Done} />
      <Route path="/data" component={Data} />
    </Route>
  </Router>
), document.getElementById('root'));
