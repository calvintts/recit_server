var mongoose = require('mongoose');
//CONNECT TO DATABASE
var db_connect = () => {
  // mongodb://<dbuser>:<dbpassword>@ds039950.mlab.com:39950/recipefinder
	//
mongoose.connect("mongodb://development:devteam123@ds039950.mlab.com:39950/recipefinder", { useNewUrlParser: true });
var db = mongoose.connection;
db.once("open",function() {
	console.log("DB connected!");
});
db.on("error", function (err) {
	console.log("DB error :", err);
});
};
module.exports = db_connect;
