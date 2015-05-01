function getElement () {
    xReader("http://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss", function(data) {
        //console.log(data.content);
        $(data.content).find("item").each(function () {
            var el = $(this);
            console.log("------------------------");
            console.log("title  : " + el.find("title").text());
            console.log("URL    : " + el.find("enclosure").attr("url"));
            console.log("Link   : " + el.find("guid").text());
        });
    });
}