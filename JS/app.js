/**
 * Created by Mohit on 12-Dec-16.
 */
var time;

var collideWith;
$.getJSON('https://appcues-interviews.firebaseio.com/calendar/events.json', {}, function (data) {
    //data reading from the JSON
    time = data;
    for (var key in time) {
        var event = time[key];
        var arr = new Array();
        collideWith = "";
        var collisions = findOutCollision(event, key, 0, arr);
        event["collideWith"] = collideWith;
        event["count"] = collisions;
        var left = findLeft(event, key);
        event["left"] = left;
    }
    for (var key in time) {
        var event = time[key];
        setEvent(event);
    }
});

// fFind out which event will be placed first and second and third.
function findLeft(event, key) {
    var arr = new Array();
    var copy = Object.assign({}, event);
    copy.key = key;
    arr.push(copy);
    if (!event.collideWith) {
        return 0;
    }
    var c_events = event.collideWith.split(",");
    for (var i = 0; i < c_events.length; i++) {
        if (c_events[i] == "") {
            continue;
        }
        var c_event_object = time[c_events[i]];
        var c_copy = Object.assign({}, c_event_object);
        c_copy.key = c_events[i];
        arr.push(c_copy);
    }
    arr.sort(compare);
    var idx = findIndexOfEvent(key, arr);
    var width = 620 / arr.length;
    var left = width * idx;
    return left;
}
function findIndexOfEvent(key, arr) {
    var idx = "";
    arr.map(function (object, index) {
        if (object.key == key) {
            idx = index;
        }
    })
    return idx;
}
function compare(a, b) {
    if (a.start < b.start)
        return -1;
    if (a.start > b.start)
        return 1;
    return 0;
}


function findOutCollision(event, key, counter, arr) {
    // loop through all events and find collision with the passed event
    for (var child_key in time) {
        var child = time[child_key]
        if (arr.indexOf(child_key) != -1) { // to avoid endless recursion
            continue;
        }
        // avoid self comparision
        if (key != child_key) {
            var isOverlap = checkForCollision(event, child); // check for collision with the element
            if (isOverlap == true) {
                collideWith = collideWith + child_key + ",";
                arr.push(key); // add to array to avoid endless recursion
                counter = findOutCollision(child, child_key, ++counter, arr);
            }
        }
    }
    return counter;
}

//Check which events are collapsing each other and ser Overlap flag true or false depending on that.
function checkForCollision(element, nextElement) {
    //return true if collison found

    var overlapFlag = false;
    if (element.start >= nextElement.start && element.start <= nextElement.end || nextElement.start >= element.start && nextElement.start <= element.end) {
        overlapFlag = true;
    }
    if (element.end >= nextElement.start && element.end <= nextElement.end || nextElement.end >= element.start && nextElement.end <= element.end) {
        overlapFlag = true;
    }
    return overlapFlag;


}
console.log(time);


//Create Div Element
function setEvent(element) {
    var div_width = 620;
    if (element.count != 0) {
        div_width = 620 / (element.count + 1);
    }
    else {
        div_width = 620;
    }
    var newElement = document.createElement('div');

    newElement.style.height = ((element.end - element.start) + "px");
    newElement.style.width = div_width + "px";
    newElement.style.top = (element.start) + "px";
    newElement.style.left = (element.left) + "px";
    newElement.style.backgroundColor = "lightblue";
    newElement.style.border = 2 + "px";
    newElement.style.borderStyle = "dashed";
    newElement.style.borderColor = "red";
    newElement.style.position = "absolute";
    document.getElementById("mainDiv").appendChild(newElement);
}


