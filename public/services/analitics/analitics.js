"use strict";

angularApp.service("ga",function(){
    return  window.ga || function(){};
});