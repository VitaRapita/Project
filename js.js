angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    .state('tabs.home', {
      url: "/home", //:LatLng",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.maps', {
      url: "/maps",//:LatLng",
      views: {
        'home-tab': {
          templateUrl: "templates/maps.html",
          controller: 'MapCtrl'
        }
      }
    })
    .state('tabs.parking', {
      url: "/parking", //:LatLng",
      views: {
        'home-tab': {
          templateUrl: "templates/parking.html",
          controller: 'ParkCtrl'
        }
      }
    })
    .state('tabs.facts2/', {
      url: "/facts2", //:LatLng",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile, $stateParams) {

  //var LatLng = $stateProvider.LatLng;
      function initialize() {
        var myLatlng = new google.maps.LatLng(49.840221, 24.017666);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      //google.maps.event.addDomListener(window, 'load', initialize);
      initialize();
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

      //$scope.clickHome = function() {
        //$state("home-tab", {LatLng: $scope.LatLng});
    
      //}
    })


.controller('ParkCtrl', function($scope, $ionicLoading, $compile) {
 
    google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(49.839683, 24.029717);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
        /*var image = 'images.jpg'
        marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:false,
        icon: image

  })*/

        var markers = [  // Точки, в яких будемо ставити позначки
        {
            "title": 'вул. Валова', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84000639', // Географічна широта
            "lng": '24.03360933', // Географічна довгота
            "description": 'Кількість місць 72',
            "mark": true, 
        },
       {
            "title": 'Пр. Шевченка', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.8369225', // Географічна широта
            "lng": '24.0317838', // Географічна довгота
            "description": 'Кількість місць 46',
            "mark": true, 
        },
       {
            "title": 'Пр. Шевченка', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.83679448', // Географічна широта
            "lng": '24.03156922', // Географічна довгота
            "description": 'Кількість місць 46',
            "mark": true, 
        },

       {
            "title": 'вул. Театральна', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84280933', // Географічна широта
            "lng": '24.02875727', // Географічна довгота
            "description": 'Кількість місць 21',
            "mark": true, 
        },
       {
            "title": 'вул. Вірменська', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84286468', // Географічна широта
            "lng": '24.02820474', // Географічна довгота
            "description": 'Кількість місць 21',
            "mark": true, 
        },
       {
            "title": 'вул. Низький Замок', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84330057', // Географічна широта
            "lng": '24.02792579', // Географічна довгота
            "description": 'Кількість місць 22',
            "mark": true, 
        },
       {
            "title": 'вул. Лесі Українки', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84383331', // Географічна широта
            "lng": '24.02827984', // Географічна довгота
            "description": 'Кількість місць 21',
            "mark": true, 
        },
       {
            "title": 'вул. Січових Стрільців', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84059962', // Географічна широта
            "lng": '24.02464312', // Географічна довгота
            "description": 'Кількість місць 40',
            "mark": true, 
        },
       {
            "title": 'вул. Костюшка', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84049929', // Географічна широта
            "lng": '24.02326983', // Географічна довгота
            "description": 'Кількість місць 30',
            "mark": true, 
        },
       {
            "title": 'вул. Гнатюка', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.84181638', // Географічна широта
            "lng": '24.02388078', // Географічна довгота
            "description": 'Кількість місць 30',
            "mark": true, 
        },
       {
            "title": 'вул. Словацького', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.83786622', // Географічна широта
            "lng": '24.02388787', // Географічна довгота
            "description": 'Кількість місць 30',
            "mark": true, 
        },
       {
            "title": 'вул. Коперніка', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.83595843', // Географічна широта
            "lng": '24.0223977', // Географічна довгота
            "description": 'Кількість місць 20',
            "mark": true, 
        },
       {
            "title": 'вул. Саксаганського', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.83429072', // Географічна широта
            "lng": '24.03339475', // Географічна довгота
            "description": 'Кількість місць 21',
            "mark": true, 
        },
       {
            "title": 'вул. Вагова', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.8452319', // Географічна широта
            "lng": '24.02473929', // Географічна довгота
            "description": 'Кількість місць 14',
            "mark": true, 
        },
       {
            "title": 'вул. Руданського', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.838356', // Географічна широта
            "lng": '24.0305378', // Географічна довгота
            "description": 'Кількість місць 15',
            "mark": true, 
        },
       {
            "title": 'вул. Уласа Самчука', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.82627601', // Географічна широта
            "lng": '24.03209779', // Географічна довгота
            "description": 'Кількість місць 14',
            "mark": true, 
        },
       {
            "title": 'Площа Івана Підкови', // Назва (підказка, що випливає при наведенні курсора миші)
            "lat": '49.8413335', // Географічна широта
            "lng": '24.0288112', // Географічна довгота
            "description": 'Кількість місць 23',
            "mark": true, 
        },

    ];
    var latlngbounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow(); 
    for (var i = 0; i < markers.length; i++) {
        var data = markers[i];
        var myLatlng = new google.maps.LatLng(data.lat, data.lng); // Створюємо об’єкт - точка на мапі
        var image = 'images.jpg'
      
        if (data.mark) { // Якщо потрібно - встановлюємо маркер (позначку)
            var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable:false,
        icon: image
      });  
            latlngbounds.extend(marker.position);
        (function (marker, data) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(data.description);
                    infoWindow.open(map, marker);
                });
            })(marker, data); // Передача актуальних параметрів в кожній ітерації
        }
 
        if (data.forpath) { // Якщо точка має брати участь в прокладені маршруту, зберігаємо її в масиві lat_lng
            lat_lng.push(new google.maps.LatLng(data.lat, data.lng));
        }
    }    

    });
});
