
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

// Update schedule and clock every 15 seconds
var clockTimer = setInterval(refreshTable, 15000);

// DB Pkey of clicked row
var clickedRowPkey = '';


// Whenever a user clicks the submit Add/Update Train button
$("#submit-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    var trainName = $("#input-name").val().trim();
    var trainDest = $("#input-dest").val().trim();
    var trainStart = $("#input-start").val().trim();
    var trainFreq = $("#input-freq").val().trim();
    var trainStartMoment = parseInt(moment(trainStart, "HH:mm").format("x"));

    // Save the new Train info in Firebase
    // Note how we are using the Firebase .push() method for New and .update() for Existing record
    if (clickedRowPkey && trainName && trainDest && trainStart && trainFreq) {
        database.ref().child(clickedRowPkey).update({
            trainName: trainName,
            trainDest: trainDest,
            trainStart: trainStartMoment,
            trainFreq: trainFreq
        });
    } else if (trainName && trainDest && trainStart && trainFreq) {
        database.ref().push({
            trainName: trainName,
            trainDest: trainDest,
            trainStart: trainStartMoment,
            trainFreq: trainFreq
        })
    }

    // Clear the form and setup for Add
    configureForm('Add', '');

    // Refresh table (avoid Firebase event delay)
    refreshTable();
})

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This event function allows you to update your page in real-time when the firebase database changes.
database.ref().on("child_added", function (snapshot) {
    displayTrain(snapshot);
})

// Format current moment and update #station-clock
function refreshClock() {
    $("#station-clock").text(moment().format("hh:mm a"))
}

// Take the snapshot train record and append a table-row using record attributes and computed values for table-data cells
function displayTrain(snapshot) {
    var trainRec = snapshot.val();
    var trainStart = moment(trainRec.trainStart).format("HH:mm");

    /////////////////////////////////////////
    // Computations from in-class exercise
    var tFrequency = trainRec.trainFreq;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    // console.log("MOD%Remainder: " + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    /////////////////////////////////////////

    // Append table-row using record attributes and computed values for table-data cells
    // Table Columns: <id=pkey hidden>, Name, Dest, Freq, NextArrival(computed), MinutesAway(computed)
    $("#train-table-body").append(`<tr id="${snapshot.key}" class="schedule-row"><td style="display:none;">${moment(trainRec.trainStart).format('HH:mm')}</td><td>${trainRec.trainName}</td><td>${trainRec.trainDest}</td><td>${trainRec.trainFreq}</td><td style="color:blue">${moment(nextTrain).format("hh:mm")}</td><td>${tMinutesTillTrain}</td></tr>`)
}

// Refresh the train table (avoid realtime event lag)
function refreshTable() {
    // Refresh the clock
    refreshClock();

    // Clear the table
    $("#train-table-body").empty();

    // Query dbref (order by pkey, no limit) and display each train
    database.ref().orderByKey().on("child_added", function (snapshot) {
        displayTrain(snapshot);
    })
}



// Click event listener for schedule row
$(document.body).on("click", ".schedule-row", function () {
    // console.log(this);
    // $("#-LAjVtE7B8Aa4sJlb8Oj td:nth-child(1)").text()
    // this.closest("tr");//data("train-start")    

    // Populate variables from table row parsing
    var dbKey = this.id;
    var startTimeStr = $(`#${dbKey} td:nth-child(1)`).text();
    var trainName = $(`#${dbKey} td:nth-child(2)`).text();
    var trainDest = $(`#${dbKey} td:nth-child(3)`).text();
    var trainFreq = $(`#${dbKey} td:nth-child(4)`).text();

    // Populate text boxes
    $("#input-name").val(trainName);
    $("#input-dest").val(trainDest);
    $("#input-start").val(startTimeStr);
    $("#input-freq").val(trainFreq);

    // Clear the form and setup for Update
    configureForm('Update', dbKey);

})


// Whenever a user clicks the Delete Train button
$("#delete-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Confirm we have a clicked PKey
    if (clickedRowPkey) {
        database.ref().child(clickedRowPkey).remove();
    }

    // Clear the form and setup for Add
    configureForm('Add', '');

    // Refresh table (avoid Firebase event delay)
    refreshTable();
})


// Whenever a user clicks the Clear Train button
$("#clear-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Clear the form and setup for Add
    configureForm('Add', '');
})

// Configure Form input/buttons for given state (ex: Add, Update). Note Update === Delete
function configureForm (state, clickedRow) {

    // Update global handle on clicked row
    clickedRowPkey = clickedRow;

    // Context name the Submit button
    $("#submit-train-btn").text(state);

    if (state == 'Add') {

        // Clear text boxes
        $("#input-name").val("");
        $("#input-dest").val("");
        $("#input-start").val("");
        $("#input-freq").val("");
        $("#input-name").focus();


        // Hide the Delete & Clear buttons
        $("#delete-train-btn").hide();
        $("#clear-train-btn").hide();

    }
    else if (state = 'Update') {
        // Leave input text boxes as they are populated
        // Enable Delete (guarded) & Clear Buttons
        if (clickedRowPkey) 
            $("#delete-train-btn").show();
        $("#clear-train-btn").show();
        
    }

}