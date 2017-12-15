angular.module('app.controllers', [])
  angular.module('app.controllers', ['ngCordova'])
.controller('sliderCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicSlideBoxDelegate) {

// Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };


}])
   
.controller('createProfileCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state) {
    $scope.data={};
    $scope.profile=function(){
        alert("SIGNUP SUCCESSFULL");
       /* $scope.name=$scope.data.name,
                console.log($scope.name);*/
        $http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/users/registration',
        {
            

    name:$scope.data.name,
    phone:$scope.data.phone,
    email:$scope.data.email,
    password:$scope.data.password})
        .success(function(response){
           
            console.log(response);
                if(response.status===true)
            {
                alert(response.msg);
           $state.go('menu.step1');}
      
       else{
           alert(response.msg);
           $state.go('menu.createProfile');
       }
       

        });

};



})
   
.controller('step1Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$window,$state) {
     $scope.data={};
    $scope.mobile=function(){
        alert("sucessfull");
        $http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/users/login',
     {
       email:$scope.data.email,
       password:$scope.data.password 
     })
     .success(function(response){
           console.log(response);
     $window.localStorage.setItem("user_id",response.id);
      console.log($window.localStorage.getItem("user_id"));
         if(response.status===true)
            {
                alert('sign in successful');
            $state.go('menu.finalStep');}
            else{
               alert('Please filled correct email');
           }
        });
  };


})
   
.controller('finalStepCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('nearestRestaurantsCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal,$state,$rootScope,$cordovaGeolocation,$window,$http) {

// calculater distance
function deg2rad(deg) {
		rad = deg * Math.PI/180; // radians = degrees * pi/180
		return rad;
	}
	
	
	// round to the nearest 1/1000
	function round(x) {
		return Math.round( x * 1000) / 1000;
	} 
        
   $scope.findDistance= function(lat,long,lat1,long1) {
      // alert("hi");
		var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km, Rm, Rk, frm;
		
	     var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
	      var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
		// get values for lat1, lon1, lat2, and lon2
		t1 =lat;// 30.7206541;
		n1 = long;//76.843255;
		t2 = lat1;//30.729551;
		n2 = long1;//76.7656294;
		
		// convert coordinates to radians
		lat1 = deg2rad(t1);
		lon1 = deg2rad(n1);
		lat2 = deg2rad(t2);
		lon2 = deg2rad(n2);

		// find the differences between the coordinates
		dlat = lat2 - lat1;
		dlon = lon2 - lon1;

		// here's the heavy lifting
		a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
		c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
		dm = c * Rm; // great circle distance in miles
		dk = c * Rk; // great circle distance in km

		// round the results down to the nearest 1/1000
		mi = round(dm);
		km = round(dk);
return km*1000;
		
		
	};






 $scope.data=[];
$ionicModal.fromTemplateUrl('templates/search.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modal) {
      $scope.modal = modal;
   });
