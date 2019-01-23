var mongoose = require('mongoose');
//CONNECT TO DATABASE
var db_connect = () => {
  // mongodb://<dbuser>:<dbpassword>@ds039950.mlab.com:39950/recipefinder
<<<<<<< HEAD
	//
mongoose.connect("mongodb://development:devteam123@ds039950.mlab.com:39950/recipefinder", { useNewUrlParser: true });
=======
>>>>>>> ee690ec2c07498341017e0bf8c1ffc5d80bd7435
var db = mongoose.connection;
db.once("open",function() {
	console.log("DB connected!");
});
db.on("error", function (err) {
	console.log("DB error :", err);
});
};
module.exports = db_connect;
