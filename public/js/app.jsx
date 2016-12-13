// Routing and app
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = ReactRouter.Link;
var browserHistory = ReactRouter.browserHistory;

// connect to firebase
var firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC1GIOZUV0QF5MgIL_XvqWeMWYp5dFI1Io",
  authDomain: "espark-50d82.firebaseapp.com",
  databaseURL: "https://espark-50d82.firebaseio.com",
  storageBucket: "espark-50d82.appspot.com",
  messagingSenderId: "92877010944"
});

// 'Models' and Forms
const t = TcombForm;
const Form = t.form.Form;
const Methods = t.enums({
  A: 'A: Reflect with own words',
  B: 'B: Reflect with given words',
  C: 'C: No Reflection',
  R: 'Random choice between A, B, C'
});
const TestSchema = t.struct({
  studentName: t.String,
  testMethod: Methods
  /* the following are calculated properties of Test objects
  starttime  // t.Date
  endtime    // t.Date
  actions    // t.list(ActionSchema)
  score      // t.Number
  */
});
const formOptions = {
  fields: {
    testMethod: {
      nullOption: {value: '-', text: 'Select a variant'}
    }
  }
};

// global state
var currentTest = null;

// components
var App = React.createClass({
  render: function () {
    return (
      <div>
        <main className="container-fluid">
          <p><Link to="/" className="btn btn-link">Home</Link></p>
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
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  saveTest: function (ev) {
    ev.preventDefault();
    const value = this.refs.setupTestForm.getValue();
    if (!value) return;  // error
    currentTest = value;
    var ref = firebase.database().ref('/tests').push();
    ref.set(currentTest);
    this.context.router.push('/test/ready');
  },

  render: function () {
    return (
      <div className="jumbotron">
        <h1>Setup Test</h1>
        <p>Complete this form and then pass the tablet to the student.</p>
        <form onSubmit={this.saveTest}>
          <Form ref="setupTestForm" type={TestSchema} options={formOptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Begin Test</button>
          </p>
        </form>
      </div>
    );
  }
});

var Ready = React.createClass({
  render: function () {
    return (
      <div className="jumbotron">
        <h1>Hello, {currentTest.studentName}</h1>
        <p>Ready?</p>
        <p>
          <Link to="/test/play" className="btn btn-primary btn-lg">Watch Video</Link>
        </p>
      </div>
    );
  }
});

var Play = React.createClass({
  render: function () {
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <iframe id="vid" className="embed-responsive-item"
          src="https://www.youtube.com/embed/mRdMYuNeAng?enablejsapi=1&amp;rel=0&amp;showinfo=0&amp;autoplay=1"
          frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  },

  componentDidMount: function () {
    var onPlayerReady = function (event) {
      console.log('player ready');
    };
    var onPlayerStateChange = function (event) {
      var playerStatus = event.data;
      if (playerStatus == -1) {
        console.log('unstarted');
      } else if (playerStatus == 0) {
        console.log('ended at', player.getCurrentTime());
      } else if (playerStatus == 1) {
        console.log('playing at', player.getCurrentTime());
      } else if (playerStatus == 2) {
        console.log('paused at', player.getCurrentTime());
      } else if (playerStatus == 3) {
        console.log('buffering at', player.getCurrentTime());
      } else if (playerStatus == 5) {
        console.log('cued at', player.getCurrentTime());
      }
    }
    var player = new YT.Player('vid', {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
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
