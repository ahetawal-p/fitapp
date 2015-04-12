angular.module('app.utils')

/**
 * utility class that processes/reformats date
 */
 .factory('dateTimeUtil', [ '$localstorage', '$translate', function($localstorage, $translate) {
    function getAmPm(timeString){
        var timeObj = moment(timeString, "HH");
        return timeObj.format("hA");
    }

    function getFormattedDateString(date){
        var dateObj = moment(date);
        return dateObj.format("YYYY-MM-DD");
    }

    function getLocalizedDateString(date){
        if ($localstorage.getUserLanguageId() == "zh_ZH"){
            moment.locale('zh-cn');
        } else {
            moment.locale('en-US');
        }

        var dateObj = moment(date);
        return dateObj.format("ddd MMM Do");
    }

    function getDayOfMonth(date){
        var dateObj = new Date(date.toString().replace(/-/g, "/"));
        return dateObj.getDate();
    }

    function getDayOfWeekName(date){
        var dateObj = moment(date);
        var locale = dateObj.localeData();
        return locale.weekdays(dateObj).toUpperCase();
    }

    function getDayOfWeekShortName(date){
        var dateObj = moment(date);
        var locale = dateObj.localeData();
        return locale.weekdaysShort(dateObj).toUpperCase();
    }

    function getMonthOfYear(date){
        var dateObj = moment(date);
        var locale = dateObj.localeData();
        return locale.monthsShort(dateObj).toUpperCase();
    }

    function getMonthDayYear(date){
        var dateObj = moment(date);
        return dateObj.format("MM/DD/YYYY");
    }

    function getMonthDay(date){
        var dateObj = new moment(date);
        return dateObj.format('M-DD');
    }

    function getTimeStamp(date){
        var convertedDate = new moment(date.toString());
        return convertedDate.format('H:mm')
    }

    function getDurationInHours(startDate, endDate){
        var timeDiffInSeconds = getDurationInSeconds(startDate, endDate);
        return timeDiffInSeconds/3600;
    }

    function getDurationString(startDate, endDate){
        var timeDiffInSeconds = getDurationInSeconds(startDate, endDate);
        return getDurationStringFromSeconds(timeDiffInSeconds);
    }

    function getDurationInMinutes(startDate, endDate){
        var startDateObj = moment(startDate);
        var endDateObj = moment(endDate);
        var diff = endDateObj.diff(startDateObj, "seconds");

        return getMinutesFromSeconds(diff);
    }

    function getDurationInSeconds(startDate, endDate){
        var startDateObj = moment(startDate);
        var endDateObj = moment(endDate);
        var diff = endDateObj.diff(startDateObj, "seconds");

        return diff;
    }

    function getDurationStringFromSeconds(durationInSeconds){
        var totalMinutes = Math.ceil(durationInSeconds/60);
        var convertedHours = Math.floor(totalMinutes/60);
        var minText = $translate.instant("Minute_Text");
        var hourText = $translate.instant("Hour_Text");
        
        if (convertedHours >= 1){
            var leftOverMinutes = totalMinutes - convertedHours * 60;
            var durationString = convertedHours.toString().concat(" ").concat(hourText).concat(" ")
            .concat(leftOverMinutes).concat(" ").concat(minText).concat(" ");

            return durationString;
        }

        var durationString = totalMinutes.toString().concat(" ").concat(minText).concat(" ");

        return durationString;
    }

    function getDurationStringFromMinutes(durationInMinutes){
        var convertedHours = Math.floor(durationInMinutes/60);
        var minText = $translate.instant("Minute_Text");
        var hourText = $translate.instant("Hour_Text");

        if (convertedHours >= 1){
            var leftOverMinutes = durationInMinutes - convertedHours * 60;
            var durationString = convertedHours.toString().concat(" ").concat(hourText).concat(" ")
            .concat(leftOverMinutes).concat(" ").concat(minText).concat(" ");

            return durationString;
        }

        var durationString = durationInMinutes.toString().concat(" ").concat(minText).concat(" ");

        return durationString;
    }

    function getMinutesFromSeconds(durationInSeconds){
        var totalMinutes = Math.ceil(durationInSeconds/60);
        return totalMinutes;
    }

    function secondTimeGreaterThanFirst(firstDateTime, secondDateTime){
        var firstDateTimeObj = moment(firstDateTime);
        var secondDateTimeObj = moment(secondDateTime);

        var firstTimeInMinutes = firstDateTimeObj.hours() * 60 + firstDateTimeObj.minutes();
        var secondTimeInMinutes = secondDateTimeObj.hours() * 60 + secondDateTimeObj.minutes();

        return secondTimeInMinutes > firstTimeInMinutes;
    }

    function isLastWeek(evalDate){
        var endDateObj = moment();
        var startDateObj = moment().subtract(7, 'days');
        var evalDateObj = moment(evalDate);

        return evalDateObj.isBetween(startDateObj, endDateObj);
    }

    function isPreviousWeek(evalDate){
        var endDateObj = moment().subtract(7, 'days');
        var startDateObj = moment().subtract(14, 'days');
        var evalDateObj = moment(evalDate);

        return evalDateObj.isBetween(startDateObj, endDateObj);
    }

    function getCurrentHour() {
        return moment().hour();
    }

    return {
        getFormattedDateString: getFormattedDateString,
        getLocalizedDateString: getLocalizedDateString,
        getTimeStamp: getTimeStamp,
        getDurationString: getDurationString,
        getDurationInHours: getDurationInHours,
        getDurationInSeconds: getDurationInSeconds,
        getDurationInMinutes: getDurationInMinutes,
        getDurationStringFromSeconds: getDurationStringFromSeconds,
        getMonthDay: getMonthDay,
        getMinutesFromSeconds: getMinutesFromSeconds,
        getDurationStringFromMinutes: getDurationStringFromMinutes,
        getMonthDayYear: getMonthDayYear,
        getDayOfWeekName: getDayOfWeekName,
        getDayOfMonth: getDayOfMonth,
        getMonthOfYear: getMonthOfYear,
        getAmPm: getAmPm,
        secondTimeGreaterThanFirst: secondTimeGreaterThanFirst,
        isPreviousWeek: isPreviousWeek,
        isLastWeek: isLastWeek,
        getCurrentHour : getCurrentHour,
        getDayOfWeekShortName : getDayOfWeekShortName
    };
}]);