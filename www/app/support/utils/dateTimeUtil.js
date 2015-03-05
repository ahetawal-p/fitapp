angular.module('app.utils')

/**
 * A simple example service that returns some data.
 */
 .factory('dateTimeUtil', function() {
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' ];

    var dayNames = ['Sun','Mon','Tues','Wed',
    'Thurs','Fri','Sat'];

    function getFormattedDateString(date){
        // var convertedDate = new Date(date.toString().replace(/-/g, "/"));
        // var formattedDateString = dayNames[convertedDate.getDay()] + ", " + monthNames[convertedDate.getMonth()] + " " + convertedDate.getDate();
        // console.log("asdf: " + date);

        return date.substring(0, 10);//.toJSON().substring(0,10)
    }

    function getTimeStamp(date){
        var convertedDate = new Date(date.toString().replace(/-/g, "/"));
        return (convertedDate.getHours() < 10? '0': '') + convertedDate.getHours() + ":" + (convertedDate.getMinutes() < 10 ? '0': '') + convertedDate.getMinutes();
    }

    function getDurationInHours(startDate, endDate){
        var timeDiffInSeconds = getDurationInSeconds(startDate, endDate);
        return timeDiffInSeconds/3600;
    }

    function getDurationString(startDate, endDate){
        var timeDiffInSeconds = getDurationInSeconds(startDate, endDate);
        return getDurationStringFromSeconds(timeDiffInSeconds);
    }

    function getDurationInSeconds(startDate, endDate){
        var convertedStartDateString = startDate;
        var convertedEndDateString = endDate;

        if (startDate.indexOf("-") >= 0){
            convertedStartDateString = convertedStartDateString.replace(/-/g, "/");
        }

        if (endDate.indexOf("-") >= 0){
            convertedEndDateString = convertedEndDateString.replace(/-/g, "/");
        }

        var convertedStartDate = new Date(convertedStartDateString);
        var convertedEndDate = new Date(convertedEndDateString);
        var timeDiff = Math.abs(convertedEndDate - convertedStartDate);
        var timeDiffInSeconds = Math.floor((timeDiff/1000));

        return timeDiffInSeconds;
    }

    function getDurationStringFromSeconds(durationInSeconds){
        var totalMinutes = Math.ceil(durationInSeconds/60);
        var convertedHours = Math.floor(totalMinutes/60);

        if (convertedHours >= 1){
            var leftOverMinutes = totalMinutes - convertedHours * 60;
            var durationString = convertedHours.toString().concat(" hr ")
            .concat(leftOverMinutes).concat(" min ");

            return durationString;
        }

        var durationString = totalMinutes.toString().concat(" min ");

        return durationString;
    }

    return {
        getFormattedDateString: getFormattedDateString,
        getTimeStamp: getTimeStamp,
        getDurationString: getDurationString,
        getDurationInHours: getDurationInHours,
        getDurationInSeconds: getDurationInSeconds,
        getDurationStringFromSeconds: getDurationStringFromSeconds
    };
});