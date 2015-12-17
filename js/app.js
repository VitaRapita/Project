var App = App || {};

App.module = angular.module('parkingMap', ['ionic']);

App.module.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('parkingmenu', {
        url: "",
        abstract: true,
        templateUrl: "templates/menu.html"
      })
      .state('parkingmenu.home', {
        url: "/home",
        views: {
          'menuContent': {
            templateUrl: "templates/home.html"
          }
        }
      })
      .state('parkingmenu.list', {
        url: "/list-view",
        views: {
          'menuContent': {
            templateUrl: "templates/list.html",
            controller: "ListViewCtrl"
          }
        }
      })
      .state('parkingmenu.map', {
        url: "/map-view",
        views: {
          'menuContent': {
            templateUrl: "templates/map.html",
            controller: "MapViewCtrl",
          }
        }
      })
      .state('parkingmenu.about', {
        url: "/about",
        views: {
          'menuContent': {
            templateUrl: "templates/about.html",
            controller: "AboutViewCtrl"
          }
        }
      });

  $urlRouterProvider.otherwise("/home");
});

App.module.controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {
  $scope.markers = App.markers;
  $scope.countPlacesText = App.defaults.countText;

  $scope.toggleLeft = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
});

App.module.controller('ListViewCtrl', function ($scope) {
  // Add some useful staff later
});

App.module.controller('MapViewCtrl', function ($scope, $ionicLoading) {
  var GMaps = google.maps;
  var userCoordinates = {
    lat: App.defaults.lat,
    lng: App.defaults.lng
  };

  var userPosition = new GMaps.LatLng(userCoordinates.lat, userCoordinates.lng);

  var mapOptions = {
    center: userPosition,
    zoom: 14,
    mapTypeId: GMaps.MapTypeId.ROADMAP
  };

  var map = new GMaps.Map(document.getElementById("map"), mapOptions);

  navigator.geolocation.getCurrentPosition(function (pos) {
    userCoordinates.lat = pos.coords.latitude;
    userCoordinates.lng = pos.coords.longitude;

    userPosition = new GMaps.LatLng(userCoordinates.lat, userCoordinates.lng);

    map.setCenter(userPosition);
    var userMarker = new GMaps.Marker({
      position: userPosition,
      map: map,
      title: "You are here",
      mark: true,
      icon: App.defaults.icons.info
    });
  });

  $scope.map = map;
  placeParkings();

  function getIcon(param) {
    if (param < 15) {
      return App.defaults.icons.danger;
    }
    else if (param < 25) {
      return App.defaults.icons.warning;
    }

    return App.defaults.icons.success;
  }

  function placeParkings() {
    var latlngBounds = new GMaps.LatLngBounds(),
        infoWindow = new GMaps.InfoWindow(),
        markers = $scope.markers,
        image, parkingPosition;

    angular.forEach(markers, function(data) {
      image = getIcon(data.countPlaces);

      parkingPosition = new GMaps.LatLng(data.lat, data.lng); // Створюємо об’єкт - точка на мапі

      if (data.mark) { // Якщо потрібно - встановлюємо маркер (позначку)
        var marker = new GMaps.Marker({
          position: parkingPosition,
          map: map,
          draggable: false,
          icon: image
        });
        latlngBounds.extend(marker.position);
        (function (marker, data) {
          GMaps.event.addListener(marker, "click", function (e) {
            infoWindow.setContent('<strong>' + data.title + '</strong><br>' + $scope.countPlacesText + data.countPlaces);
            infoWindow.open(map, marker);
          });
        })(marker, data); // Передача актуальних параметрів в кожній ітерації
      }

      if (data.forpath) { // Якщо точка має брати участь в прокладені маршруту, зберігаємо її в масиві lat_lng
        lat_lng.push(new GMaps.LatLng(data.lat, data.lng));
      }
    });
  }

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new GMaps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function(error) {
      console.log('Unable to get location: ' + error.message);
    });
  };

  // Create the search box and link it to the UI element.
  $scope.search = function() {
    var map = $scope.map;

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      angular.forEach(markers, function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      angular.forEach(places, function(place) {
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  };

});

App.module.controller('AboutViewCtrl', function($scope) {
  // Add some useful staff later
});

App.defaults = {
  lat: 49.839683,
  lng: 24.029717,
  countText: 'Кількість місць: ',
  icons: {
    info: 'images/infoMarker.png',
    success: 'images/successMarker.png',
    warning: 'images/warningMarker.png',
    danger: 'images/dangerMarker.png'
  }
};

App.markers = [
  {
    "title": 'вул. Валова',
    "lat": '49.84000639',
    "lng": '24.03360933',
    "countPlaces": 72,
    "mark": true
  },
  {
    "title": 'Пр. Шевченка',
    "lat": '49.8369225',
    "lng": '24.0317838',
    "countPlaces": 46,
    "mark": true
  },
  {
    "title": 'Пр. Шевченка',
    "lat": '49.83679448',
    "lng": '24.03156922',
    "countPlaces": 46,
    "mark": true
  },
  {
    "title": 'вул. Театральна',
    "lat": '49.84280933',
    "lng": '24.02875727',
    "countPlaces": 21,
    "mark": true
  },
  {
    "title": 'вул. Вірменська',
    "lat": '49.84286468',
    "lng": '24.02820474',
    "countPlaces": 21,
    "mark": true
  },
  {
    "title": 'вул. Низький Замок',
    "lat": '49.84330057',
    "lng": '24.02792579',
    "countPlaces": 22,
    "mark": true
  },
  {
    "title": 'вул. Лесі Українки',
    "lat": '49.84383331',
    "lng": '24.02827984',
    "countPlaces": 21,
    "mark": true
  },
  {
    "title": 'вул. Січових Стрільців',
    "lat": '49.84059962',
    "lng": '24.02464312',
    "countPlaces": 40,
    "mark": true
  },
  {
    "title": 'вул. Костюшка',
    "lat": '49.84049929',
    "lng": '24.02326983',
    "countPlaces": 30,
    "mark": true
  },
  {
    "title": 'вул. Гнатюка',
    "lat": '49.84181638',
    "lng": '24.02388078',
    "countPlaces": 30,
    "mark": true
  },
  {
    "title": 'вул. Словацького',
    "lat": '49.83786622',
    "lng": '24.02388787',
    "countPlaces": 30,
    "mark": true
  },
  {
    "title": 'вул. Коперніка',
    "lat": '49.83595843',
    "lng": '24.0223977',
    "countPlaces": 20,
    "mark": true
  },
  {
    "title": 'вул. Саксаганського',
    "lat": '49.83429072',
    "lng": '24.03339475',
    "countPlaces": 21,
    "mark": true
  },
  {
    "title": 'вул. Вагова',
    "lat": '49.8452319',
    "lng": '24.02473929',
    "countPlaces": 14,
    "mark": true
  },
  {
    "title": 'вул. Руданського',
    "lat": '49.838356',
    "lng": '24.0305378',
    "countPlaces": 15,
    "mark": true
  },
  {
    "title": 'вул. Уласа Самчука',
    "lat": '49.82627601',
    "lng": '24.03209779',
    "countPlaces": 14,
    "mark": true
  },
  {
    "title": 'Площа Івана Підкови',
    "lat": '49.8413335',
    "lng": '24.0288112',
    "countPlaces": 23,
    "mark": true
  }
];
