angular.module('app.utils')

/**
 * A simple example service that returns some data.
 */
 .factory('dateTimeUtil', function() {
    var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' ];

    var dayNames = ['SUN','MON','TUE','WED',
    'THU','FRI','SAT'];

    function getAmPm(timeString){
        var hour = timeString.substring(0, 2);
        if (hour > 12){
            hour = hour - 12;
            hour += "pm";
        } else if (hour == 12){
            hour += "pm";
        } else {
            if (hour.substring(0, 1) == "0"){
                hour = hour.substring(1, 2);
            }
            hour += "am";
        }

        return hour;
    }

    function getFormattedDateString(date){

        return date.substring(0, 10);//.toJSON().substring(0,10)
    }

    function getDayOfMonth(date){
        var dateObj = new Date(date.toString().replace(/-/g, "/"));
        return dateObj.getDate();
    }

    function getDayOfWeekName(date){
        var dateObj = new Date(date.toString().replace(/-/g, "/"));
        return dayNames[dateObj.getDay()];
    }

    function getMonthOfYear(date){
        var dateObj = new Date(date.toString().replace(/-/g, "/"));
        return monthNames[dateObj.getMonth()];
    }

    function secondTimeGreaterThanFirst(firstDateTime, secondDateTime){
        var firstTimeInMinutes = firstDateTime.getHours() * 60 + firstDateTime.getMinutes();
        var secondTimeInMinutes = secondDateTime.getHours() * 60 + secondDateTime.getMinutes();

        return secondTimeInMinutes > firstTimeInMinutes;
    }

    function getMonthDayYear(date){
        var dateObj = new Date(date.toString().replace(/-/g, "/"));
        return dateObj.getMonth() + 1 + "/" + dateObj.getDate() + "/" + dateObj.getFullYear();
    }

    function getMonthDay(date){
        var dateObj = new Date(date.toString().replace(/-/g, "/"));
        return dateObj.getMonth() + 1 + "-" + dateObj.getDate();
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

    function getDurationStringFromMinutes(durationInMinutes){
        var convertedHours = Math.floor(durationInMinutes/60);

        if (convertedHours >= 1){
            var leftOverMinutes = durationInMinutes - convertedHours * 60;
            var durationString = convertedHours.toString().concat(" hr ")
            .concat(leftOverMinutes).concat(" min ");

            return durationString;
        }

        var durationString = durationInMinutes.toString().concat(" min ");

        return durationString;
    }

    function getMinutesFromSeconds(durationInSeconds){
        var totalMinutes = Math.ceil(durationInSeconds/60);
        return totalMinutes;
    }

    return {
        getFormattedDateString: getFormattedDateString,
        getTimeStamp: getTimeStamp,
        getDurationString: getDurationString,
        getDurationInHours: getDurationInHours,
        getDurationInSeconds: getDurationInSeconds,
        getDurationStringFromSeconds: getDurationStringFromSeconds,
        getMonthDay: getMonthDay,
        secondTimeGreaterThanFirst: secondTimeGreaterThanFirst,
        getMinutesFromSeconds: getMinutesFromSeconds,
        getDurationStringFromMinutes: getDurationStringFromMinutes,
        getMonthDayYear: getMonthDayYear,
        getDayOfWeekName: getDayOfWeekName,
        getDayOfMonth: getDayOfMonth,
        getMonthOfYear: getMonthOfYear,
        getAmPm: getAmPm
    };
});