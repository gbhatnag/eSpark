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

// Models and Forms
function Action(description) {
  this.time = Date();  // now
  this.description = description;
}
const t = TcombForm;
const Form = t.form.Form;
const Methods = t.enums({
  A: 'A: Reflect with own words',
  B: 'B: Reflect with given words',
  C: 'C: No Reflection'
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
      factory: t.form.Radio,
      nullOption: {value: '-', text: 'Select a variant'}
    }
  }
};

// global state
var currentTest = {};
var currentActions = [];

// helper functions
var displayVideoTime = function (seconds) {
  var min = Math.floor(seconds / 60);
  var sec = (seconds % 60).toPrecision(2);
  var spc = '0';
  if (sec >= 10) spc = '';
  return min + ':' + spc + sec;
}

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
    var ref = firebase.database().ref('/tests').push();
    ref.set(value);
    currentTest = {
      key: ref.key,
      values: value,
      actions: []
    }
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
        <h1>Hello, {currentTest.values.studentName}</h1>
        <p>Learn as much as you can from the following video and then answer
          questions afterward.</p>
        <p>You can pause and rewind the video while it's playing. But be careful,
          when the video is over, you cannot watch it again.</p>
        <p className="text-primary">Ready?</p>
        <p>
          <Link to="/test/play" className="btn btn-primary btn-lg">Watch Video</Link>
        </p>
      </div>
    );
  }
});

var Play = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div className="embed-responsive embed-responsive-16by9">
        <iframe id="vid" className="embed-responsive-item"
          src="https://www.youtube.com/embed/mRdMYuNeAng?enablejsapi=1&amp;rel=0&amp;showinfo=0&amp;autoplay=1"
          frameBorder="0" allowFullScreen
        ></iframe>

        <div id="qmodal" className="modal" data-backdrop="static">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  },

  componentDidMount: function () {
    var self = this;
    var onPlayerReady = function (event) {
      console.log('video player loaded at', Date());
      currentTest.actions.push(new Action('video player loaded'));
    };
    var onPlayerStateChange = function (event) {
      var playerStatus = event.data;
      if (playerStatus == -1) {
        console.log('unstarted');
      } else if (playerStatus == 0) {
        console.log('ended at', displayVideoTime(player.getCurrentTime()));
        currentTest.actions.push(new Action('video ended at ' + displayVideoTime(player.getCurrentTime())));
        if (currentTest.testMethod == 'A') {
          self.context.router.push('/test/play/reviewA');
        } else if (currentTest.testMethod == 'B') {
          self.context.router.push('/test/play/reviewB');
        } else {  // variant C skips reflection
          self.context.router.push('/test/play/quiz');
        }
      } else if (playerStatus == 1) {
        console.log('playing at', displayVideoTime(player.getCurrentTime()));
        currentTest.actions.push(new Action('video playing at ' + displayVideoTime(player.getCurrentTime())));
      } else if (playerStatus == 2) {
        console.log('paused at', displayVideoTime(player.getCurrentTime()));
        currentTest.actions.push(new Action('video paused at ' + displayVideoTime(player.getCurrentTime())));
      } else if (playerStatus == 3) {
        console.log('buffering at', displayVideoTime(player.getCurrentTime()));
        currentTest.actions.push(new Action('video buffering at ' + displayVideoTime(player.getCurrentTime())));
      } else if (playerStatus == 5) {
        console.log('cued at', displayVideoTime(player.getCurrentTime()));
        currentTest.actions.push(new Action('video cued at ' + displayVideoTime(player.getCurrentTime())));
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

var ReviewA = React.createClass({
  render: function () {
    return (
      <div>
        <p>Review the video; UI A</p>
        <Link to="/test/play/quiz" className="btn btn-primary btn-lg">Quiz</Link>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var ReviewB = React.createClass({
  render: function () {
    return (
      <div>
        <p>Review the video; UI B</p>
        <Link to="/test/play/quiz" className="btn btn-primary btn-lg">Quiz</Link>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Quiz = React.createClass({
  render: function () {
    return (
      <div>
        <p>Present quiz questions; independent of testing method. Need to cycle through different quiz questions.</p>
        <Link to="/test/play/done" className="btn btn-primary btn-lg">Done</Link>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Done = React.createClass({
  closeModal: function () {
    firebase.database().ref('/tests/' + currentTest.key).update({actions: currentTest.actions});
    $("#qmodal").modal('hide');
  },

  render: function () {
    return (
      <div>
        <p>Present a done message for hand-back to tester.</p>
        <Link to="/" className="btn btn-primary btn-lg" onClick={this.closeModal}>Ok</Link>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
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
      <Route path="/test/play" component={Play}>
        <Route path="/test/play/reviewA" component={ReviewA} />
        <Route path="/test/play/reviewB" component={ReviewB} />
        <Route path="/test/play/quiz" component={Quiz} />
        <Route path="/test/play/done" component={Done} />
      </Route>
      <Route path="/data" component={Data} />
    </Route>
  </Router>
), document.getElementById('root'));
