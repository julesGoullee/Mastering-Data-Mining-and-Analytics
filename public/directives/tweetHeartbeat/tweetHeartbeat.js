angularApp.directive('tweetHeartbeat', function(){
    return{
        restrict: "E",
        scope:{
            tweetCount: "="
        },
        templateUrl:"directives/tweetHeartbeat/tweetHeartbeat.html",
        link: function( scope, element ) {


            var lastValue;
            var lastEcart;
            var n = 120;
            scope.tps = 0;
            var random = d3.random.normal(0, .2);
                var data = function(){
                    var t = [];
                    for ( var i = 0; i < n; i ++){
                        t.push(0);
                    }
                    return t;
                }();
            var margin = {top: 10, right: 20, bottom: 10, left: 40},
                width = 300 - margin.left - margin.right;
            var  height = $("#topBar").height() - margin.bottom - margin.left;
            //var height = element.parent().height() - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .domain([0, n - 1])
                .range([0, width]);

            var y = d3.scale.linear()
                .domain([-3, 3])
                .range([height, 0]);

            var line = d3.svg.line()
                .x(function(d, i) { return x(i); })
                .y(function(d, i) { return y(d); });

            var svg = d3.select(element.find("#graphTps")[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            //svg.append("g")
            //    .attr("class", "x axis")
            //    .attr("transform", "translate(0," + y(0) + ")")
            //    .call(d3.svg.axis().scale(x).orient("bottom"));
            //
            //svg.append("g")
            //    .attr("class", "y axis")
            //    .call(d3.svg.axis().scale(y).orient("left"));

            var path = svg.append("g")
                .attr("clip-path", "url(#clip)")
                .append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

            tick();

            function tick() {

                // push a new data point onto the back
                console.log(lastValue, scope.tweetCount.value);
                if( scope.tweetCount.value !==0 ){
                    if( !lastValue){
                        lastValue = scope.tweetCount.value;
                    }

                    var newValue = scope.tweetCount.value - lastValue;

                    if( !lastEcart){
                        lastEcart = newValue;
                    }
                    var newEcart = newValue - lastEcart;
                    lastValue = scope.tweetCount.value;
                }
                else{
                    var newEcart = 0;
                }
                scope.tps = newEcart;
                data.push(newEcart);

                // redraw the line, and slide it to the left
                path
                    .attr("d", line)
                    .attr("transform", null)
                    .transition()
                    .duration(1000)
                    .ease("linear")
                    .attr("transform", "translate(" + x(-1) + ",0)")
                    .each("end", tick);

                // pop the old data point off the front
                data.shift();

            }
        }
    }
});