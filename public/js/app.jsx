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

// Models, Forms, Questions
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
const TestFormOptions = {
  fields: {
    testMethod: {
      factory: t.form.Radio,
      nullOption: {value: '-', text: 'Select a variant'}
    }
  }
};
const ReviewBSchema = t.struct({
  definingPrefixes: t.Boolean,
  musicRemixes: t.Boolean,
  listingCommonPrefixes: t.Boolean,
  greekAndLatin: t.Boolean
});
const Q1choices = t.enums({
  A: 'A: the front of a word',
  B: 'B: the end of a word',
  C: 'C: the middle of a word'
});
const Q1form = t.struct({
  response: Q1choices
});
const Q2choices = t.enums({
  A: 'A: again',
  B: 'B: before',
  C: 'C: not'
});
const Q2form = t.struct({
  response: Q2choices
});
const Q3choices = t.enums({
  A: 'A: inliterate',
  B: 'B: illiterate',
  C: 'C: unliterate'
});
const Q3form = t.struct({
  response: Q3choices
});
const Q4choices = t.enums({
  A: 'A: in-',
  B: 'B: anti-',
  C: 'C: dis-'
});
const Q4form = t.struct({
  response: Q4choices
});
const Q5choices = t.enums({
  A: 'A: irrational',
  B: 'B: antisocial',
  C: 'C: devalued'
});
const Q5form = t.struct({
  response: Q5choices
});
const Q6choices = t.enums({
  A: 'A: between',
  B: 'B: against',
  C: 'C: large'
});
const Q6form = t.struct({
  response: Q6choices
});
const Q7choices = t.enums({
  A: 'A: English or French',
  B: 'B: Greek or Latin',
  C: 'C: India or Africa'
});
const Q7form = t.struct({
  response: Q7choices
});
const Qoptions = {
  fields: {
    response: {
      factory: t.form.Radio,
      auto: 'none'
    }
  }
}

// global state
var currentTest = {};

// helper functions
var displayVideoTime = function (seconds) {
  var min = Math.floor(seconds / 60);
  var sec = (seconds % 60).toPrecision(2);
  var spc = '0';
  if (sec >= 10) spc = '';
  return min + ':' + spc + sec;
};

// adds an action to the currentTest
var addAction = function (desc) {
  currentTest.actions.push(new Action(desc));
};

// persists data to firebase backend
var updateCurrentTest = function (key, value) {
  var save = {};
  save[key] = value;
  firebase.database().ref('/tests/' + currentTest.key).update(save);
};