// getlocation	
var restdetails=[];
   $scope.openModal = function() {
      alert("hello");
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        
  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function(position) {
        //console.log(position);
       
     $rootScope.lat  = position.coords.latitude;
      $rootScope.long = position.coords.longitude;
      $window.localStorage.setItem('lat',JSON.stringify($rootScope.lat));
       $window.localStorage.setItem('long',JSON.stringify($rootScope.long));
       console.log($rootScope.lat );
       console.log($rootScope.long );
       alert(lat);
       alert(long);
        $scope.coords=position.coords;
        $scope.restdata ={data:{
   Restaurant:{latitude:$rootScope.lat,longitude:$rootScope.long
  }
        }};
       // console.log($scope.restdata);
        
       
   $http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/restaurants/restaurantslist/',$scope.restdata).success(function(response){
      console.log(response) ;
      if(response.isSuccess==="true"){
          
      $scope.lat=$window.localStorage.getItem('lat');
       $scope.long=$window.localStorage.getItem('long');
      for(var i=0; i<response.data.Restaurant.length; i++)
      {
          restdetails.push(response.data.Restaurant[i]);
	restdetails[i].distance=$scope.findDistance($scope.lat,$scope.long,response.data.Restaurant[i].latitude,response.data.Restaurant[i].longitude);
    }
    
$rootScope.resname1=restdetails;
//console.log($rootScope.resname1);
alert($rootScope.resname1[0].distance);

      $scope.modal.hide();
      //alert("hello");
      $state.go("menu.nearestRestaurants");
      }
      else {
          alert('Please Check');
          $state.go("menu.nearestRestaurants");}
      });
    });
  
      $scope.modal.show();
   };
   $scope.filtername=function(){
        alert("ghdf");
        $scope.openModal();
        
        $scope.floc="name";
        console.log($scope.floc);
        
         
$scope.closeModal1();
//console.log($scope.name1);
        
    };
    $scope.filterev=function(){
        alert("ghdf");
        $scope.openModal();
        
        $scope.floc="review_avg";
        
         
$scope.closeModal1();
console.log($scope.name1);
        
    };
   
    $scope.filter=function(){
    alert("hhhhh");
    var restdetails=[];
  
      alert("hello");
        var posOptions = {timeout: 10000, enableHighAccuracy: true};
        
  $cordovaGeolocation.getCurrentPosition(posOptions)
    .then(function(position) {
        //console.log(position);
        //console.log('position');
     $rootScope.lat  = position.coords.latitude;
      $rootScope.long = position.coords.longitude;
      $window.localStorage.setItem('lat',JSON.stringify($rootScope.lat));
       $window.localStorage.setItem('long',JSON.stringify($rootScope.long));
      $scope.coords=position.coords;
        $scope.restdata ={data:{
   Restaurant:{latitude:$rootScope.lat,longitude:$rootScope.long
  }
        }};
        console.log($scope.restdata);
        
       
   $http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/restaurants/restaurantslist/',$scope.restdata).success(function(response){
      console.log(response) ;
      if(response.isSuccess==="true"){
          $rootScope.resname1=response.data.Restaurant;
          console.log($rootScope.resname1);
     
      $scope.lat=$window.localStorage.getItem('lat');
       $scope.long=$window.localStorage.getItem('long');
      for(var i=0; i<response.data.Restaurant.length; i++){
          restdetails.push(response.data.Restaurant[i]);
	restdetails[i].distance=$scope.findDistance($scope.lat,$scope.long,response.data.Restaurant[i].latitude,response.data.Restaurant[i].longitude);
    }
    
$rootScope.resname1=restdetails;
//console.log($rootScope.resname1);
alert($rootScope.resname1[0].distance);
//console.log($rootScope.resname1.review_avg);
$scope.floc="distance";


console.log($scope.floc);
      $scope.closeModal1();
      alert("hello");
      $state.go("menu.nearestRestaurants");
      }
      else {
          alert('Please Check');
          $state.go("menu.nearestRestaurants");}
      });
    });
  

    
//    $window.location.reload();
//    $window.localStorage.setItem('floc',JSON.stringify($rootScope.dis));
//    $rootScope.floc="distance";
//    $scope.openModal();
   
};
  $scope.closeModal = function() {
       alert("geygfde");
       console.log($scope.data.address);
      
        $scope.data = {
                          
                        address:$scope.data.address
                     };
        console.log($scope.data); 
           $http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/restaurants/restaurantslistbyadd',$scope.data)
                     .success(function(response){
                        console.log(response);
                $rootScope.resname1  = response.data.Restaurant;
                               console.log($rootScope.resname1);
                                $scope.modal.hide();
                                
                                
                                //$state.go('menu.nearRestaurants');
                        });

                    };


   //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.modal.remove();
   });
	
   // Execute action on hide modal
   $scope.$on('modal.hidden', function() {
      // Execute action
   });
	
   // Execute action on remove modal
   $scope.$on('modal.removed', function() {
      // Execute action
   });
   
   // For Filtr Tab
   $ionicModal.fromTemplateUrl('templates/filter.html', {
      scope: $scope,
      animation: 'slide-in-up',
   }).then(function(modal) {
      $scope.modal1 = modal;
   });
   
   $scope.closeModal1 = function() {
      $scope.modal1.hide();
   };

})

