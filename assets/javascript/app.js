
// Initialize Firebase
var config = {
    apiKey: "AIzaSyA5jms_vylppAN-qNb8ZyUriORyr5vbXsE",
    authDomain: "trainschedules-c5ea1.firebaseapp.com",
    databaseURL: "https://trainschedules-c5ea1.firebaseio.com",
    projectId: "trainschedules-c5ea1",
    storageBucket: "",
    messagingSenderId: "671224271187"
};
firebase.initializeApp(config);


// Get a reference to the database service
var database = firebase.database();


// Whenever a user clicks the submit Add Train button
$("#submit-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    var trainName = $("#input-name").val().trim();
    var trainDest = $("#input-dest").val().trim();
    var trainStart = $("#input-start").val().trim();
    var trainFreq = $("#input-freq").val().trim();
    var trainStartMoment = parseInt(moment(trainStart, "HH:mm").format("x"));

    console.log("trainStart: " + trainStart + " Moment: " + trainStartMoment);

    // Save the new Train info in Firebase
    // Note how we are using the Firebase .push() method
    database.ref().push({
        trainName: trainName,
        trainDest: trainDest,
        trainStart: trainStartMoment,
        trainFreq: trainFreq
    });

    // Clear text boxes
    $("#input-name").val("");
    $("#input-dest").val("");
    $("#input-start").val("");
    $("#input-freq").val("");
    $("#input-name").focus();
})

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("child_added", function (snapshot) {
    var trainRec = snapshot.val();
    var trainStart = moment(trainRec.trainStart).format("HH:mm");
    var empMonths = moment().diff(trainRec.trainStart, 'months');

    // Table Columns: <id=pkey hidden>, Name, Dest, Freq, NextArrival(computed), MinutesAway(computed)
    $("#emp-table-body").append(`<tr id="${snapshot.key}"><td>${trainRec.trainName}</td><td>${trainRec.trainDest}</td><td>${trainRec.trainFreq}</td><td>${'ASAP'}</td><td>${'Computing...'}</td></tr>`)
})

// database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
//     // Change the HTML to reflect
//     $("#name-display").text(snapshot.val().name);
//     $("#email-display").text(snapshot.val().email);
//     $("#age-display").text(snapshot.val().age);
//     $("#comment-display").text(snapshot.val().comment);
//   });