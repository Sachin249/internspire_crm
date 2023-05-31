var express = require('express')
var path =  require('path')
require('dotenv').config();
var mongoose = require('mongoose');
global.config = require('./config/jwtconfig');

mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {useNewUrlParser:true,useUnifiedTopology: true});
const con= mongoose.connection;
con.on('open', ()=> {
  console.log('Database Connected');
});

var app = express()
PORT = process.env.PORT || 9000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));   // to get body in function
app.use(express.static(path.join(__dirname, 'public')));


// app.all('*',function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Request-Headers', '*');
  next();
});

app.use('/api/auth', require('./controllers/authcontroller'));
app.use('/api/admin/lead', require('./controllers/admin/leadcontroller'));
app.use('/api/admin/employee', require('./controllers/admin/employeecontroller'));
app.use('/api/user/attendence', require('./controllers/user/attendencecontroller'));
app.use('/api/admin/task', require('./controllers/admin/taskcontroller'));

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error');
});

app.listen(PORT,(req,res)=>{
    console.log(`app is listening on ${PORT}`)
})