.controller('favoritesCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('mapCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('restaurantDetailsCtrl',function ($scope, $stateParams, $ionicScrollDelegate,$state,$rootScope,$http,$window) {
   console.log($stateParams.restid);
   console.log($stateParams.dis);
  
     $rootScope.dis=$stateParams.dis;
//    console.log( $rootScope.dis);
   
    $scope.rdata={
            Restaurant:{
                id:$stateParams.restid
            }};
            
      
        $http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/restaurants/restaurantbyid',$scope.rdata)
                .success(function(response){
                    console.log(response);
            
            if(response.isSucess == "true"){
              $rootScope.rest_detail = response.data;
            }
        }
                
                );
    
        
        $state.go("menu.restaurantDetails");

  var el = document.getElementById("div1");
 


  $scope.scrollEvent = function() {
	  
  $scope.scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
  if ($scope.scrollamount > 180) {
    $scope.$apply(function() {
		el.classList.remove("map_header");
       
    });
  } else {
    $scope.$apply(function() {
		el.className += " map_header";
      
    });
  }
};
  
  

// Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };


$scope.groups = [];
  for (var i=0; i<1; i++) {
    $scope.groups[i] = {
      name: i,
      items: [],
      show: false
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    group.show = !group.show;
  };
  $scope.isGroupShown = function(group) {
    return group.show;
  };


})

.controller('galleryCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('galleryFullCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('historyCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('discoverCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('splitbillCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('profileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('reservationCtrl', ['$scope','$state', '$stateParams', '$ionicScrollDelegate','$ionicPopup', '$timeout', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state, $stateParams, $ionicScrollDelegate,  $ionicPopup, $timeout) {

  var el = document.getElementById("div2");


  $scope.scrollEvent = function() {
	  
  $scope.scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
  if ($scope.scrollamount > 180) {
    $scope.$apply(function() {
		el.classList.remove("map_header");
       console.log('1');
    });
  } else {
    $scope.$apply(function() {
		el.className += " map_header";
      console.log('2');
    });
  }
};



   // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Consume Ice Cream',
       template: 'Are you sure you want to eat this ice cream?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
		 $state.go('menu.checkout');
       } else {
         console.log('You are not sure');
       }
     });
   };

   // An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };

}])


.controller('menuFoodCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('menuFood2Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('mainMenuCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state) {
  


})
.controller('mainMenu2Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$http,$state,$rootScope) {

var cat = [];
$scope.restid=$stateParams.restid;
console.log($scope.restid);
$scope.rdata={
    Restaurant:{
       id: $scope.restid
    }
};
console.log($scope.rdata);
$http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/restaurants/getresmenu/', $scope.rdata).success(function(response)
{
    console.log(response);
    
    $rootScope.resmenu= response.data.cat;

    $state.go('menu.mainMenu2');
});
  
})

.controller('menuItemsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('menuItems2Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$rootScope,$http) {
    $rootScope.id=$stateParams.dishid;
    $rootScope.restid=$stateParams.restid;
   
    console.log($stateParams.dishid);
    return false;
    $scope.cdata={
        Restaurant:{
            dishid:  $rootScope.id,
            id:  $rootScope.restid
        }
    };
    console.log($scope.cdata);

$http.post('http://rajdeep.crystalbiltech.com/cart_new/custom_cart/api/products/getproductbyid',$scope.cdata)
//        .success(function(response)
//{
//    console.log(response);
//});
})




.controller('cartCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('cart2Ctrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])


.controller('checkoutCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])


.controller('paymentCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])


.controller('confirmationCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('selectOptionCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])








  



 
 

 