// calculate score for current test and responses
const ANSWER_KEY = {
  q1: "A", q2: "C", q3: "B", q4: "A", q5: "C", q6: "A", q7: "B"
};
var calculateScore = function () {
  var correct = 0;
  for (var i = 1; i < 8; i++) {
    var q = 'q' + i;
    if (ANSWER_KEY[q] == currentTest.responses[q].response) {
      correct++;
    }
  }
  return 100 * correct / 7;
};
var displayScore = function (score) {
  return score.toFixed(0) + "%";
};

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
    currentTest = Object.assign({}, value);
    currentTest.key = ref.key;
    currentTest.actions = [];
    currentTest.responses = {};
    currentTest.score = 0;
    this.context.router.push('/test/ready');
  },

  render: function () {
    return (
      <div className="jumbotron">
        <h1>Setup Test</h1>
        <p>Complete this form and then pass the tablet to the student.</p>
        <form onSubmit={this.saveTest}>
          <Form ref="setupTestForm" type={TestSchema} options={TestFormOptions} />
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
      addAction('video player loaded');
    };
    var onPlayerStateChange = function (event) {
      var playerStatus = event.data;
      if (playerStatus == -1) {
        console.log('unstarted');
      } else if (playerStatus == 0) {
        console.log('ended at', displayVideoTime(player.getCurrentTime()));
        addAction('video ended at ' + displayVideoTime(player.getCurrentTime()));
        if (currentTest.testMethod == 'A') {
          self.context.router.push('/test/play/reviewA');
        } else if (currentTest.testMethod == 'B') {
          self.context.router.push('/test/play/reviewB');
        } else {  // variant C skips reflection
          self.context.router.push('/test/play/q1');
        }
      } else if (playerStatus == 1) {
        console.log('playing at', displayVideoTime(player.getCurrentTime()));
        addAction('video playing at ' + displayVideoTime(player.getCurrentTime()));
      } else if (playerStatus == 2) {
        console.log('paused at', displayVideoTime(player.getCurrentTime()));
        addAction('video paused at ' + displayVideoTime(player.getCurrentTime()));
      } else if (playerStatus == 3) {
        console.log('buffering at', displayVideoTime(player.getCurrentTime()));
        addAction('video buffering at ' + displayVideoTime(player.getCurrentTime()));
      } else if (playerStatus == 5) {
        console.log('cued at', displayVideoTime(player.getCurrentTime()));
        addAction('video cued at ' + displayVideoTime(player.getCurrentTime()));
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
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  saveReflection: function (ev) {
    ev.preventDefault();
    var $ref = $("#reflection");
    var val = $ref.val().trim();
    if (!val) {
      $ref.parent().addClass('has-error');
      return;
    }
    $ref.parent().removeClass('has-error');
    updateCurrentTest('reflection', val);
    addAction('added freeform reflection');
    this.context.router.push('/test/play/q1');
  },

  render: function () {
    return (
      <div>
        <p>In your own words, describe what the video was about:</p>
        <form onSubmit={this.saveReflection}>
          <p><textarea id="reflection" className="form-control" rows="3" placeholder="Type here"></textarea></p>
          <button type="submit" className="btn btn-primary btn-lg">Next</button>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var ReviewB = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  saveReflection: function (ev) {
    ev.preventDefault();
    updateCurrentTest('reflection', this.refs.reviewBForm.getValue());
    addAction('added reflection topics');
    this.context.router.push('/test/play/q1');
  },

  render: function () {
    return (
      <div>
        <p>What was the video about? Select all that apply:</p>
        <form onSubmit={this.saveReflection}>
          <Form ref="reviewBForm" type={ReviewBSchema} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q1 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q1Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q1'] = val;
    addAction('responded to question 1');
    this.context.router.push('/test/play/q2');
  },

  render: function () {
    return (
      <div>
        <p>Question 1 of 7</p>
        <p>A prefix is found at:</p>
        <form onSubmit={this.save}>
          <Form ref="q1Form" type={Q1form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q2 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q2Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q2'] = val;
    addAction('responded to question 2');
    this.context.router.push('/test/play/q3');
  },

  render: function () {
    return (
      <div>
        <p>Question 2 of 7</p>
        <p>When you see non- or un- at the front of a word, that means:</p>
        <form onSubmit={this.save}>
          <Form ref="q2Form" type={Q2form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q3 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q3Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q3'] = val;
    addAction('responded to question 3');
    this.context.router.push('/test/play/q4');
  },

  render: function () {
    return (
      <div>
        <p>Question 3 of 7</p>
        <p>If you can’t read, then you’re:</p>
        <form onSubmit={this.save}>
          <Form ref="q3Form" type={Q3form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q4 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q4Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q4'] = val;
    addAction('responded to question 4');
    this.context.router.push('/test/play/q5');
  },

  render: function () {
    return (
      <div>
        <p>Question 4 of 7</p>
        <p>To use one word that describes someone as not active, you would use
          the following prefix:</p>
        <form onSubmit={this.save}>
          <Form ref="q4Form" type={Q4form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q5 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q5Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q5'] = val;
    addAction('responded to question 5');
    this.context.router.push('/test/play/q6');
  },

  render: function () {
    return (
      <div>
        <p>Question 5 of 7</p>
        <p>If you disagree, well hey, that’s cool, but your whole style gets:</p>
        <form onSubmit={this.save}>
          <Form ref="q5Form" type={Q5form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q6 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q6Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q6'] = val;
    addAction('responded to question 6');
    this.context.router.push('/test/play/q7');
  },

  render: function () {
    return (
      <div>
        <p>Question 6 of 7</p>
        <p>The prefix, inter-, means:</p>
        <form onSubmit={this.save}>
          <Form ref="q6Form" type={Q6form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Q7 = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  save: function (ev) {
    ev.preventDefault();
    const val = this.refs.q7Form.getValue();
    if (!val) return;  // error
    currentTest.responses['q7'] = val;
    addAction('responded to question 7');
    this.context.router.push('/test/play/done');
  },

  render: function () {
    return (
      <div>
        <p>Question 7 of 7</p>
        <p>Most prefixes come from:</p>
        <form onSubmit={this.save}>
          <Form ref="q7Form" type={Q7form} options={Qoptions} />
          <p>
            <button type="submit" className="btn btn-primary btn-lg">Next</button>
          </p>
        </form>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Done = React.createClass({
  closeModal: function () {
    addAction('completed test');
    updateCurrentTest('actions', currentTest.actions);
    updateCurrentTest('responses', currentTest.responses);
    updateCurrentTest('score', calculateScore());
    $("#qmodal").modal('hide');
  },

  render: function () {
    return (
      <div>
        <p>Congrats! You're all done!</p>
        <p>Pass the tablet back to the teacher.</p>
        <Link to="/" className="btn btn-primary btn-lg" onClick={this.closeModal}>Sweet</Link>
      </div>
    );
  },

  componentDidMount: function () {
    $("#qmodal").modal('show');
  }
});

var Data = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function () {
    return {
      tests: []
    }
  },

  componentWillMount: function () {
    var ref = firebase.database().ref("/tests");
    this.bindAsArray(ref, "tests");
  },

  renderTestRow: function (test, i) {
    console.log(i,test);
    var start = moment(test.actions[0].time);
    var end   = moment(test.actions[test.actions.length - 1].time);
    var diff  = end.diff(start);
    var displaytimestamp = 'MMM Do YYYY, h:mm:ss a';
    var displayduration = 'm [min] ss [sec]';
    return (
      <tr key={'testrow-'+i}>
        <td>{i+1}</td>
        <td>{test.studentName}</td>
        <td>{test.testMethod}</td>
        <td>{displayScore(test.score)}</td>
        <td>{start.format(displaytimestamp)}</td>
        <td>{moment(diff).format(displayduration)}</td>
        <td><Link to={"/data/actions/"+test['.key']}>View</Link></td>
          {/*
        */}
      </tr>
    );
  },

  render: function () {
    var A = {
      score: 0,
      count: 0,
      total: 0,
      display: 'calculating',
      progbar: {width:'0%'}
    };
    var B = {
      score: 0,
      count: 0,
      total: 0,
      display: 'calculating',
      progbar: {width:'0%'}
    };
    var C = {
      score: 0,
      count: 0,
      total: 0,
      display: 'calculating',
      progbar: {width:'0%'}
    };
    if (this.state.tests.length != 0) {
      this.state.tests.forEach(function (test) {
        if (test.testMethod == 'A') {
          A.count++;
          A.total += test.score;
        } else if (test.testMethod == 'B') {
          B.count++;
          B.total += test.score;
        } else {
          C.count++;
          C.total += test.score;
        }
      });
      A.score = A.total / A.count;
      B.score = B.total / B.count;
      C.score = C.total / C.count;
    }
    A.display = displayScore(A.score);
    B.display = displayScore(B.score);
    C.display = displayScore(C.score);
    A.progbar = {'width': A.display};
    B.progbar = {'width': B.display};
    C.progbar = {'width': C.display};
    return (
      <div className="jumbotron">
        <h1>Variant and Test Data</h1>
        <p><span className="badge">{A.count}</span> Variant A: Reflect in your own words. Overall score: {A.display}</p>
        <div className="progress">
          <div className="progress-bar" style={A.progbar}></div>
        </div>
        <p><span className="badge">{B.count}</span> Variant B: Reflect using given words. Overall score: {B.display}</p>
        <div className="progress">
          <div className="progress-bar" style={B.progbar}></div>
        </div>
        <p><span className="badge">{C.count}</span> Variant C: (Control) No reflection. Overall score: {C.display}</p>
        <div className="progress">
          <div className="progress-bar" style={C.progbar}></div>
        </div>

        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Variant</th>
              <th>Score</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Test Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tests.map(this.renderTestRow)}
          </tbody>
        </table>

        <div id="actions-modal" className="modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
});

var Actions = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  mixins: [ReactFireMixin],

  getInitialState: function () {
    return {
      test: {},
      display: 'MMM Do YYYY, h:mm:ss a'
    }
  },

  componentWillMount: function () {
    var self = this;
    var ref = firebase.database().ref("/tests/" + this.props.params.testKey);
    self.bindAsObject(ref, "test");
  },

  renderActionRow: function (action, i) {
    var self = this;
    var time = moment(action.time);
    return (
      <tr key={'actionrow-'+i}>
        <td>{i+1}</td>
        <td>{action.description}</td>
        <td>{time.format(self.state.display)}</td>
      </tr>
    );
  },

  render: function () {
    return (
      <div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {this.state.test.actions.map(this.renderActionRow)}
          </tbody>
        </table>
      </div>
    );
  },

  componentDidMount: function () {
    var self = this;
    $("#actions-modal").modal('show');
    $("#actions-modal").on('hidden.bs.modal', function (ev) {
      self.context.router.push('/data');
    });
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
        <Route path="/test/play/q1" component={Q1} />
        <Route path="/test/play/q2" component={Q2} />
        <Route path="/test/play/q3" component={Q3} />
        <Route path="/test/play/q4" component={Q4} />
        <Route path="/test/play/q5" component={Q5} />
        <Route path="/test/play/q6" component={Q6} />
        <Route path="/test/play/q7" component={Q7} />
        <Route path="/test/play/done" component={Done} />
      </Route>
      <Route path="/data" component={Data}>
        <Route path="/data/actions/:testKey" component={Actions} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'));
