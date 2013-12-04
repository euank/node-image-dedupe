Dropzone.options.dropzone = {
  init: function() {
    var dz = this;
    this.on("complete", function(file) {
      setTimeout(function() {
        dz.removeFile(file);
      }, 1000);
    });
  }
};
angular.module("App", ['ngResource'])
.controller("Ctrl", function($scope, $http, $timeout) {
  $scope.loc = {};
  var loc = $scope.loc;
  loc.imgs = [];
  loc.algorithms = [];
  loc.selectedAlgo = null;
  loc.nav = 'UPLOAD';

  loc.selectedImages = [];

  $scope.dedupe = function() {
    loc.nav = 'DEDUPE';
    loc.dupes = [];

    var dupes;
    $http.post('/api/dedupe', {imgs: loc.selectedImages, algo: loc.selectedAlgo})
    .success(function(data) {
      loc.selectedImages = [];
      loc.dupes = data;
    })
    .error(function(data) {
      alert("UNABLE TO DEDUPEEE");
    });

  }

  $scope.toggleImage = function(path) {
    if(loc.selectedImages.indexOf(path) === -1) {
      loc.selectedImages.push(path);
    } else {
      loc.selectedImages.splice(loc.selectedImages.indexOf(path),1);
    }
  };

  $scope.updateImages = function() {
    $http.get("/api/images")
    .success(function(data) {
      data.sort(function(l,r) {
        return r.time - l.time;
      });
      loc.imgs = data;
      $timeout(function() {
        $scope.updateImages();
      },2000);
    })
    .error(function(data) {
      alert("ERRORRRR");
    });
  };

  $scope.getAlgorithms = function() {
    $http.get("/api/algorithms")
    .success(function(data) {
      loc.algorithms = data;
      for(var i=0;i<loc.algorithms.length;i++) {
        if(loc.algorithms[i].default) {
          loc.selectedAlgo = loc.algorithms[i];
          break;
        }
      }
    })
    .error(function(data) {
      throw Error("Cannot get algos");
    });
  };

  $scope.getAlgorithms();
  $scope.updateImages();
});
