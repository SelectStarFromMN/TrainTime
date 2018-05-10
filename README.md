# TrainTime

A simple site for tracking and administering train schedules.  It features real-time cloud storage in Google's Firebase database via the JavaScript API.  Arbitrary train schedules can be added with a simple data entry form. (TODO: more validation of the form data would be a nice enhancement)  

The moment.js library is used to handle datetime math.  The Arrival display board refreshes itself automatically, and sports a convenient clock element.  Styling is minimal, yet the theme is simple, responsive, attractive and includes a favicon.

Individual trains can be fully edited by clicking and using the context-appropriate form buttons.  They can also be deleted using the admin form as well.  Of course, edits and deletes flow to the database.

Live at: https://selectstarfrommn.github.io/TrainTime/