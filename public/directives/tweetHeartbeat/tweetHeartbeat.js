angularApp.directive('tweetHeartbeat', function(){
    return{
        restrict: "E",
        scope:{
            tweetCount: "="
        },
        templateUrl:"directives/tweetHeartbeat/tweetHeartbeat.html",
        link: function( scope, element ) {

            var lastValue;
            var lastHeartBeat;
            var newVariation;
            var newHeartBeat;


            scope.tps = 0;
            var n = 120;
            var data = function(){
                var t = [];
                for ( var i = 0; i < n; i ++){
                    t.push(0);
                }
                return t;
            }();

            var width = 300;
            var height = $("#topBar").height();


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
                .attr("width", width)
                .attr("height", height )
                .style("top", -element.offset().top)
                .append("g");

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

                if( scope.tweetCount.value !== 0){

                    if( lastValue !== undefined && lastHeartBeat !== undefined ){
                        newHeartBeat = scope.tweetCount.value - lastValue;
                        newVariation = newHeartBeat - lastHeartBeat;
                        lastHeartBeat = newHeartBeat;
                        lastValue = scope.tweetCount.value;
                        scope.tps = newHeartBeat;
                    }
                    else{
                        lastValue = scope.tweetCount.value;
                        lastHeartBeat = 0;
                        newVariation = 0;
                    }
                }else{
                    newHeartBeat = 0;
                    newVariation = 0;
                }

                data.push(newVariation);

                // redraw the line, and slide it to the left
                path.attr("d", line)
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