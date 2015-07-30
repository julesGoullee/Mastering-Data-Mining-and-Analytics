"use strict";

angularApp.controller("FeedbackCtrl", function( ga ){
    ga('send', 'event', 'feedback', 'showForm');
});
