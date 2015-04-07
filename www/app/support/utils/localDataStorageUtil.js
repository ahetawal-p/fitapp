angular.module('app.utils')

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || null);
    },
    getUser: function() {
      return this.getObject("user");
    },
    setUser: function(value) {
      return this.setObject("user", value);
    },
    removeUser: function() {
      delete $window.localStorage["user"];
    },
    updateUserLoginTime: function(){
    	var currObject = this.getUser();
    	currObject.lastLoginTime = new Date();
    	this.setUser(currObject);
    },
    updateUserLanguage: function(language){
    	var currObject = this.getUser();
    	currObject.language = language;
    	this.setUser(currObject);
    },
    getUserNickname: function(){
      return this.getUser().nickname;
    },
    setUserNickname: function(nickname){
      var currObject = this.getUser();
      currObject.nickname = nickname;
      this.setUser(currObject);
    },
    getUserLanguageId: function(){
      var languageId = this.getUser().languageId;
      if (!languageId){
        return "en_US";
      }

      return languageId;
    },
    setUserLanguageId: function(languageId){
      var currObject = this.getUser();
      currObject.languageId = languageId;
      this.setUser(currObject);    
    }

  }
}]);