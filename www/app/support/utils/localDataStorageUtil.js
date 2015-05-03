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
    getUserNickname: function(){
      if(this.getUser() !=null)
        return this.getUser().nickname;

      return null;
    },
    setUserNickname: function(nickname){
      var currObject = this.getUser();
      currObject.nickname = nickname;
      this.setUser(currObject);
    },
    getEmail: function(){
      return this.getObject("email");
    },
    setEmail: function(email){
      this.setObject("email", email);
    },
    getUserLanguageId: function(){
      /* change this to zh_ZH before release */
      var languageId = "en_US";
      if (this.getUser()){
        languageId = this.getUser().language;
      }

      return languageId;
    },
    setUserLanguageId: function(languageId){
      var currObject = this.getUser();
      currObject.language = languageId;
      this.setUser(currObject);    
    },

    createUserSkeleton: function(language){
      var userSkeleton = {
                'name': null,
                'nickname' : null,
                'lastLoginTime': new Date(),
                'language' : language
              };

      return userSkeleton;
    }

  }
}]);