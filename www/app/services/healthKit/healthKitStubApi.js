angular.module('app.services.healthKit')

.factory('healthKitStubApi', ['$q',
	function($q) {

		function getWalkingAndRunningDistance(){
			var deferred = $q.defer();
			var activities =  [{"endDate":"2015-03-22 11:32:12","quantity":0.009799999999988358,"startDate":"2015-03-22 11:31:52"},{"endDate":"2015-03-22 11:31:52","quantity":0.001880000000004657,"startDate":"2015-03-22 11:25:52"},{"endDate":"2015-03-21 17:16:38","quantity":0.1046799999999348,"startDate":"2015-03-21 17:13:27"},{"endDate":"2015-03-21 17:13:27","quantity":0.00321999999997206,"startDate":"2015-03-21 17:07:27"},{"endDate":"2015-03-21 16:52:22","quantity":0.1017899999999791,"startDate":"2015-03-21 16:50:52"},{"endDate":"2015-03-21 16:50:52","quantity":0.2866600000000908,"startDate":"2015-03-21 16:45:46"},{"endDate":"2015-03-21 16:45:46","quantity":0.2410000000001164,"startDate":"2015-03-21 16:40:37"},{"endDate":"2015-03-21 16:40:37","quantity":0.09576999999990221,"startDate":"2015-03-21 16:35:27"},{"endDate":"2015-03-21 16:35:27","quantity":0.2561499999999651,"startDate":"2015-03-21 16:30:47"},{"endDate":"2015-03-21 16:30:47","quantity":0.3637699999999604,"startDate":"2015-03-21 16:25:41"},{"endDate":"2015-03-21 16:25:41","quantity":0.006479999999981374,"startDate":"2015-03-21 16:19:41"},{"endDate":"2015-03-21 16:15:31","quantity":0.1708800000000047,"startDate":"2015-03-21 16:11:51"},{"endDate":"2015-03-21 16:11:51","quantity":0.06629999999998835,"startDate":"2015-03-21 16:06:47"},{"endDate":"2015-03-21 16:06:47","quantity":0.1263899999998394,"startDate":"2015-03-21 16:01:51"},{"endDate":"2015-03-21 16:01:51","quantity":0.004200000000011641,"startDate":"2015-03-21 15:55:51"},{"endDate":"2015-03-21 15:33:15","quantity":0.02478000000002794,"startDate":"2015-03-21 15:29:44"},{"endDate":"2015-03-21 15:29:44","quantity":0.08510000000009313,"startDate":"2015-03-21 15:26:24"},{"endDate":"2015-03-21 15:26:24","quantity":0.0007100000000209547,"startDate":"2015-03-21 15:20:24"},{"endDate":"2015-03-21 15:17:47","quantity":0.1259300000001676,"startDate":"2015-03-21 15:13:48"},{"endDate":"2015-03-21 15:13:48","quantity":0.2077599999997765,"startDate":"2015-03-21 15:08:46"},{"endDate":"2015-03-21 15:08:46","quantity":0.004840000000025611,"startDate":"2015-03-21 15:02:46"},{"endDate":"2015-03-21 15:02:36","quantity":0.004840000000025611,"startDate":"2015-03-21 15:02:26"},{"endDate":"2015-03-21 15:02:26","quantity":0.00171999999997206,"startDate":"2015-03-21 14:56:26"},{"endDate":"2015-03-21 14:28:19","quantity":0.1527599999999511,"startDate":"2015-03-21 14:23:48"},{"endDate":"2015-03-21 14:23:48","quantity":0.09191999999992549,"startDate":"2015-03-21 14:18:38"},{"endDate":"2015-03-21 14:18:38","quantity":0.005880000000004657,"startDate":"2015-03-21 14:12:38"},{"endDate":"2015-03-20 21:39:12","quantity":0.2169199999999837,"startDate":"2015-03-20 21:35:42"},{"endDate":"2015-03-20 21:35:42","quantity":0.005979999999981373,"startDate":"2015-03-20 21:29:42"},{"endDate":"2015-03-20 20:54:44","quantity":0.01522000000003027,"startDate":"2015-03-20 20:54:04"},{"endDate":"2015-03-20 20:54:04","quantity":0.00864000000001397,"startDate":"2015-03-20 20:48:04"},{"endDate":"2015-03-20 20:40:09","quantity":0.08817999999993481,"startDate":"2015-03-20 20:37:49"},{"endDate":"2015-03-20 20:37:49","quantity":0.3292699999999604,"startDate":"2015-03-20 20:32:39"},{"endDate":"2015-03-20 20:32:39","quantity":0.363050000000163,"startDate":"2015-03-20 20:27:32"},{"endDate":"2015-03-20 20:27:32","quantity":0.2707599999999511,"startDate":"2015-03-20 20:22:22"},{"endDate":"2015-03-20 20:22:22","quantity":0.002070000000006985,"startDate":"2015-03-20 20:16:22"},{"endDate":"2015-03-20 18:26:12","quantity":0.005220000000030268,"startDate":"2015-03-20 18:25:52"},{"endDate":"2015-03-20 18:25:52","quantity":0.0004699999999720603,"startDate":"2015-03-20 18:19:52"},{"endDate":"2015-03-20 18:18:50","quantity":0.02852999999996973,"startDate":"2015-03-20 18:18:23"},{"endDate":"2015-03-20 18:18:23","quantity":0.3987600000000675,"startDate":"2015-03-20 18:13:21"},{"endDate":"2015-03-20 18:13:21","quantity":0.403050000000163,"startDate":"2015-03-20 18:08:19"},{"endDate":"2015-03-20 18:08:19","quantity":0.4235100000000093,"startDate":"2015-03-20 18:03:16"},{"endDate":"2015-03-20 18:03:16","quantity":0.4326899999998859,"startDate":"2015-03-20 17:58:06"},{"endDate":"2015-03-20 17:58:06","quantity":0.4492800000000862,"startDate":"2015-03-20 17:53:04"},{"endDate":"2015-03-20 17:53:04","quantity":0.2994699999997975,"startDate":"2015-03-20 17:47:54"},{"endDate":"2015-03-20 17:47:54","quantity":0.007299999999988358,"startDate":"2015-03-20 17:41:54"},{"endDate":"2015-03-20 08:46:04","quantity":0.1118099999999395,"startDate":"2015-03-20 08:43:24"},{"endDate":"2015-03-20 08:43:24","quantity":0.0007000000000116415,"startDate":"2015-03-20 08:37:24"},{"endDate":"2015-03-20 08:20:38","quantity":0.1121799999999348,"startDate":"2015-03-20 08:18:58"},{"endDate":"2015-03-20 08:18:58","quantity":0.005760000000009313,"startDate":"2015-03-20 08:12:58"},{"endDate":"2015-03-19 22:05:35","quantity":0.005760000000009313,"startDate":"2015-03-19 22:05:32"},{"endDate":"2015-03-19 22:05:32","quantity":0.003919999999983702,"startDate":"2015-03-19 21:59:32"},{"endDate":"2015-03-19 21:00:22","quantity":0.003919999999983702,"startDate":"2015-03-19 21:00:20"},{"endDate":"2015-03-19 21:00:20","quantity":0.002880000000004657,"startDate":"2015-03-19 20:54:20"},{"endDate":"2015-03-19 16:47:18","quantity":0.07586000000010244,"startDate":"2015-03-19 16:45:23"},{"endDate":"2015-03-19 16:45:23","quantity":0.003760000000009313,"startDate":"2015-03-19 16:39:23"},{"endDate":"2015-03-19 16:23:43","quantity":0.02046000000007916,"startDate":"2015-03-19 16:20:33"},{"endDate":"2015-03-19 16:20:33","quantity":0.009200000000011642,"startDate":"2015-03-19 16:14:33"},{"endDate":"2015-03-19 15:07:28","quantity":0.01801999999996042,"startDate":"2015-03-19 15:05:48"},{"endDate":"2015-03-19 15:05:48","quantity":0.002760000000009313,"startDate":"2015-03-19 14:59:48"},{"endDate":"2015-03-19 14:40:58","quantity":0.002760000000009313,"startDate":"2015-03-19 14:40:48"},{"endDate":"2015-03-19 14:40:48","quantity":0.2841100000001024,"startDate":"2015-03-19 14:35:38"},{"endDate":"2015-03-19 14:35:38","quantity":0.002190000000002328,"startDate":"2015-03-19 14:29:38"},{"endDate":"2015-03-19 13:50:17","quantity":0.1301100000000442,"startDate":"2015-03-19 13:48:17"},{"endDate":"2015-03-19 13:48:17","quantity":0.00864000000001397,"startDate":"2015-03-19 13:42:17"},{"endDate":"2015-03-19 13:03:11","quantity":0.01104000000003725,"startDate":"2015-03-19 12:59:51"},{"endDate":"2015-03-19 12:59:51","quantity":0.3197899999998626,"startDate":"2015-03-19 12:55:11"},{"endDate":"2015-03-19 12:55:11","quantity":0.008400000000023283,"startDate":"2015-03-19 12:49:11"},{"endDate":"2015-03-19 12:40:33","quantity":0.0162400000000489,"startDate":"2015-03-19 12:40:13"},{"endDate":"2015-03-19 12:40:13","quantity":0.02940000000002328,"startDate":"2015-03-19 12:35:03"},{"endDate":"2015-03-19 12:35:03","quantity":0.2733699999999953,"startDate":"2015-03-19 12:30:13"},{"endDate":"2015-03-19 12:30:13","quantity":0.000820000000006985,"startDate":"2015-03-19 12:24:13"},{"endDate":"2015-03-19 12:15:19","quantity":0.007720000000030268,"startDate":"2015-03-19 12:15:14"},{"endDate":"2015-03-19 12:15:14","quantity":0.004900000000023283,"startDate":"2015-03-19 12:09:14"},{"endDate":"2015-03-19 10:21:16","quantity":0.05185000000003492,"startDate":"2015-03-19 10:20:26"},{"endDate":"2015-03-19 10:20:26","quantity":0.2416000000000349,"startDate":"2015-03-19 10:15:16"},{"endDate":"2015-03-19 10:15:16","quantity":0.00496999999997206,"startDate":"2015-03-19 10:09:16"},{"endDate":"2015-03-19 09:43:11","quantity":0.007769999999960419,"startDate":"2015-03-19 09:42:51"},{"endDate":"2015-03-19 09:42:51","quantity":0.2819499999999535,"startDate":"2015-03-19 09:37:01"},{"endDate":"2015-03-19 09:37:01","quantity":0.002299999999988359,"startDate":"2015-03-19 09:31:01"},{"endDate":"2015-03-19 08:23:59","quantity":0.01235000000003493,"startDate":"2015-03-19 08:23:19"},{"endDate":"2015-03-19 08:23:19","quantity":0.00510999999998603,"startDate":"2015-03-19 08:17:19"},{"endDate":"2015-03-19 08:14:09","quantity":0.1123099999999395,"startDate":"2015-03-19 08:11:27"},{"endDate":"2015-03-19 08:11:27","quantity":0.000820000000006985,"startDate":"2015-03-19 08:05:27"},{"endDate":"2015-03-18 23:03:55","quantity":0.005,"startDate":"2015-03-18 23:03:48"},{"endDate":"2015-03-18 23:03:48","quantity":0.003989999999990687,"startDate":"2015-03-18 22:57:48"},{"endDate":"2015-03-18 18:19:16","quantity":0.1219999999999418,"startDate":"2015-03-18 18:17:36"},{"endDate":"2015-03-18 18:17:36","quantity":0.4543599999999861,"startDate":"2015-03-18 18:12:26"},{"endDate":"2015-03-18 18:12:26","quantity":0.02239000000001397,"startDate":"2015-03-18 18:07:16"},{"endDate":"2015-03-18 18:07:16","quantity":0.3259599999998463,"startDate":"2015-03-18 18:02:45"},{"endDate":"2015-03-18 18:02:45","quantity":0.0007199999999720604,"startDate":"2015-03-18 17:56:45"},{"endDate":"2015-03-18 17:38:23","quantity":0.2580999999999767,"startDate":"2015-03-18 17:34:53"},{"endDate":"2015-03-18 17:34:53","quantity":0.3546300000004121,"startDate":"2015-03-18 17:29:44"},{"endDate":"2015-03-18 17:29:44","quantity":0.001440000000002328,"startDate":"2015-03-18 17:23:44"},{"endDate":"2015-03-18 08:51:31","quantity":0.03510999999992782,"startDate":"2015-03-18 08:49:41"},{"endDate":"2015-03-18 08:49:41","quantity":0.3821199999998789,"startDate":"2015-03-18 08:44:31"},{"endDate":"2015-03-18 08:44:31","quantity":0.3321800000002259,"startDate":"2015-03-18 08:39:31"},{"endDate":"2015-03-18 08:39:31","quantity":0.002919999999983702,"startDate":"2015-03-18 08:33:31"},{"endDate":"2015-03-18 08:23:34","quantity":0.1629000000000815,"startDate":"2015-03-18 08:18:44"},{"endDate":"2015-03-18 08:18:44","quantity":0.2994200000001001,"startDate":"2015-03-18 08:14:18"},{"endDate":"2015-03-18 08:14:18","quantity":0.003080000000016298,"startDate":"2015-03-18 08:08:18"}];

			deferred.resolve(activities);

			return deferred.promise;
		}

	    function getWalkingAndRunningDistanceByDateTime(startDate, endDate){
	    	var deferred = $q.defer();
			var activities = [{"endDate":"2015-03-20 18:26:12","quantity":0.005220000000030268,"startDate":"2015-03-20 18:25:52"},{"endDate":"2015-03-20 18:25:52","quantity":0.0004699999999720603,"startDate":"2015-03-20 18:19:52"},{"endDate":"2015-03-20 18:18:50","quantity":0.02852999999996973,"startDate":"2015-03-20 18:18:23"},{"endDate":"2015-03-20 18:18:23","quantity":0.3987600000000675,"startDate":"2015-03-20 18:13:21"},{"endDate":"2015-03-20 18:13:21","quantity":0.403050000000163,"startDate":"2015-03-20 18:08:19"},{"endDate":"2015-03-20 18:08:19","quantity":0.4235100000000093,"startDate":"2015-03-20 18:03:16"},{"endDate":"2015-03-20 18:03:16","quantity":0.4326899999998859,"startDate":"2015-03-20 17:58:06"},{"endDate":"2015-03-20 17:58:06","quantity":0.4492800000000862,"startDate":"2015-03-20 17:53:04"},{"endDate":"2015-03-20 17:53:04","quantity":0.2994699999997975,"startDate":"2015-03-20 17:47:54"},{"endDate":"2015-03-20 17:47:54","quantity":0.007299999999988358,"startDate":"2015-03-20 17:41:54"},{"endDate":"2015-03-20 08:46:04","quantity":0.1118099999999395,"startDate":"2015-03-20 08:43:24"},{"endDate":"2015-03-20 08:43:24","quantity":0.0007000000000116415,"startDate":"2015-03-20 08:37:24"},{"endDate":"2015-03-20 08:20:38","quantity":0.1121799999999348,"startDate":"2015-03-20 08:18:58"},{"endDate":"2015-03-20 08:18:58","quantity":0.005760000000009313,"startDate":"2015-03-20 08:12:58"}];
			deferred.resolve(activities);

	      return deferred.promise;
	    }

		return {
			getWalkingAndRunningDistance: getWalkingAndRunningDistance,
			getWalkingAndRunningDistanceByDateTime: getWalkingAndRunningDistanceByDateTime
		}
	}]
	);