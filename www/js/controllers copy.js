
angular.module('app.controllers', ['ngCordova']);

 function paymentInformationsCtrl($scope, $state, $rootScope,$window,$http,$ionicLoading,Base_URL) {
     
    $scope.data = {};
    var payment_app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    payment_app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {

    // start to initialize PayPalMobile library
      payment_app.initPaymentUI();
    
  },
  initPaymentUI: function() { 
    var clientIDs = {
      "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
      "PayPalEnvironmentSandbox": "ashutosh@avainfotech.com"
    };
    PayPalMobile.init(clientIDs, payment_app.onPayPalMobileInit);
  },
   onSuccesfulPayment: function(payment) {
      
       alert("payment success: " + JSON.stringify(payment, null, 4));
     console.log("payment success: " + JSON.stringify(payment, null, 4));
          $rootScope.paymentstatus= JSON.stringify(payment.response.state);
          alert($rootScope.paymentstatus);
           
           
         
          
           $rootScope.paymentId=JSON.stringify(payment.response.id);
           alert($rootScope.paymentId);
           $rootScope.sesn_id= JSON.parse($window.localStorage.getItem("randomid")) ;
           //alert($rootScope.sesn_id);
           $rootScope.usr_id= JSON.parse($window.localStorage.getItem("user_id")) ;   
           //alert($rootScope.usr_id);
           $rootScope.billing_address= JSON.parse(localStorage.getItem('billing_address'));
           alert($rootScope.billing_address);
//           $rootScope.address2= JSON.parse(localStorage.getItem('address2')) ;
          $rootScope.last_total= JSON.parse($window.localStorage.getItem('subtotal1')) ;
          //alert($rootScope.last_total);
          $rootScope.notes= JSON.parse($window.localStorage.getItem('note1'));//alert($rootScope.notes);
          $rootScope.cart=JSON.parse($window.localStorage.getItem('cart_data')) ;//alert($rootScope.cart);
             $scope.all ={
               User:{
               id:$rootScope.usr_id,
               snid:$rootScope.sesn_id
              },products:{
               prod:$rootScope.cart
              },address:{
               billing:$rootScope.billing_address,
               shipping:$rootScope.billing_address
              },payment:{
               mode:"paypal",
              // mode_of_order:"delivery",
               total:$rootScope.last_total
              }, delivery:{
                 status:0
              },Table:{
                  no:"0"
              },paypal:{
                  status:$rootScope.paymentstatus,
                  paymentid:$rootScope.paymentId
              },
              notes:{
                  notes:"null"
              }
                  
              };
              $ionicLoading.show();
      
//              alert(JSON.stringify($scope.all));
//              //console.log($scope.all);
   
   $http.post(Base_URL+'api/shop/checkout',$scope.all).success(function(response){
    // alert("235668");
    console.log(response);
    alert(JSON.stringify(response));
    if(response.error == "0")
    {
        $ionicLoading.hide();
      alert(JSON.stringify(response ));
 //        alert(JSON.parse(response ));
 
 
   $window.localStorage.setItem('order_summery',JSON.stringify(response.data.OrderItem));
   $rootScope.oooo=JSON.parse(localStorage.getItem('order_summery'));
 //  alert("test");
 //  alert(JSON.stringify($rootScope.oooo));
  // $window.localStorage.setItem('order',JSON.stringify(response.data));
  $state.go("menu.confirmation");
  $window.localStorage.removeItem('cart_data');
  $window.localStorage.removeItem('subtotal');
  
 //     alert("1");
  }else{
      alert("error");
  }
   });

     } ,
  onAuthorizationCallback: function(authorization) {
    alert("payment success: " + JSON.stringify(authorization, null, 4));
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
  },

  createPayment: function() { 
  

      //alert("ceate payment");
  //alert(localStorage.getItem('testdata'));
//$rootScope.subtotal=localStorage.getItem('testdata');
 //alert($rootScope.subtotal);
   //var checkout_total_price = JSON.parse(localStorage.getItem(""));
       var price =JSON.parse($window.localStorage.getItem('subtotal1'));
  // //  alert(checkout_total_price);
       var paymentDetails = new PayPalPaymentDetails(price);
      var payment = new PayPalPayment(price, "USD", "Total", "Sale",paymentDetails);
      alert(JSON.stringify(payment));
      return payment;
   // alert("payment success: " + JSON.stringify(authorization, null, 4));
    
   
    // for simplicity use predefined amount
    // var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
    // var payment = new PayPalPayment("50.00", "USD", "Awesome Sauce", "Sale",
    //   paymentDetails);
   //return payment;
  },
  configuration: function() { 
     // alert("22");
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
  },
  onPrepareRender: function() {
    //  alert("33")
    // buttons defined in index.html
    //  <button id="buyNowBtn"> Buy Now !</button>
    //  <button id="buyInFutureBtn"> Pay in Future !</button>
    //  <button id="profileSharingBtn"> ProfileSharing !</button>
    var buyNowBtn = document.getElementById("buyNowBtn");
    // var buyInFutureBtn = document.getElementById("buyInFutureBtn");
    // var profileSharingBtn = document.getElementById("profileSharingBtn");

    buyNowBtn.onclick = function(e) {
      
      //  alert("i m clicked");
      // single payment
      PayPalMobile.renderSinglePaymentUI(payment_app.createPayment(), payment_app.onSuccesfulPayment,
        payment_app.onUserCanceled);
    };

    // buyInFutureBtn.onclick = function(e) {
    //   // future payment
    //   PayPalMobile.renderFuturePaymentUI(payment_app.onAuthorizationCallback, payment_app.onUserCanceled);
    // };

    // profileSharingBtn.onclick = function(e) {
    //   // profile sharing
    //   PayPalMobile.renderProfileSharingUI(["profile", "email", "phone",
    //     "address", "futurepayments", "paypalattributes"
    //   ], payment_app.onAuthorizationCallback, payment_app.onUserCanceled);
    // };
  },
  onPayPalMobileInit: function() {
      //alert("55");
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", payment_app.configuration(),
      payment_app.onPrepareRender);
  },
  onUserCanceled: function(result) {
       // alert("66");
   // alert(result); 
  alert("user canceled");
   $window.localStorage.removeItem('cart_data');
    $state.go('menu.search_location');
  }
}   ;
          payment_app.initialize();


}

function paymentInformations2Ctrl($scope, $state, $rootScope,$window,$http,$ionicLoading,Base_URL,$ionicLoading) {
     
    $scope.data = {};
    var payment_app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    payment_app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {

    // start to initialize PayPalMobile library
      payment_app.initPaymentUI();
    
  },
  initPaymentUI: function() { 
    var clientIDs = {
      "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
      "PayPalEnvironmentSandbox": "ashutosh@avainfotech.com"
    };
    PayPalMobile.init(clientIDs, payment_app.onPayPalMobileInit);
  },
   onSuccesfulPayment: function(payment) {
      
//      
 var paymentstatus = JSON.stringify(payment.response.state);
  var paymentst = paymentstatus.replace(/\,/g,"");
 alert(paymentst);
  var price = JSON.parse(localStorage.getItem("walletpayment1"));
  alert(price);
 var paymentid = JSON.stringify(payment.response.id);
 var paymenti = paymentid.replace(/\,/g,"");
 alert(paymenti);
 var user_id=$window.localStorage.getItem("user_id");  alert(user_id);
//  var tableid = JSON.parse($window.localStorage.getItem('tableid'));
  $scope.tdata ={
  user :{
    id:user_id
   },
   paypal:{
    total:price,
    paymentid:paymentid,
    status:paymentst
      } 
   };
      
   //alert(JSON.parse($scope.tdata));
//      
//      
//      
//      
//       
alert("bbbb");
//           
alert($scope.tdata);
  $ionicLoading.show();
   $http.post(Base_URL+'api/users/wallet',$scope.tdata).success(function(response){
   alert("235668");
    console.log(response);
    $ionicLoading.hide();
   
    if(response.sucsess=="true")
    {
        alert(response);
        alert("ddfhfhh");
        $window.location.reload();
        //var payment=response;
  //  alert(JSON.stringify(response));
    //$window.localStorage.setItem('order',JSON.stringify(response));
    //alert(JSON.parse($window.localStorage.getItem('order')));
  /// $state.go('menu.nearestRestaurants');
    }
    else
    {
        alert(response.msg);
    }
    
   });

     },
  onAuthorizationCallback: function(authorization) {
    alert("payment success: " + JSON.stringify(authorization, null, 4));
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
  },

  createPayment: function() { 
  
alert("gm");
//alert(JSON.parse ( $window.localStorage.getItem('walletpayment1')));
      //alert("ceate payment");
  //alert(localStorage.getItem('testdata'));
//$rootScope.subtotal=localStorage.getItem('testdata');
 //alert($rootScope.subtotal);
   //var checkout_total_price = JSON.parse(localStorage.getItem(""));
     var price = JSON.parse(localStorage.getItem("walletpayment1"));
//  // //  alert(checkout_total_price);
     var paymentDetails = new PayPalPaymentDetails(price);
     var payment = new PayPalPayment(price, "USD", "Total", "Sale",paymentDetails);
     alert(JSON.stringify(payment));
     
  
    return payment;
   // alert("payment success: " + JSON.stringify(authorization, null, 4));
    
   
    // for simplicity use predefined amount
    // var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
    // var payment = new PayPalPayment("50.00", "USD", "Awesome Sauce", "Sale",
    //   paymentDetails);
   //return payment;
  },
  configuration: function() { 
     // alert("22");
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
  },
  onPrepareRender: function() {
    //  alert("33")
    // buttons defined in index.html
    //  <button id="buyNowBtn"> Buy Now !</button>
    //  <button id="buyInFutureBtn"> Pay in Future !</button>
    //  <button id="profileSharingBtn"> ProfileSharing !</button>
    var buyNowBtnw = document.getElementById("buyNowBtnw");
    
    
    // var buyInFutureBtn = document.getElementById("buyInFutureBtn");
    // var profileSharingBtn = document.getElementById("profileSharingBtn");

    buyNowBtnw.onclick = function(e) {
      alert($scope.data.firstname);
      var walletpayment=$scope.data.firstname;
      alert(walletpayment);
      $window.localStorage.setItem('walletpayment1',JSON.stringify(walletpayment));
      //  alert("i m clicked");
      // single payment
      PayPalMobile.renderSinglePaymentUI(payment_app.createPayment(), payment_app.onSuccesfulPayment,
        payment_app.onUserCanceled);
    };

    // buyInFutureBtn.onclick = function(e) {
    //   // future payment
    //   PayPalMobile.renderFuturePaymentUI(payment_app.onAuthorizationCallback, payment_app.onUserCanceled);
    // };

    // profileSharingBtn.onclick = function(e) {
    //   // profile sharing
    //   PayPalMobile.renderProfileSharingUI(["profile", "email", "phone",
    //     "address", "futurepayments", "paypalattributes"
    //   ], payment_app.onAuthorizationCallback, payment_app.onUserCanceled);
    // };
  },
  onPayPalMobileInit: function() {
      //alert("55");
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", payment_app.configuration(),
      payment_app.onPrepareRender);
  },
  onUserCanceled: function(result) {
       // alert("66");
   // alert(result); 
  alert("user canceled");
   $window.localStorage.removeItem('cart_data');
   // $state.go('menu.confirmation1');
  }
};
          payment_app.initialize();


}


function paymentInformations1Ctrl($scope, $state, $rootScope,$window,$http,Base_URL,$ionicLoading) {
     
    $scope.data = {};
    var payment_app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    payment_app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {

    // start to initialize PayPalMobile library
      payment_app.initPaymentUI();
    
  },
  initPaymentUI: function() { 
    var clientIDs = {
      "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
      "PayPalEnvironmentSandbox": "ashutosh@avainfotech.com"
    };
    PayPalMobile.init(clientIDs, payment_app.onPayPalMobileInit);
  },
   onSuccesfulPayment: function(payment) {
      
var user_id=$window.localStorage.getItem("user_id");    
  var paymentstatus = JSON.stringify(payment.response.state);
  var paymentst = paymentstatus.replace(/\,/g,"");
  alert(paymentst);
   var price = "null";
  alert(price);
  var paymentid = JSON.stringify(payment.response.id);
  var paymenti = paymentid.replace(/\,/g,"");
  alert(paymenti);
  alert(JSON.parse($window.localStorage.getItem('tableid1')));
  var tableid = JSON.parse($window.localStorage.getItem('tableid1'));
  alert(tableid);
  
  $scope.tdata ={
   Table:{
    id:tableid
   },
   paypal:{
    total:price,
    paymentid:paymentid,
    status:paymentst
      }, 
   };
   $ionicLoading.show();
 //alert(JSON.stringify($scope.tdata));
   $http.post(Base_URL+'api/restaurants/advancepayment',$scope.tdata).success(function(response){
// alert("235660008");
    console.log(response);
    $ionicLoading.hide();
    if(response.isSuccess=="true")
    {
        var payment=response;
  //  alert(JSON.stringify(response));
    $window.localStorage.setItem('order',JSON.stringify(response));
  // alert(JSON.parse ( $window.localStorage.getItem('order')));
   $state.go('menu.confirmation1');
   $window.localStorage.removeItem('cartdine');
   $window.localStorage.removeItem('carttotaldine');
   
    }
    else
    {
        alert("error");
    }
    
   });

     },
  onAuthorizationCallback: function(authorization) {
    alert("payment success: " + JSON.stringify(authorization, null, 4));
    console.log("authorization: " + JSON.stringify(authorization, null, 4));
  },

  createPayment: function() { 
  
alert("gm");
      //alert("ceate payment");
  //alert(localStorage.getItem('testdata'));
//$rootScope.subtotal=localStorage.getItem('testdata');
 //alert($rootScope.subtotal);
   //var checkout_total_price = JSON.parse(localStorage.getItem(""));
       var price =JSON.parse($window.localStorage.getItem('carttotaldine'));
  // //  alert(checkout_total_price);
       var paymentDetails = new PayPalPaymentDetails(price);
      var payment = new PayPalPayment(price, "USD", "Total", "Sale",paymentDetails);
      alert(JSON.stringify(payment));
      return payment;
   // alert("payment success: " + JSON.stringify(authorization, null, 4));
    
   
    // for simplicity use predefined amount
    // var paymentDetails = new PayPalPaymentDetails("50.00", "0.00", "0.00");
    // var payment = new PayPalPayment("50.00", "USD", "Awesome Sauce", "Sale",
    //   paymentDetails);
   //return payment;
  },
  configuration: function() { 
     // alert("22");
    // for more options see `paypal-mobile-js-helper.js`
    var config = new PayPalConfiguration({
      merchantName: "My test shop",
      merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
      merchantUserAgreementURL: "https://mytestshop.com/agreement"
    });
    return config;
  },
  onPrepareRender: function() {
    //  alert("33")
    // buttons defined in index.html
    //  <button id="buyNowBtn"> Buy Now !</button>
    //  <button id="buyInFutureBtn"> Pay in Future !</button>
    //  <button id="profileSharingBtn"> ProfileSharing !</button>
    var buyNowBtnt = document.getElementById("buyNowBtnt");
    // var buyInFutureBtn = document.getElementById("buyInFutureBtn");
    // var profileSharingBtn = document.getElementById("profileSharingBtn");

    buyNowBtnt.onclick = function(e) {
      
      //  alert("i m clicked");
      // single payment
      PayPalMobile.renderSinglePaymentUI(payment_app.createPayment(), payment_app.onSuccesfulPayment,
        payment_app.onUserCanceled);
    };

    // buyInFutureBtn.onclick = function(e) {
    //   // future payment
    //   PayPalMobile.renderFuturePaymentUI(payment_app.onAuthorizationCallback, payment_app.onUserCanceled);
    // };

    // profileSharingBtn.onclick = function(e) {
    //   // profile sharing
    //   PayPalMobile.renderProfileSharingUI(["profile", "email", "phone",
    //     "address", "futurepayments", "paypalattributes"
    //   ], payment_app.onAuthorizationCallback, payment_app.onUserCanceled);
    // };
  },
  onPayPalMobileInit: function() {
      //alert("55");
    // must be called
    // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
    PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", payment_app.configuration(),
      payment_app.onPrepareRender);
  },
  onUserCanceled: function(result) {
       // alert("66");
   // alert(result); 
  alert("user canceled");
   $window.localStorage.removeItem('cart_data');
    $state.go('menu.confirmation1');
  }
};
          payment_app.initialize();


}
//paymentInformationsCtrl.$inject = ['$scope'];
angular.module('app.controllers', ['ionic'])
.controller('paymentInformationsCtrl', paymentInformationsCtrl) 
//angular.module('app.controllers', ['ngCordova'])
.controller('paymentinformation1Ctrl',paymentInformations1Ctrl)// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
.controller('walletCtrl',
function ($scope, $stateParams, $http, $state,$ionicLoading,Base_URL,$window,$cordovaInAppBrowser,$rootScope,$ionicPlatform){
//var paymentstatus = JSON.stringify(payment.response.state);
  //var paymentst = paymentstatus.replace(/\,/g,"");
// alert(paymentst);
$scope.walletcc=function(){
   $scope.price=$scope.data.firstname
 var uid=$window.localStorage.getItem("user_id"); 
  $scope.tdata ={
 user :{
    uid:uid
   },
   creditcard:{
    total:$scope.price,
    paymentid:"123",
    status:1
      } 
   };
         
//alert("bbbb");         
//alert($scope.tdata);
  $ionicLoading.show();
   $http.post(Base_URL+'api/users/walletcc',$scope.tdata).success(function(response){
  // alert("235668");
    console.log(response);
    $ionicLoading.hide();
    $scope.url=response.data[0];
    var options = {
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no'
    };
     $cordovaInAppBrowser.open($scope.url, '_blank', options)
      .then(function(event) {
        //  alert("hello");
       //  alert(event);
      })	
      .catch(function(event) {
        //  alert("hii");
       // alert(event);
      });
        $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
          if (event.url.match('/wallet')){
          $cordovaInAppBrowser.close();
         
          $state.go("menu.wallet");
           $window.location.reload();
          }
  });

})
};
    $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
            $state.go('menu.nearestRestaurants')
        }
    }, 1000);
              

})

    
 .controller('walletpaymentCtrl',
 function paymentwalletCtrl($scope, $state, $rootScope,$window,$http,$ionicLoading,Base_URL,$ionicPopup) {
     
       $scope.paymentwalletCtrl=function()
       {
            if($window.localStorage.getItem('carddatepick') == "undefined")
        {
                 var datemq = $ionicPopup.show({
                             title:'Select date and time for Pickup',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              datemq.close();
                             
                                            }}
                                        ]
                                      });
        }else{
        $rootScope.sesn_id= JSON.parse($window.localStorage.getItem("randomid")) ;
        $rootScope.restid= JSON.parse($window.localStorage.getItem("rest_id")) ;
       // alert( $rootScope.restid);
           //alert($rootScope.sesn_id);
           $rootScope.usr_id= JSON.parse($window.localStorage.getItem("user_id")) ;   
           //alert($rootScope.usr_id);
           $rootScope.billing_address= JSON.parse(localStorage.getItem('billing_address'));
         //alert($rootScope.billing_address);
//           $rootScope.address2= JSON.parse(localStorage.getItem('address2')) ;
//console.log($window.localStorage.getItem('wallet_payment'));
          $rootScope.last_totalpick= JSON.parse($window.localStorage.getItem('subtotal1')) ;
        // alert($rootScope.last_totalpick);
          $rootScope.timep= JSON.parse($window.localStorage.getItem('timecardpick'));
          $rootScope.datep= JSON.parse($window.localStorage.getItem('carddatepick'));
          //alert($rootScope.notes);
          $rootScope.cart=JSON.parse($window.localStorage.getItem('cart_data')) ;//alert($rootScope.cart);
             $scope.all ={
               User:{
               id:$rootScope.usr_id,
               snid:$rootScope.sesn_id
              },products:{
               prod:$rootScope.cart
              },address:{
               billing:$rootScope.billing_address,
               shipping:$rootScope.billing_address
              },payment:{
               mode:"wallet",
              // mode_of_order:"delivery",
               total:$rootScope.last_totalpick,
               pickupdate:$rootScope.datep,
               pickuptime:$rootScope.timep
              }, delivery:{
                 status:1
              },Table:{
                  no:"0"
              },paypal:{
                  status:"$rootScope.paymentstatus",
                  paymentid:"$rootScope.paymentId"
              },
              notes:{
                  notes:"null"
              },
              restautant:{
                  rest_id:$rootScope.restid
              }
                  
              };
              $ionicLoading.show();
      
           //  alert(JSON.stringify($scope.all));
            console.log($scope.all);
  
   $http.post(Base_URL+'api/shop/walletpayment',$scope.all).success(function(response){
    // alert($rootScope.loyalty_points1);
     $ionicLoading.hide();
    console.log($rootScope.loyalty_points1)
    console.log(response);
     if(response.error == "0")
    {
        $rootScope.loyalty_points1=parseInt($rootScope.loyalty_points1)-parseInt($rootScope.last_totalpick);
  //  alert($rootScope.loyalty_points1);
      console.log($rootScope.loyalty_points1)
//    $window.localStorage.setItem('orderwallet',JSON.stringify(response.data));
//    console.log($window.localStorage.getItem('orderwallet'));
    $state.go("menu.confirmation");
    }else{
//     alert(response.isSucess);
     var myPopup = $ionicPopup.show({
                    template: response.isSucess,
                    scope: $scope,
                    cssClass: 'value_sec',
                    buttons: [
                      { text: '<span class="oky">Okay</span>',
                      onTap: function(e) {
                          myPopup.close();
                        }}
                    ]
                  });
     //$state.go("menu.paymentInformations");
    } 
    });
    }
    };
    })
     
     .controller('walletpayment1Ctrl',
         function paymentwalletCtrl($scope, $state, $rootScope,$window,$http,$ionicLoading,Base_URL,$ionicPopup) {
     
       $scope.paymentwalletCtrl=function()
       {
       $rootScope.sesn_id= JSON.parse($window.localStorage.getItem("randomid")) ;
           //alert($rootScope.sesn_id);
           $rootScope.usr_id= JSON.parse($window.localStorage.getItem("user_id")) ;   
           //alert($rootScope.usr_id);
          // $rootScope.billing_address= JSON.parse(localStorage.getItem('billing_address'));
           //alert($rootScope.billing_address);
//           $rootScope.address2= JSON.parse(localStorage.getItem('address2')) ;
 
          $rootScope.last_total= JSON.parse($window.localStorage.getItem('carttotaldine')) ;
       //  alert($rootScope.last_total);
          $rootScope.notes= JSON.parse($window.localStorage.getItem('note1'));//alert($rootScope.notes);
          $rootScope.cart=JSON.parse($window.localStorage.getItem('cartdine')) ;
          $rootScope.billing_address= JSON.parse(localStorage.getItem('address'));
         // alert($rootScope.billing_address);
          //alert($rootScope.cart);
         
          var tableid =JSON.parse($window.localStorage.getItem('tableid1'));
      //   alert(tableid);
             $scope.all ={
               User:{
               id:$rootScope.usr_id,
               snid:$rootScope.sesn_id
              },products:{
               prod:$rootScope.cart
              },address:{
               billing:$rootScope.billing_address,
              // shipping:$rootScope.billing_address
              },payment:{
               mode:"wallet",
              // mode_of_order:"delivery",
               total:$rootScope.last_total
              },
//              delivery:{
//                 dl_status:0
//              },
              Table:{
                  no:tableid
              },
              
              creditcard:{
                  status:"0"
                  },
              notes:{
                  notes:""
              }
              
                  
              };
              console.log($scope.all);
              
      
            // alert(JSON.stringify($scope.all));
        console.log($scope.all);
  $ionicLoading.show();
   $http.post(Base_URL+'api/shop/walletpaymentdinein',$scope.all).success(function(response){
    // alert("235668");
    console.log(response);
   // alert($rootScope.loyalty_points1);
  
   // alert($rootScope.loyalty_points1);
    console.log(response);
   // alert(response);
     $ionicLoading.hide();
//       $window.localStorage.setItem('orderwallet',JSON.stringify(response.data));
     if(response.error == "0")
    {
       $rootScope.loyalty_points1=parseInt($rootScope.loyalty_points1)-parseInt($rootScope.last_total);
//    $window.localStorage.setItem('orderwallet',JSON.stringify(response.data));
//    console.log($window.localStorage.getItem('orderwallet'));
    $state.go("menu.confirmation");
    }else{
//     alert(response.isSucess);
     var myPopup = $ionicPopup.show({
                    template: response.isSucess,
                    scope: $scope,
                    cssClass: 'value_sec',
                    buttons: [
                      { text: '<span class="oky">Okay</span>',
                      onTap: function(e) {
                          myPopup.close();
                        }}
                    ]
                  });
     //$state.go("menu.paymentInformations");
    } 
   });
       };
 })
    
    
        .controller('sliderCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams, $state, $ionicSlideBoxDelegate,$window,$ionicViewService,$ionicPlatform,$ionicPopup,$location,$ionicHistory) {
             
              $ionicPlatform.registerBackButtonAction(function(event) {
                  
                             if (true) { // your check here
                             //alert('abfdhc'
                             ////var path_value = $location.path()
                                //alert(path_value)
                            
				$ionicPopup.confirm({
					title: 'DROPIN warning',
					template: 'Are you sure you want to exit?',
                                        cssClass: 'value_sec',
                                        }).then(function(res) {
					if (res) {
						navigator['app'].exitApp(); 
					  //ionic.Platform.exitApp();
					}
                                     })
                                
                            }
                        }, 1000);

// Called to navigate to the main app
                $scope.startApp = function () {
                    //$state.go('main');
                };
                $scope.next = function () {
                    $ionicSlideBoxDelegate.next();
                };
                $scope.previous = function () {
                    $ionicSlideBoxDelegate.previous();
                };

                // Called each time the slide changes
                $scope.slideChanged = function (index) {
                    $scope.slideIndex = index;
                };
                
                            
                
                if($window.localStorage.getItem('user_id')){
                    
//            $ionicViewService.nextViewOptions({
//            disableAnimate: true,
//             disableBack: false
//              });
              $window.localStorage.setItem('count',JSON.stringify(1));
                $state.go('menu.nearestRestaurants');
              }
            })

        .controller('createProfileCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $http, $state,$ionicLoading,Base_URL,$window,$ionicPopup,$ionicPlatform) {
                    $scope.data = {};
                   

                    $scope.profile = function () {
                          if ($scope.data.password == $scope.data.cpassword) {
                             //alert('asdfasdfasd');
                       // alert("SIGNUP SUCCESSFULL");
                        /* $scope.name=$scope.data.name,
                         console.log($scope.name);*/
                        $ionicLoading.show();
                        //alert("hello");
                        $http.post(Base_URL+'api/users/registration',
                                {
                                    name: $scope.data.name,
                                    phone: $scope.data.phone,
                                    email: $scope.data.email,
                                    password: $scope.data.password
                                })
                                .success(function (response) {
                                    //alert("hello1");
                                    $ionicLoading.hide();
                                    console.log(response);
                                    $scope.response = response.msg;
                                      console.log($scope.response);
                                 if (response.status === true)
                                    {
                                    
                                      $window.localStorage.setItem("user_registration_email",JSON.stringify(response.email));
                                       //console.log($window.localStorage.getItem("user_registration_email"));
                                       var myPopup = $ionicPopup.show({
                      template:$scope.response,
                      subTitle: 'Please check your email for verification code',
                      scope: $scope,
                      buttons: [
                      { text: '<span class="oky">Okay</span>',
                       onTap: function(e) {
                       myPopup.close();
                       $state.go('menu.finalStep', {reload: true});
                      }}
                      ]
                   });
                    $window.localStorage.setItem("user_registration_email",JSON.stringify(response.email));
                    console.log($window.localStorage.getItem('user_registration_email'));
                   // $state.go('menu.finalStep', {reload: true});
                }else{
                    var myPopup = $ionicPopup.show({
                      template: $scope.response,
                         scope: $scope,
                         cssClass: 'value_sec',
                      buttons: [
                      { text: 'Okay',
                       onTap: function(e) {
                       myPopup.close();
                       
                      }}
                      ]
                   });
                    $state.go('menu.createProfile')
                }
                                       
//                                        alert(response.msg);
//                                        $state.go('menu.finalStep');
//                                    } else {
//                                        alert(response.msg);
//                                        $state.go('menu.createProfile');
//                                    }
                                });
                            }
                            else{
                       var myPopup = $ionicPopup.show({
                     // template:$scope.response,
                      subTitle: 'Password Mismatch',
                      scope: $scope,
                      cssClass: 'value_sec',
                      buttons: [
                      { text: '<span class="oky">Okay</span>',
                       onTap: function(e) {
                       myPopup.close();
                                }}
                        ]
                    });  // alert("Password Mismatch");
                }
            }
             $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
        navigator['app'].exitApp(); 
           // $state.go('menu.slider',{reload:true})
        }
    }, 1000);
            
        })

        .controller('step1Ctrl',function ($ionicPlatform, $scope, $http, $window,$cordovaGeolocation, $state,$ionicHistory,$ionicPopup,$rootScope,$ionicLoading,$ionicViewService,Base_URL) {
            $scope.data = {};
    
    
 $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
        navigator['app'].exitApp(); 
           // $state.go('menu.slider',{reload:true})
        }
    }, 1000);   
              if($window.localStorage.getItem('user_id')){
             $ionicViewService.nextViewOptions(
                     {
             disableAnimate: true,
             disableBack: true
              });
              //$window.localStorage.setItem('count',JSON.stringify(1));
                $state.go('menu.nearestRestaurants');
              }else{
                    $scope.data = {};
  
                    $scope.mobile = function () {
                    //    alert("bhumika");
                         //$window.localStorage.removeItem('user_id');
                    //alert("sucessfull");
                    $ionicLoading.show();
                        var postdata = {
                            user:{
                                 username: $scope.data.email,
                                 password: $scope.data.password
                            }
                        }
                        console.log(postdata);
                       // alert("nizam");
                        $http.post(Base_URL+'api/users/loginwork',postdata)
                                .success(function (response) {
                                  // alert("nizam1");
                                     $ionicLoading.hide();
                                     console.log(response);
                                     if(response.status == true)
                                     {
                                   //  console.log(response.data.User.active);
                                    if (response.data.User.active == "1")
                                    {
                                        console.log(response.status);
                                        $window.localStorage.setItem("user_id", response.data.User.id);
                                    console.log($window.localStorage.getItem("user_id"));
                                    $scope.randomid = Math.floor(Math.random() * 15252522555);
                                    $window.localStorage.setItem("randomid",  $scope.randomid);
                                    $window.localStorage.setItem('User_Data', JSON.stringify({user_id: response.data.User.id, uniqueID: $scope.randomid}));
                                    console.log($window.localStorage.getItem('User_Data'));
                                        ///alert('sign in successful');
                                        //$scope.data={};
                                        
   console.log(JSON.parse($window.localStorage.getItem('User_Data')));
$rootScope.uid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
console.log($rootScope.uid);
  if($rootScope.uid){

  $scope.cddata={
      user:{
          id:$rootScope.uid
      }
  };
  console.log($scope.cddata);
  $http.post(Base_URL+'api/users/user',$scope.cddata).success(function(response)
  {
  // alert("edit");
   console.log(response);
   if(response.msg=="Success")
   {
      // location.reload();
    $window.localStorage.setItem('count',JSON.stringify(1));
    $window.localStorage.setItem('profile_data', JSON.stringify({profilename: response.data[0].User.name, loyalty_points1: response.data[0].User.loyalty_points,profileimage:response.data[0].User.image, profilephone:response.data[0].User.phone,profileemail:response.data[0].User.username}));
    $rootScope.loyalty_points1= response.data[0].User.loyalty_points;
    $rootScope.pro_name=response.data[0].User.name;
    $rootScope.pro_image=response.data[0].User.image;
     $rootScope.pro_email=response.data[0].User.username;
      $rootScope.pro_phone=response.data[0].User.phone;
console.log(JSON.parse($window.localStorage.getItem('profile_data')));
  var profile_data1=JSON.parse($window.localStorage.getItem('profile_data'));
  
// $rootScope.profilename=profile_data1.profilename;
//  
// $rootScope.loyalty_points1=profile_data1.loyalty_points1;
 
   }
  })
  }
//  alert('sign in successful');
//   var step1 = $ionicPopup.show({
//                                    template: 'sign in successful',
//                                    scope: $scope,
//                                    cssClass: 'value_sec',
//                                    buttons: [
//                                      { text: '<span class="oky">Okay</span>',
//                                      onTap: function(e) {
//                                          step1.close();
//                                           $state.go('menu.nearestRestaurants',{reload:true});
//                                        }}
//                                    ]
//                                  }); 
                                $state.go('menu.nearestRestaurants',{reload:true});
//  var posOptions = {timeout: 10000, enableHighAccuracy: true};
//  
//$cordovaGeolocation.getCurrentPosition(posOptions)
//
//                                .then(function (position) {
//                                     $state.go('menu.nearestRestaurants',{reload:true});
//                                    },function(err) {
//                                        var step12 = $ionicPopup.show({
//                                    template:"Please ON your Mobile GPS",
//                                    scope: $scope,
//                                    cssClass: 'value_sec',
//                                    buttons: [
//                                      { text: '<span class="oky">Okay</span>',
//                                      onTap: function(e) {
//                                          
//                                        }}
//                                    ]
//                                  });
//                                   // alert(JSON.stringify(err));
//                                })
                    }else {
                         var step12 = $ionicPopup.show({
                                    template: response.msg,
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          step12.close();
                                           $state.go("menu.finalStep")
                                        }}
                                    ]
                                  }); 
                                  //   alert(response.msg)
                     //   $state.go("menu.finalStep")
                        
                    }}else{
                      var step123 = $ionicPopup.show({
                                    template:'Please fill correct details',
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          step123.close();
                                        }}
                                    ]
                                  }); 
                                       // $scope.mobile();
                                       // alert('Please fill correct details');
                                    }
                                });
                    };
                }
            })  
        .controller('finalStepCtrl',function (Base_URL, $scope, $state, $rootScope, $http, $ionicLoading, $window,$ionicPopup) {
        $scope.data= {};

        $scope.email_verification = function(){
            console.log($scope.data);
            $scope.data.email = JSON.parse($window.localStorage.getItem('user_registration_email'));
            //alert(JSON. stringify($scope.data));
            console.log($scope.data);
            $ionicLoading.show();
            $http.post(Base_URL+'api/users/verifyEmail',$scope.data)
                .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == true){
                         var final = $ionicPopup.show({
                                    template:response.msg,
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          final.close();
                                          $state.go("menu.step1");
                                        }}
                                    ]
                                  }); 
                       // alert(response.msg);
                       // $state.go("menu.step1");
                    }else{
                         var final1 = $ionicPopup.show({
                                    template:response.msg,
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          final1.close();
                                        //  $state.go("menu.step1");
                                        }}
                                    ]
                                  }); 
                        //alert(response.msg);
                       // $state.go("menu.nearestRestaurants");
                    }
            });
        }
    })
                 .controller('searchCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$rootScope,$window,$http,$rootScope,$ionicLoading,Base_URL,$ionicPopup, $state) {
              $scope.autocompleteOptions = {
                        componentRestrictions: { country: 'kw' },
                        types: ['geocode']
                    };    
               $scope.search = function () {
                   
                // console.log($scope.data.country);  
                $rootScope.search = $scope.data.city.name;
                console.log($rootScope.search);
                 $ionicLoading.show();
               
                $http.post('https://maps.googleapis.com/maps/api/geocode/json?address=(' + $rootScope.search + ')').success(function (response) {
                    console.log(response);
                     $scope.data.city={}; 
                     $ionicLoading.hide();
                    console.log(response);
var restdetails1=[];
                            $rootScope.lat2 = response.results[0].geometry.location.lat;
                            $rootScope.long2 = response.results[0].geometry.location.lng;
                            $window.localStorage.setItem('search_lat', JSON.stringify($rootScope.lat2));
                            $window.localStorage.setItem('search_long', JSON.stringify($rootScope.long2));
//                            $scope.modal.hide();
                            console.log($window.localStorage.getItem('search_lat'));
                            console.log($window.localStorage.getItem('search_long'));
                            $scope.lat = $window.localStorage.getItem('search_lat');
                            $scope.long = $window.localStorage.getItem('search_long');
                            $scope.restdata = {data: {
                                    Restaurant: {latitude: $scope.lat, longitude: $scope.long
                                    }
                                }};
                            console.log($scope.restdata);
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                        $ionicLoading.hide();
                                console.log(response);
                                    if(response.isSuccess == 'true')
                                    {
                                        $rootScope.Gps = 0;
                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                   restdetails1.push(response.data.Restaurant[i]);
                                   restdetails1[i].distance = $scope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                               }
                             $rootScope.resname1 = restdetails1;
//         console.log($rootScope.res_list);
                                console.log(restdetails1);
                                $state.go("menu.nearestRestaurants");
                                 $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                       // alert("Restaurant types not fetch successfully");
                    }
                })
                            }else{
                                 var final1 = $ionicPopup.show({
                                    template:'There are no Restaurants nearby this city. Select another city..',
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          final1.close();
                                        //  $state.go("menu.step1");
                                        }}
                                    ]
                                  }); 
                                //alert(response.msg)
                            }
                       
                            }); 
                        }); 
               };
             

            })  

        .controller('nearestRestaurantsCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $ionicModal, $state, $rootScope, $cordovaGeolocation, $window, $http,$ionicPopup,$ionicLoading,$ionicViewService,Base_URL,$ionicPlatform,$location,$ionicHistory) {
//           $window.localStorage.setItem('count',JSON.stringify(0));

                        if($window.localStorage.getItem("user_id")){
                            
                          //  alert("lll");
                               $ionicPlatform.registerBackButtonAction(function(event) {
                             if (true) { // your check here
                             //alert('abfdhc'
                             ////var path_value = $location.path()
                                //alert(path_value)
                             if ($location.path() ==='/side-menu21/nearestRestaurants') {
				$ionicPopup.confirm({
					title: 'DROPIN warning',
					template: 'Are you sure you want to exit?',
                                        cssClass: 'value_sec',
                                        }).then(function(res) {
					if (res) {
						navigator['app'].exitApp(); 
					  //ionic.Platform.exitApp();
					}
                                     })
                                }else {
				$ionicHistory.goBack();
                                } 
                            }
                        }, 1000);
                              function deg2rad(deg) {
                        rad = deg * Math.PI / 180; // radians = degrees * pi/180
                        return rad;
                    }


                    // round to the nearest 1/1000
                    function round(x) {
                        return Math.round(x * 1000) / 1000;
                    }

                    $rootScope.findDistance = function (lat, long, lat1, long1) {
                        //alert(lat);
                        var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km, Rm, Rk, frm;

                        var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
                        var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
                        // get values for lat1, lon1, lat2, and lon2
                        t1 = lat;// 30.7206541;
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
                        a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
                        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
                        dm = c * Rm; // great circle distance in miles
                        dk = c * Rk; // great circle distance in km

                        // round the results down to the nearest 1/1000
                        mi = round(dm);
                        km = round(dk);
                        return km;


                    };  
                    $scope.data = [];

                    $ionicModal.fromTemplateUrl('templates/search.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                    });
                    var restdetails = [];
                    var restcountry = [];
                  //$scope.openModal = function () {
                       // alert("hello");
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                       // alert("dkjnvks");
                        $cordovaGeolocation.getCurrentPosition(posOptions)

                                .then(function (position) {

                                    console.log(position);
                            $rootScope.Gps=0;
                                    //  alert("hgdh");
                                    // console.log('position');

                                        $rootScope.lat = position.coords.latitude;
                                        $rootScope.long = position.coords.longitude;
                                        $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                        $window.localStorage.setItem('long', JSON.stringify($rootScope.long));

                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                          
                                        }};
                                    console.log($scope.restdata);

                                     $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        console.log(response);
                                        $ionicLoading.hide();
                                        if (response.isSuccess === "true") {    
                                              $window.localStorage.removeItem('search_lat');
                                              $window.localStorage.removeItem('search_long');
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');

                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                           
                                            }   
                                            $rootScope.resname1 = restdetails;
                                            console.log(response.data.Restaurant[0].typename[0].RestaurantsType.name);
                                            console.log($rootScope.resname1[0].distance);

                                            $scope.modal.hide();
                                            $rootScope.clat =  $scope.lat;
                                    $rootScope.clong = $scope.long;
                                  //  $rootScope.favrest = response.data.favrest;
								
                                    //onsole.log($rootScope.favrest);
                                    $ionicLoading.hide();
                                    console.log($rootScope.clat);
                                    console.log($rootScope.clong);
			var link = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$rootScope.clat+','+$rootScope.clong+'&key=AIzaSyBgdQ9h1BXJOBQ2pgMn4eXz_sffMn7vyrE';
                            $http.post(link).success(function(response) {
                            console.log(response);
                            //document.getElementById('place').innerHTML= res[3];
                             cityname = response.results[0].formatted_address.split(',');
                        console.log(cityname[3]);
                        $rootScope.search =cityname[3]; 
                       //  document.getElementById('place').innerHTML= cityname[3];
                            if (response.isSuccess = true){
								
							}else{}
							});
                                                        
                                                        
                                                        
                  $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                       // alert("Restaurant types not fetch successfully");
                    }
                }).error(function(){
                    alert("Error Occur");
                    $ionicLoading.hide();
                });
                                            //alert("hello");
                                            $state.go("menu.nearestRestaurants");
                                        } else {
                                             var fav_lis11 = $ionicPopup.show({
                             title:"No restaurants are avialable near you, Please select another city",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              $state.go("menu.search");
                                            }}
                                        ]
                                      });
                                            $ionicLoading.hide();
                                           // alert('Please Check');
                                            //$state.go("menu.nearestRestaurants");
                                        }
                                    })
                                },
                                function(err) {
                                    $rootScope.Gps=1;
                                    var fav_lis11 = $ionicPopup.show({
                             title:"Please ON your Mobile GPS",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              //$state.go("menu.search");
                                            }}
                                        ]
                                      });
                                   // alert(JSON.stringify(err));
      // error
    });
    

                                
                
                        }else{ 
//                            $state.go("menu.slider");
                            navigator['app'].exitApp();
                        }
                        

                         
                                    $http.post(Base_URL+'api/ads/ads').success(function (response) {
                                        //console.log(response);
                                       // $ionicLoading.hide();
                                        if (response.error === "0") {
                                            $rootScope.addfdd= response.data.Ad.image;
                                             $rootScope.ghfhg= response.data.Ad.name;
                                            console.log($rootScope.addfdd);
                                        }else{
                                        } 
                                    })
                                   // alert($window.localStorage.getItem('count'));
//                                  if($window.localStorage.getItem('count')=="1"){

                   
                            var confirmPopup = $ionicPopup.alert({
                            template:'<div class="modalImage modal_btn" style="width:230px";height:200px;min-height:65px;><img src="{{addfdd}}" class="modal_btn_pic" ></div>',
                            cssClass: 'btn_edt',
                            buttons: [ 
                            {
                            text: '<span class="closed"><i class="ion-ios-close"></i></span>',
                            type: 'button-positive1',   
                            }]
                        }); 
                //  }
                            //$rootScope.count=0;

                            $scope.jgd= function(rrrid, distance){ 
                                 delete $rootScope.reviews;
                                 delete $rootScope.reviewslenght;
                            $scope.userid=$window.localStorage.getItem("user_id");
                               // console.log($scope.userid);
                            $scope.udata={
                                User:{
                                    uid:$scope.userid
                                    }
                                };
                               // console.log($scope.udata);
                                //alert("ppp");
                                $http.post(Base_URL+'api/shop/removeitemsall',$scope.udata)
                                    .success(function(response){
                                       // console.log(response);
                                    delete $rootScope.numbitemsd; 
                                       // $scope.addtocart2();
                                        //$window.localStorage.setItem('ordermethoddine', '1')
                                        //$window.localStorage.removeItem('pick');
                                   });
    
    
  //  alert(rrrid);
  //  alert(distance);
                                $window.localStorage.setItem('restiddd', JSON.stringify(rrrid));    
                                $scope.userid=$window.localStorage.getItem("user_id");
                                $rootScope.dis = $stateParams.dis;
            //console.log( $rootScope.dis); 
                                $scope.rdata = {
                                    Restaurant: {
                                        id: rrrid
                                    },
                                         user_id:$scope.userid
                                };
                                //console.log($scope.rdata);
                                $ionicLoading.show();
                                $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                                .success(function (response) {
                                $ionicLoading.hide();
                                console.log(response);  
                                if (response.isSucess == "true") {
                                $rootScope.rest_detail = response.data;
                                $window.localStorage.setItem('rest_id', JSON.stringify(response.data.id));
                                $window.localStorage.setItem('min_order', JSON.stringify(response.data.min_order));
                                $rootScope.address = response.data.address;
                                $rootScope.restname = response.data.name;
                                //console.log($rootScope.restname);
                                $rootScope.favrest = response.data.favrest; 
                                
                                
                                 $scope.rdata={
        Review:{
            resid: rrrid,
          //  uid:$scope.userid
        }
    };
    console.log($scope.rdata);
    $http.post(Base_URL+'/api/shop/displayreviews',$scope.rdata).success(function(response){
    console.log(response);
    if(response.error == 0){
       if(response.error == 0){
                                if(response.data.length >= 3){
                                  for (var i = 0; i < 3; i++) {
                                      reviews.push(response.data[i]);
                                  }
                                  $rootScope.reviews = reviews;
                                }else{
                                  $rootScope.reviews = response.data;
                                  console.log($rootScope.reviews);
                                }
                                
                                $rootScope.reviewslenght = response.data.length;
                            }else{
                                delete $rootScope.reviews;
                                delete $rootScope.reviewslenght;
                            }
                    }
                });
                                //console.log($rootScope.address);
                                $state.go("menu.restaurantDetails", {num:rrrid});
                                }else{
                                     
                                }
                            }
                        );
                    }

                  


                       //$scope.modal.show();
                       //
                    //};
                     $scope.doRefresh=function()
                    {
      $window.localStorage.removeItem('search_lat');
      $window.localStorage.removeItem('search_long');
      $window.localStorage.setItem('count',JSON.stringify(0));
       $scope.data = [];

                    $ionicModal.fromTemplateUrl('templates/search.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                    });
                    var restdetails = [];
                    var restcountry = [];
                  //$scope.openModal = function () {
                       // alert("hello");
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                       // alert("dkjnvks");
                        $cordovaGeolocation.getCurrentPosition(posOptions)

                                .then(function (position) {

                                    console.log(position);
                                    //  alert("hgdh");
                                    // console.log('position');

                                    $rootScope.lat = position.coords.latitude;
                                    $rootScope.long = position.coords.longitude;
                                    $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                    $window.localStorage.setItem('long', JSON.stringify($rootScope.long));

                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                          
                                        }};
                                    console.log($scope.restdata);

                                   //  $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        console.log(response);
                                      //  $ionicLoading.hide();
                                        if (response.isSuccess === "true") {
                                            
                                            
                                            $rootScope.Gps = 0;
                                              $window.localStorage.removeItem('search_lat');
                                              $window.localStorage.removeItem('search_long');
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');

                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                            restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                           
                                            }
                                            

                                            $rootScope.resname1 = restdetails;
                                 console.log(response.data.Restaurant[0].typename[0].RestaurantsType.name);
                                            console.log($rootScope.resname1[0].distance);

                                            $scope.modal.hide();
                                              $rootScope.clat =  $scope.lat;
                                    $rootScope.clong = $scope.long;
                                  //  $rootScope.favrest = response.data.favrest;
								
                                    //onsole.log($rootScope.favrest);
                                    
                                    console.log($rootScope.clat);
                                    console.log($rootScope.clong);
			var link = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$rootScope.clat+','+$rootScope.clong+'&key=AIzaSyBgdQ9h1BXJOBQ2pgMn4eXz_sffMn7vyrE';
                            $http.post(link).success(function(response) {
                            console.log(response);
                            //document.getElementById('place').innerHTML= res[3];
                             cityname = response.results[0].formatted_address.split(',');
                        console.log(cityname[3]);
                        $rootScope.search =cityname[3]; 
                       //  document.getElementById('place').innerHTML= cityname[3];
                            if (response.isSuccess = true){
								
							}else{}
							});
                                            //alert("hello");
                                            $state.go("menu.nearestRestaurants");
                                            
                                            $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                       // alert("Restaurant types not fetch successfully");
                    }
                })
                                        } else {
                                           // alert('Please Check');
                                           // $state.go("menu.nearestRestaurants");
                                        }
                                    });
                                }
                                // , function(err) {
                                //   alert(JSON.stringify(err));
                                //  }
                                );
 $scope.$broadcast('scroll.refreshComplete');

  };
                    $scope.filtername = function () {
                        //alert("ghdf");
                         if($window.localStorage.getItem('search_lat')){ 
                            var restdetails = [];
                            $scope.lat = $window.localStorage.getItem('search_lat');
                            $scope.long = $window.localStorage.getItem('search_long');

                            $scope.restdata = {
                                data: {
                                    Restaurant: { 
                                        latitude: $scope.lat,
                                        longitude: $scope.long
                                    }
                                }
                            };
                            //console.log($scope.restdata);
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                $ionicLoading.hide();
                                if (response.isSuccess === "true") {
                                    $rootScope.resname1 = response.data.Restaurant;
                                    //console.log($rootScope.resname1);
                                   // $scope.lat = $window.localStorage.getItem('lat');
                                   // $scope.long = $window.localStorage.getItem('long');
                                    for (var i = 0; i < response.data.Restaurant.length; i++) {
                                        restdetails.push(response.data.Restaurant[i]);
                                        restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                    }

                                    $rootScope.resname1 = restdetails;
                                    $scope.floc = "name";
                                    //console.log($scope.floc);
                                    $scope.closeModal1();
                                  //  $state.go("menu.nearestRestaurants");
                                } 
                            });
                        }else{

                            var restdetails = [];

                        var posOptions = {timeout: 10000, enableHighAccuracy: true};

                        $cordovaGeolocation.getCurrentPosition(posOptions)
                                .then(function (position) {
                                    //console.log(position);
                                    //console.log('position');
                                    $rootScope.lat = position.coords.latitude;
                                    $rootScope.long = position.coords.longitude;
                                    $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                    $window.localStorage.setItem('long', JSON.stringify($rootScope.long));
                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                        }};
                                    console.log($scope.restdata);

                                    $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        $ionicLoading.hide();
                                        console.log(response);
                                        if (response.isSuccess === "true") {
                                            $rootScope.resname1 = response.data.Restaurant;
                                            console.log($rootScope.resname1);
                                             $rootScope.Gps = 0;
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');
                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                            }

                                            $rootScope.resname1 = restdetails;
                                            $scope.floc = "name";


                                            console.log($scope.floc);
                                            $scope.closeModal1();
                                           // alert("hello");
                                           // $state.go("menu.nearestRestaurants");
                                        } 
                                    });
                                });
                        }
                       
                    };
                    $scope.filterev = function () {
                       if($window.localStorage.getItem('search_lat')){ 
                            var restdetails = [];
                            $scope.lat = $window.localStorage.getItem('search_lat');
                            $scope.long = $window.localStorage.getItem('search_long');

                            $scope.restdata = {
                                data: {
                                    Restaurant: { 
                                        latitude: $scope.lat,
                                        longitude: $scope.long
                                    }
                                }
                            };
                            //console.log($scope.restdata);
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                $ionicLoading.hide();
                                if (response.isSuccess === "true") {
                                    $rootScope.Gps = 0;
                                    $rootScope.resname1 = response.data.Restaurant;
                                    //console.log($rootScope.resname1);
                                   // $scope.lat = $window.localStorage.getItem('lat');
                                   // $scope.long = $window.localStorage.getItem('long');
                                    for (var i = 0; i < response.data.Restaurant.length; i++) {
                                        restdetails.push(response.data.Restaurant[i]);
                                        restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                    }

                                    $rootScope.resname1 = restdetails;
                                    $scope.floc = "-review_avg";
                                    //console.log($scope.floc);
                                    $scope.closeModal1();
                                  //  $state.go("menu.nearestRestaurants");
                                } 
                            });
                        }else{

                            var restdetails = [];

                        var posOptions = {timeout: 10000, enableHighAccuracy: true};

                        $cordovaGeolocation.getCurrentPosition(posOptions)
                                .then(function (position) {
                                    //console.log(position);
                                    //console.log('position');
                                    $rootScope.lat = position.coords.latitude;
                                    $rootScope.long = position.coords.longitude;
                                    $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                    $window.localStorage.setItem('long', JSON.stringify($rootScope.long));
                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                        }};
                                    console.log($scope.restdata);

                                    $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        $ionicLoading.hide();
                                        console.log(response);
                                        if (response.isSuccess === "true") {
                                            $rootScope.resname1 = response.data.Restaurant;
                                            console.log($rootScope.resname1);

                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');
                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                            }

                                            $rootScope.resname1 = restdetails;
//console.log($rootScope.resname1);
                                           // alert($rootScope.resname1[0].distance);
//console.log($rootScope.resname1.review_avg);
                                            $scope.floc = "-review_avg";


                                            console.log($scope.floc);
                                            $scope.closeModal1();
                                           // alert("hello");
                                           // $state.go("menu.nearestRestaurants");
                                        } 
                                    });
                                });
                        }
                    };
                    $scope.filtercater = function (country_name) { 
                        //alert("bhumi");
                      //  alert(country_name);
                        
                            if($window.localStorage.getItem('search_lat')){ 
                                //alert("bhumika");
                            var restdetails = [];
                            $scope.lat = $window.localStorage.getItem('search_lat');
                            $scope.long = $window.localStorage.getItem('search_long');

                            $scope.restdata = {
                                data: {
                                    Restaurant: { 
                                        latitude: $scope.lat,
                                        longitude: $scope.long
                                    }
                                }
                            };
                            //console.log($scope.restdata);
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata)
                                .success(function (response) {
                                    $ionicLoading.hide();
                                    if (response.isSuccess === "true") {
                                        $rootScope.Gps = 0;
                                        $rootScope.resname1 = response.data.Restaurant;
                                        //console.log($rootScope.resname1);
                                       // $scope.lat = $window.localStorage.getItem('lat');
                                       // $scope.long = $window.localStorage.getItem('long');
                                        for (var i = 0; i < response.data.Restaurant.length; i++) {
                                            restdetails.push(response.data.Restaurant[i]);
                                            restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                        }

                                        restcountry=[];
                                        $rootScope.resname1={};
                                        for (var i = 0; i < response.data.Restaurant.length; i++) {
                                            for (var j = 0; j < response.data.Restaurant[i].typename.length; j++) {  
                                                if (response.data.Restaurant[i].typename[j].RestaurantsType.name==country_name){
                                                    restcountry.push(response.data.Restaurant[i]);
                                                    console.log(restcountry);
                                                }
                                            }
                                        }

                                        $rootScope.resname1 = restcountry;
                                        console.log("jjj");
                                        if($rootScope.resname1.length >= 1){

                                        }else{
                                               var fav_lis11 = $ionicPopup.show({
                             title:"No restaurants are avialable of this Cuisine, Please select another Cuisine for restaurants",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              fav_lis11.close
                                            }}
                                        ]
                                      });
                                           /// alert("No restaurants are avialable of this Cuisine, Please select another Cuisine for restaurants");
                                        }
                                        console.log($rootScope.resname1);
                                        console.log("jjj");

                                        $scope.floc = restcountry;
                                        $scope.closeModal1();
                                      //  $state.go("menu.nearestRestaurants");
                                    } 
                                });
                        }else{
                            //alert("else");
                        
                        var restdetails = [];
                        
                  
                       
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                       
                        $cordovaGeolocation.getCurrentPosition(posOptions)

                                .then(function (position) {

                                    console.log(position);
                                    
                                    
                                    $rootScope.lat = position.coords.latitude;
                                    $rootScope.long = position.coords.longitude;
                                    $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                    $window.localStorage.setItem('long', JSON.stringify($rootScope.long));

                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                          
                                        }};
                                    console.log($scope.restdata);

                                     $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                    
                                        
                                        console.log(response);
                                        
                                        $ionicLoading.hide();
                                        if (response.isSuccess === "true") {
                                            $rootScope.Gps = 0;
                                            
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');

                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                            }
                                             restcountry=[];
                                             $rootScope.resname1={};
                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                for (var j = 0; j < response.data.Restaurant[i].typename.length; j++) {  
                                                    if (response.data.Restaurant[i].typename[j].RestaurantsType.name==country_name){
                                                restcountry.push(response.data.Restaurant[i]);
                                                console.log(restcountry);
                                                    } }}
                                        } 
                                        
                                            $rootScope.resname1 = restcountry;
                                           // $window.localStorage.setItem('distance', $rootScope.resname1);
                                            console.log($rootScope.resname1);
                                            if($rootScope.resname1.length >= 1){

                                            }else{
                                                  var fav_lis11 = $ionicPopup.show({
                             title:"No restaurants are avialable of this Cuisine, Please select another Cuisine for restaurants",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              fav_lis11.close
                                            }}
                                        ]
                                      });
                                           //     alert("No restaurants are avialable of this Cuisine, Please select another Cuisine for restaurants");
                                                // $ionicModal.fromTemplateUrl('templates/filter.html', {
                                                //     scope: $scope,
                                                //     animation: 'slide-in-up',
                                                // }).then(function (modal) {
                                                //     $scope.modal1 = modal;
                                                // });
                                            }
                                              
                                           
                                           // $state.go("menu.nearestRestaurants");

                                    });

                                });
        
                                
                        $scope.floc = restcountry;
                        
                        console.log($scope.floc);
                        $scope.closeModal1();
                        console.log($scope.name1);
                        
                    }
                };
                    
                $scope.filter = function () { 
                     if($window.localStorage.getItem('search_lat')){ 
                            var restdetails = [];
                            $scope.lat = $window.localStorage.getItem('search_lat');
                            $scope.long = $window.localStorage.getItem('search_long');

                            $scope.restdata = {
                                data: {
                                    Restaurant: { 
                                        latitude: $scope.lat,
                                        longitude: $scope.long
                                    }
                                }
                            };
                            //console.log($scope.restdata);
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                $ionicLoading.hide();
                                if (response.isSuccess === "true") {
                                    $rootScope.resname1 = response.data.Restaurant;
                                    //console.log($rootScope.resname1);
                                   // $scope.lat = $window.localStorage.getItem('lat');
                                   // $scope.long = $window.localStorage.getItem('long');
                                    for (var i = 0; i < response.data.Restaurant.length; i++) {
                                        restdetails.push(response.data.Restaurant[i]);
                                        restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                    }

                                    $rootScope.resname1 = restdetails;
                                    $scope.floc = "distance";
                                    //console.log($scope.floc);
                                    $scope.closeModal1();
                                  //  $state.go("menu.nearestRestaurants");
                                } 
                            });
                        }else{

                            var restdetails = [];

                        var posOptions = {timeout: 10000, enableHighAccuracy: true};

                        $cordovaGeolocation.getCurrentPosition(posOptions)
                                .then(function (position) {
                                    //console.log(position);
                                    //console.log('position');
                                    $rootScope.lat = position.coords.latitude;
                                    $rootScope.long = position.coords.longitude;
                                    $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                    $window.localStorage.setItem('long', JSON.stringify($rootScope.long));
                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                        }};
                                    console.log($scope.restdata);

                                    $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        $ionicLoading.hide();
                                        console.log(response);
                                        if (response.isSuccess === "true") {
                                            $rootScope.resname1 = response.data.Restaurant;
                                            console.log($rootScope.resname1);

                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');
                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                            }

                                            $rootScope.resname1 = restdetails;
//console.log($rootScope.resname1);
                                           // alert($rootScope.resname1[0].distance);
//console.log($rootScope.resname1.review_avg);
                                            $scope.floc = "distance";


                                            console.log($scope.floc);
                                            $scope.closeModal1();
                                           // alert("hello");
                                           // $state.go("menu.nearestRestaurants");
                                        } 
                                    });
                                });
                        }
                    };
                     $scope.data={};
//                    $scope.closeModal = function () {
//                       
//                       // alert("geygfde");
//                        var restdetails1 = [];
//                        console.log($scope.data.city.name);
//
//
////                        console.log($scope.data.city);
////                        $rootScope.city = JSON.stringify($scope.data.city.name);
////                        console.log($rootScope.city.name);
//                            $scope.cityname = $scope.data.city.name;
//
//                           // console.log($scope.cityname);
//                            $http.post('https://maps.googleapis.com/maps/api/geocode/json?address=(' + $scope.cityname + ')').success(function (response) {
//                           // console.log(response);
//                            $rootScope.lat2 = response.results[0].geometry.location.lat;
//                            $rootScope.long2 = response.results[0].geometry.location.lng;
//                            $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat2));
//                            $window.localStorage.setItem('long', JSON.stringify($rootScope.long2));
//                            $scope.modal.hide();
//                            //console.log($window.localStorage.getItem('lat'));
//                            //console.log($window.localStorage.getItem('long'));
//                            $scope.lat = $window.localStorage.getItem('lat');
//                            $scope.long = $window.localStorage.getItem('long');
//                            $scope.restdata = {
//                                data: {
//                                    Restaurant: {
//                                        latitude: $scope.lat, 
//                                        longitude: $scope.long
//                                        }
//                                    }};
//                            console.log($scope.restdata);
//                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) 
//                            {
//                            console.log(response);
//                            for (var i = 0; i < response.data.Restaurant.length; i++) {
//                                restdetails1.push(response.data.Restaurant[i]);
//                                restdetails1[i].distance = $scope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
//                                }
//                                $rootScope.resname1 = restdetails1;
////         console.log($rootScope.res_list);
//                                console.log(restdetails1);
//                            })
//                        });
//                    };
                    //Cleanup the modal when we're done with it!
                    $scope.$on('$destroy', function () {
                        $scope.modal.remove();
                    });

                    // Execute action on hide modal
                    $scope.$on('modal.hidden', function () {
                        // Execute action
                    });

                    // Execute action on remove modal
                    $scope.$on('modal.removed', function () {
                        // Execute action
                    });

                    // For Filtr Tab
                    $ionicModal.fromTemplateUrl('templates/filter.html', {
                        scope: $scope,
                        animation: 'slide-in-up',
                    }).then(function (modal) {
                        $scope.modal1 = modal;
                    });

                    $scope.closeModal1 = function () {
                        $scope.modal1.hide();
                    };
             
                    $scope.location_gps=function(){
                      //  alert("my")
                                            var restdetails = [];
                    var restcountry = [];
                  //$scope.openModal = function () {
                       // alert("hello");
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                       // alert("dkjnvks");
                        $cordovaGeolocation.getCurrentPosition(posOptions)

                                .then(function (position) {

                                    console.log(position);
                            $rootScope.Gps=0;
                                    //  alert("hgdh");
                                    // console.log('position');

                                        $rootScope.lat = position.coords.latitude;
                                        $rootScope.long = position.coords.longitude;
                                        $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                        $window.localStorage.setItem('long', JSON.stringify($rootScope.long));

                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                          
                                        }};
                                    console.log($scope.restdata);

                                     $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        console.log(response);
                                        $ionicLoading.hide();
                                        if (response.isSuccess === "true") {    
                                              $window.localStorage.removeItem('search_lat');
                                              $window.localStorage.removeItem('search_long');
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');

                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                           
                                            }   
                                            $rootScope.resname1 = restdetails;
                                            console.log(response.data.Restaurant[0].typename[0].RestaurantsType.name);
                                            console.log($rootScope.resname1[0].distance);

                                            $scope.modal.hide();
                                            $rootScope.clat =  $scope.lat;
                                    $rootScope.clong = $scope.long;
                                  //  $rootScope.favrest = response.data.favrest;
								
                                    //onsole.log($rootScope.favrest);
                                    $ionicLoading.hide();
                                    console.log($rootScope.clat);
                                    console.log($rootScope.clong);
			var link = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$rootScope.clat+','+$rootScope.clong+'&key=AIzaSyBgdQ9h1BXJOBQ2pgMn4eXz_sffMn7vyrE';
                            $http.post(link).success(function(response) {
                            console.log(response);
                            //document.getElementById('place').innerHTML= res[3];
                             cityname = response.results[0].formatted_address.split(',');
                        console.log(cityname[3]);
                        $rootScope.search =cityname[3]; 
                       //  document.getElementById('place').innerHTML= cityname[3];
                            if (response.isSuccess = true){
								
							}else{}
							});
                                                        
                                                        
                                                        
                  $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                        alert("Restaurant types not fetch successfully");
                    }
                }).error(function(){
                    alert("Error Occur");
                    $ionicLoading.hide();
                });
                                            //alert("hello");
                                            $state.go("menu.nearestRestaurants");
                                        } else {
                                             var fav_lis11 = $ionicPopup.show({
                             title:"No restaurants are avialable near you, Please select another city",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              $state.go("menu.search");
                                            }}
                                        ]
                                      });
                                            $ionicLoading.hide();
                                           // alert('Please Check');
                                            //$state.go("menu.nearestRestaurants");
                                        }
                                    })
                                },
                                function(err) {
                                    $rootScope.Gps=1;
                                    var fav_lis11 = $ionicPopup.show({
                             title:"Please ON your Mobile GPS",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              //$state.go("menu.search");
                                            }}
                                        ]
                                      });
                                   // alert(JSON.stringify(err));
      // error
    });
    
                    }
                   
                })

        .controller('favoritesCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$ionicLoading,$http,$window,$rootScope,Base_URL,$state,$ionicPlatform,$ionicPopup) {
//                 $ionicLoading.show({
//template: 'Loading...',duration:10000
//});
$scope.favourite=function(){
$scope.useriid = JSON.parse($window.localStorage.getItem('User_Data'));
 $scope.userid = JSON.parse($scope.useriid.user_id);
 $scope.cdata={id:$scope.userid};
 console.log($scope.cdata);
 $ionicLoading.show();
$http.post(Base_URL+'api/restaurants/favlist',$scope.cdata).success(function(response)
{    //alert("hbcjgdshy");
// alert(response);
 $ionicLoading.hide();
 console.log(response);
 
if(response.isSuccess == "true"){
 $rootScope.favlisting=response.data.Restaurant;
 console.log($rootScope.favlisting);
 $rootScope.fav_id=response.data.Restaurant.id;
 $state.go("menu.favorites");
 }else{
      var fav_lis = $ionicPopup.show({
                             title:response.msg,
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              fav_lis.close();
                             
                                            }}
                                        ]
                                      });
    // alert(response.msg);
 }
 //$scope.name=response.data.Restaurant;

});
}
 //////////rest_Details/////////
    $scope.rest_details=function(rest_id){
        delete $rootScope.reviews;
        delete $rootScope.reviewslenght;
     //   alert(rest_id);
         $scope.userid=$window.localStorage.getItem("user_id");
                                console.log($scope.userid);
                                $scope.udata={
                                    User:{
                                        uid:$scope.userid
                                    }
                                };
                                console.log($scope.udata);
                           //     alert("ppp");
                                $http.post(Base_URL+'api/shop/removeitemsall',$scope.udata)
                                    .success(function(response){
                                       console.log(response);
                                        
                                        //$window.localStorage.removeItem('pick');
                                   });
    $scope.userid=$window.localStorage.getItem("user_id");
            $rootScope.dis = $stateParams.dis;
            //console.log( $rootScope.dis);

            $scope.rdata = {
                Restaurant: {
                    id: rest_id

                },
            user_id:$scope.userid
        };
console.log($scope.rdata);
$ionicLoading.show();
            $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                    .success(function (response) {
                        $ionicLoading.hide();
                        console.log(response);

                        if (response.isSucess == "true") {
                            $rootScope.rest_detail = response.data;
                            $window.localStorage.setItem('rest_id', JSON.stringify(response.data.id));
                             $window.localStorage.setItem('min_order', JSON.stringify(response.data.min_order));
//                            console.log(( $window.localStorage.getItem('rest_id'));
                         //   $window.localStorage.setItem('logo1', JSON.stringify(response.data.logo));
                   // console.log(JSON.parse( $window.localStorage.getItem('logo1')));
                    
                //    $window.localStorage.setItem('table_pricing1', JSON.stringify(response.data.table_pricing));
                   // console.log(JSON.parse( $window.localStorage.getItem('table_pricing1')));
                          $rootScope.description = response.data.description;
                          console.log($rootScope.description);
                          $rootScope.address = response.data.address;
                          console.log($rootScope.address);
//                           $rootScope.id = response.data.id;
//                           console.log($rootScope.id);
//                           $rootScope.uid = response.data.user_id;
//                           console.log($rootScope.id);
                           $rootScope.restname = response.data.name;
                           
                           $rootScope.favrest = response.data.favrest;
                           
                          console.log($rootScope.address);
                          $state.go("menu.restaurantDetails");
                           $window.localStorage.setItem('restiddd', JSON.stringify(response.data.id));
                        }
                    }

                    );
}
  $scope.doRefresh=function()
                     
  {
//      $window.localStorage.removeItem('search_lat');
//      $window.localStorage.removeItem('search_long');
     $window.localStorage.setItem('count',JSON.stringify(0));
     $scope.useriid = JSON.parse($window.localStorage.getItem('User_Data'));
 $scope.userid = JSON.parse($scope.useriid.user_id);
 $scope.cdata={id:$scope.userid};
 console.log($scope.cdata);
// $ionicLoading.show();
$http.post(Base_URL+'api/restaurants/favlist',$scope.cdata).success(function(response)
{    //alert("hbcjgdshy");
// alert(response);
// $ionicLoading.hide();
 console.log(response);
 console.log(response.data);
 console.log(response.data.Restaurant);
 $rootScope.favlisting=response.data.Restaurant;
 console.log($rootScope.favlisting);
 $rootScope.fav_id=response.data.Restaurant.id;
 $state.go("menu.favorites");
 //$scope.name=response.data.Restaurant;
 $scope.$broadcast('scroll.refreshComplete');
});
       
//  $rootScope.unread_count = 0;
//    $rootScope.seller_group_id = 1;

  };
 $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
            $state.go('menu.nearestRestaurants')
        }
    }, 1000);
            })

        .controller('mapCtrl',function ($scope, $stateParams,$rootScope) {
                $rootScope.latitude = $stateParams.lat;
                $rootScope.longitude = $stateParams.long;
                 $rootScope.rest_name = $stateParams.rest_name;

            })

        .controller('restaurantDetailsCtrl', function ($scope, $stateParams, $ionicScrollDelegate, $state, $rootScope, $http, $window,$ionicLoading,Base_URL,$ionicPopup,$cordovaInAppBrowser) {
            $scope.toggleGroup1 = function(group1) {
            if ($scope.isGroupShown1(group1)) {
            $scope.shownGroup1 = null;
            } 
            else 
            {
            $scope.shownGroup1 = group1;
            }
        };
  $scope.isGroupShown1 = function(group1) {
    return $scope.shownGroup1 === group1;
  };
  
              $scope.toggleGroup2 = function(group2) {
    if ($scope.isGroupShown2(group2)) {
      $scope.shownGroup2 = null;
      show: false;
    } else {
      $scope.shownGroup2 = group2;
    }
  };
  $scope.isGroupShown2 = function(group2) {
    return $scope.shownGroup2 === group2;
  };
  
              $scope.toggleGroup3 = function(group3) {
    if ($scope.isGroupShown3(group3)) {
      $scope.shownGroup3 = null;
      show: false;
    } else {
      $scope.shownGroup3 = group3;
    }
  };
  $scope.isGroupShown3= function(group3) {
    return $scope.shownGroup3 === group3;
  };
    $scope.uid=(JSON.parse(localStorage.getItem('User_Data'))).user_id;
    $scope.id=(JSON.parse(localStorage.getItem('rest_id')));
        console.log($scope.uid);
    $scope.rdata={
        Review:{
            resid:$scope.id,
            uid:$scope.uid
        }
    };
    console.log($scope.rdata);
    $http.post(Base_URL+'api/shop/displayreviews',$scope.rdata).success(function(response){
    console.log(response);
    if(response.error == 0){
       if(response.error == 0){
           var reviews = []
                                if(response.data.length >= 3){
                                  for (var i = 0; i < 3; i++) {
                                      reviews.push(response.data[i]);
                                  }
                                  $rootScope.reviews = reviews;
                                }else{
                                  $rootScope.reviews = response.data;
                                  //console.log($rootScope.reviews);
                                }
                                
                                $rootScope.reviewslenght = response.data.length;
                            }else{
                                delete $rootScope.reviews;
                                delete $rootScope.reviewslenght;
                            }
                    }
                });
                $scope.more_reviews = function(){
                    delete $rootScope.viewmore;
              //  alert("read more");
                $scope.uid = $window.localStorage.getItem('user_id');
                $scope.id = JSON.parse(localStorage.getItem('rest_id'));
                $scope.rdata={
                    Review:{
                        resid:$scope.id,
                        uid:$scope.uid
                    }
                };
                console.log($scope.rdata);
                $http.post(Base_URL+'api/shop/displayreviews',$scope.rdata)
                    .success(function(response){
                        console.log(response);
                        if(response.error == 0){
                            $rootScope.viewmore = 1;
                            $rootScope.reviews = response.data;
                            $rootScope.reviewslenght = response.data.length;
                        }else{
                            delete $rootScope.reviews;
                            delete $rootScope.reviewslenght;
                        }
                });
            }

  $scope.dine=function(restiddd,dineid){
  $window.localStorage.setItem('deliverymethod', dineid);
  $window.localStorage.setItem('ordermethoddine', dineid);
  //$rootScope.ordermethoddine=dineid;
  if($window.localStorage.getItem('ordermethodpick')){
      //alert($window.localStorage.getItem('ordermethodpick'))
  }
      $window.localStorage.setItem('restm', JSON.stringify(restiddd));
      $scope.rdata = {
                        Restaurant: {
                            id:restiddd
                        }
                    };
                    console.log($scope.rdata);
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/restaurants/getresmenu/', $scope.rdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response);
                        $rootScope.resmenu = response.data.cat;


                       $state.go('menu.mainMenu2');
                    });
                };
  
                $scope.pick=function(restidpick, pickid){
                $window.localStorage.setItem('deliverymethod', pickid);
                    $window.localStorage.setItem('ordermethodpick', pickid);
       
                $window.localStorage.setItem('restidpickk', JSON.stringify(restidpick));
      
        $scope.rdata = {
                        Restaurant: {
                            id: restidpick
                        }
                    };
                    console.log($scope.rdata);
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/restaurants/getresmenu/', $scope.rdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response);
                        $rootScope.resmenu1 = response.data.cat;


                        $state.go('menu.mainMenu');
                    });
  }
  
          // console.log($stateParams.restid);
           
            $rootScope.dis = $stateParams.dis;
            $scope.userid=$window.localStorage.getItem("user_id");
                $rootScope.riidd=JSON.parse( $window.localStorage.getItem('restiddd'));
            $scope.rdata = {
                Restaurant: {
                    id: $rootScope.riidd

                },
            user_id:$scope.userid
            };
        console.log($scope.rdata);
        $ionicLoading.show();
            $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                    .success(function (response) {
                        $ionicLoading.hide();
                        console.log(response);

                        if (response.isSucess == "true") {
                            $rootScope.rest_detail = response.data;
                            $window.localStorage.setItem('rest_id', JSON.stringify(response.data.id));
                           // console.log(JSON.parse( $window.localStorage.getItem('rest_id')));
//                            $window.localStorage.setItem('logo1', JSON.stringify(response.data.logo));
//                    console.log(JSON.parse( $window.localStorage.getItem('logo1')));
//                    
                    //$window.localStorage.setItem('table_pricing1', JSON.stringify(response.data.table_pricing));
                   // console.log(JSON.parse( $window.localStorage.getItem('table_pricing1')));
                          $rootScope.description = response.data.description;
                          console.log($rootScope.description);
                          $rootScope.address = response.data.address;
                          console.log($rootScope.address);
//                           $rootScope.id = response.data.id;
//                           console.log($rootScope.id);
//                           $rootScope.uid = response.data.user_id;
//                           console.log($rootScope.id);
                           $rootScope.restname = response.data.name;
                           console.log($rootScope.restname);
                           $rootScope.favrest = response.data.favrest;
                           $rootScope.web = response.data.website;
                          console.log($rootScope.web);
                        }
                    }

                    );


           // $state.go("menu.restaurantDetails");
            
            
            
            $scope.web=function(){    
                var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
                };
                   //alert("hellogfggh");
            $cordovaInAppBrowser.open($rootScope.web, '_blank', options)    
            .then(function(event) {
             // alert("hello");
             //   alert(event);
                })
            .catch(function(event) {
       //   alert("hii");
       // alert(event);
                });
            }
            $scope.likeit=function($id) {
  
  
 //$scope.resid=JSON.parse(localStorage.getItem('resid'));
// $scope.like=JSON.parse(localStorage.getItem('like'));
// //console.log($scope.resid);
// //alert($id);
 $scope.userid = JSON.parse($window.localStorage.getItem('user_id'));
                $scope.restid = JSON.parse($window.localStorage.getItem('rest_id'))
// 
 $scope.abdata ={
   User:{
   id:$scope.userid
  },
  Restaurant:{
   resid:$rootScope.riidd
 }
};
console.log($scope.abdata); 

//alert($id);
 console.log($scope.abdata);
 $ionicLoading.show();
  $http.post(Base_URL+'api/restaurants/likeit',$scope.abdata).success(function(response){
      $ionicLoading.hide();
   console.log(response);
   
   if(response.error=="0"){
       var like1 = $ionicPopup.show({
                                    template:"You have unliked Successfully",
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          like1.close();
                                      
                                        }}
                                    ]
                                  });  
       
  // alert("You have unliked Successfully");
  console.log($stateParams.restid);
            console.log($stateParams.dis);
            

            $rootScope.dis = $stateParams.dis;
            //console.log( $rootScope.dis);

            $scope.rdata = {
                Restaurant: {
                    id: $rootScope.riidd

                },
            user_id:$scope.userid
        };

$ionicLoading.show();
console.log($scope.rdata);
            $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                    .success(function (response) {
                        $ionicLoading.hide();
                        console.log(response);

                        if (response.isSucess == "true") {
                            $rootScope.rest_detail = response.data;
                            $window.localStorage.setItem('rest_id', JSON.stringify(response.data.id));
                            console.log(JSON.parse( $window.localStorage.getItem('rest_id')));
                         //   $window.localStorage.setItem('logo1', JSON.stringify(response.data.logo));
                   // console.log(JSON.parse( $window.localStorage.getItem('logo1')));
                    
//                    $window.localStorage.setItem('table_pricing1', JSON.stringify(response.data.table_pricing));
//                    console.log(JSON.parse( $window.localStorage.getItem('table_pricing1')));
                     $rootScope.favrest = response.data.favrest;       
                        }
                    }

                    );

   
 
 }
 
 else if(response.error == "1")
 {

            $rootScope.dis = $stateParams.dis;
            //console.log( $rootScope.dis);

            $scope.rdata = {
                Restaurant: {
                    id: $rootScope.riidd

                },
            user_id:$scope.userid
        };
console.log($scope.rdata);
$ionicLoading.show();

            $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                    .success(function (response) {
                        $ionicLoading.hide();
                        console.log(response);

                        if (response.isSucess == "true") {
                            $rootScope.rest_detail = response.data;
                            $window.localStorage.setItem('rest_id', JSON.stringify(response.data.id));
                            console.log(JSON.parse( $window.localStorage.getItem('rest_id')));
                         //   $window.localStorage.setItem('logo1', JSON.stringify(response.data.logo));
                 //   console.log(JSON.parse( $window.localStorage.getItem('logo1')));
//                    
//                    $window.localStorage.setItem('table_pricing1', JSON.stringify(response.data.table_pricing));
//                    console.log(JSON.parse( $window.localStorage.getItem('table_pricing1')));
                            
                        }
                    }

                    );
                    }
                    });
                   
            var el = document.getElementById("div1");



            $scope.scrollEvent = function () {

                $scope.scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
                if ($scope.scrollamount > 180) {
                    $scope.$apply(function () {
                        el.classList.remove("map_header");

                    });
                } else {
                    $scope.$apply(function () {
                        el.className += " map_header";

                    });
                }
            };



// Called to navigate to the main app
            $scope.startApp = function () {
                $state.go('main');
            };
            $scope.next = function () {
                $ionicSlideBoxDelegate.next();
            };
            $scope.previous = function () {
                $ionicSlideBoxDelegate.previous();
            };

            // Called each time the slide changes
            $scope.slideChanged = function (index) {
                $scope.slideIndex = index;
            };


            $scope.groups = [];
            for (var i = 0; i < 1; i++) {
                $scope.groups[i] = {
                    name: i,
                    items: [],
                    show: false
                };
                for (var j = 0; j < 3; j++) {
                    $scope.groups[i].items.push(i + '-' + j);
                }
            }

            /*
             * if given group is the selected group, deselect it
             * else, select the given group
             */
            $scope.toggleGroup = function (group) {
                group.show = !group.show;
            };
            $scope.isGroupShown = function (group) {
                return group.show;
            };
            }

        })

        .controller('galleryCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$http,$rootScope,$window,$ionicSlideBoxDelegate,Base_URL,$state,$ionicPopup,$ionicLoading) {
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
                $scope.gallery=function(){
                    
                
                $scope.rest_id = JSON.parse($window.localStorage.getItem('rest_id'));
                    $scope.rdata = {
                        Restaurant: {
                            id: $scope.rest_id 
                        }
                    };
                    console.log($scope.rdata);
                     $ionicLoading.show();
                    $http.post(Base_URL+'api/restaurants/resgallery', $scope.rdata).success(function (response)
                    {
                        console.log(response);
                       console.log(response.data);
                       if(response.isSuccess == "true")
                       {
                            $ionicLoading.hide();
                       $rootScope.gallery=response.data;
                       console.log($rootScope.gallery);               
                $rootScope.gallery2=response.data[0].Gallery.id;
                       console.log($rootScope.gallery2);
                       $state.go("menu.gallery");
                   }else{
                        $ionicLoading.hide();
                        var my = $ionicPopup.show({
                                    template:"Image not found",
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          my.close();
                                      
                                        }}
                                    ]
                                  });  
                      // alert("no data");
                   }
                   });
               }
            })
        .controller('galleryFullCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$rootScope,$http,$ionicLoading,Base_URL) {
                 console.log($rootScope.gallery2);
                 $scope.iii=$rootScope.gallery2
                $scope.addata = {
                        Product: {
                            id: $scope.iii
                        }};
                    console.log($scope.addata);
                    $http.post(Base_URL+'api/products/getsingleproduct', $scope.addata) .success(function (response) {
                                console.log(response);
                                $rootScope.gallery9=response.list.Product.image;
                                 console.log($rootScope.gallery9);
                                
                            });
                
             
                
            })
        .controller('profileCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$state,$window,$ionicPlatform,$rootScope,$http) {
                     $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
            $state.go('menu.nearestRestaurants');
        }
    }, 1000);

            })

        .controller('reservationCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $state, $stateParams, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicPopup, $timeout, $rootScope, $http, $window,Base_URL,$ionicLoading,$filter,$cordovaInAppBrowser) {
                    

  var day1 = [];
                    $scope.data = {};

                   // alert("abc");
                  //  console.log($scope.data.date);
                    var date = new Date();
                    $rootScope.n = date.getDate();
                   // console.log(date);
                   // console.log($rootScope.n);
                   // alert($scope.date);
                    $scope.day_id = {time: {id: 1}};


                    $http.post(Base_URL+'api/shop/time', $scope.day_id).success(function (response)
                    {
                        console.log("bhumika");
                       console.log(response);
                       
                         //$rootScope.card2 = response.day[0];
                         $rootScope.cardIndex='0';
                        $rootScope.card2 = response.day;
                        //$rootScope.timecard = response.time[0];
                       $rootScope.timeIndex='0';
                       

                      $rootScope.date =  response.day;
                         $rootScope.time =  response.time;
                        // $rootScope.day=response.day; 
                       
                       $rootScope.date_length = $rootScope.date.length;
                       //var final = $rootScope.day[0];
                        //var values  = final.split("-");
                        // var val1 = values[0];
                        //console.log(val1);
                        
                        $rootScope.time = response.time;
                        console.log($rootScope.time);
                        $scope.data.time = "";

                    });
 
                     $scope.kj=function(card,indexValue){
                        // alert(card);
                         // alert(date);
	//$scope.data.date = "Select Day";
         $rootScope.decrement_flag = 0;
                       if(typeof $rootScope.date !='undefined'){
                          $scope.start_date = $rootScope.date[0]
                        var alignFillDate = new Date(card);
                        var pickUpDate = new Date($scope.start_date);
                        
                        console.log(card);
                        console.log(pickUpDate);
                        console.log(alignFillDate);
                        if (angular.equals(pickUpDate, alignFillDate)) {
                            $rootScope.decrement_flag = 1;
                          console.log('same date')
						   $scope.day_id={
                        time:{id:1}
                    };
                
                $http.post(Base_URL+'/api/shop/time',$scope.day_id).success(function(response){
                console.log(response);
                $rootScope.time=response.time;
                $scope.data.time="";
                }
            );
                        }else{ 
                     
                     console.log("bhumika grover")
                    $scope.day_id={
                        time:{id:0}
                    };
                
                $http.post(Base_URL+'/api/shop/time',$scope.day_id).success(function(response){
                console.log(response);
                $rootScope.time=response.time;
                $scope.data.time="";
                }
            );

                        }
                       }
        }
      $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
   
$scope.userid=JSON.parse($window.localStorage.getItem("user_id"));
 $scope.restid=JSON.parse ($window.localStorage.getItem("restm"));
 console.log($scope.userid);
 console.log($scope.restid);
   $scope.rdata = {
                Restaurant: {
                    id: $scope.restid

                },
            user_id:$scope.userid
        };
console.log($scope.rdata);
$ionicLoading.show();
            $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                    .success(function (response) {
                        $ionicLoading.hide();
                        console.log(response);
                        $rootScope.reservationdetail=response.data;
                        console.log($rootScope.reservationdetail);
                        $rootScope.webdet = response.data.website;
                    });
                    $scope.webres=function(){ 
                     var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
                };
                  // alert("hellogfggh");
                    $cordovaInAppBrowser.open($rootScope.webdet, '_blank', options)    
                    .then(function(event) {
            //  alert("hello");
             //   alert(event);
                     })
                    .catch(function(event) {
       //   alert("hii");
       // alert(event);
                    }); 
                    }
 
                   $rootScope.person = 1;
                   $scope.increaseperson = function () { 
                 $rootScope.person++;  
                  console.log($rootScope.person);
                  
                   }
                  
                 $scope.decreaseperson = function () { 
                  
                 if($rootScope.person>1)
                     $rootScope.person--;  
               console.log($rootScope.person);
           
               
                   }

                    $scope.abc = function ()
                    {
                      //  alert("clicked");
                    }
                    /*--------------------*/
                    $scope.index = 1;
//    $scope.index=function()
//    {
//        alert("dfjksdf");
//    }
                    $scope.updateSlideStatus = function (slide) {

                        var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
                        if (zoomFactor == $scope.zoomMin) {
                            $ionicSlideBoxDelegate.enableSlide(true);

                        } else {
                            $ionicSlideBoxDelegate.enableSlide(false);
                        }
                    };


                    /*---------------------*/
                    var el = document.getElementById("div2");


                    $scope.scrollEvent = function () {

                        $scope.scrollamount = $ionicScrollDelegate.$getByHandle('scrollHandle').getScrollPosition().top;
                        if ($scope.scrollamount > 180) {
                            $scope.$apply(function () {
                                el.classList.remove("map_header");
                                //  console.log('1');
                            });
                        } else {
                            $scope.$apply(function () {
                                el.className += " map_header";
                                // console.log('2');
                            });
                        }
                    };



                    // A confirm dialog
                    $scope.showConfirm = function(tb1) {
                        console.log(tb1);
                    //  $window.localStorage.setItem('tabletotal', JSON.stringify(tb1));
                     // $rootScope.tabletotal1=JSON.parse( $window.localStorage.getItem('tabletotal'));
                      //$rootScope.menutotal=JSON.parse( $window.localStorage.getItem('subtotal'));
                     // alert($rootScope.menutotal);
                        //$rootScope.tb=($rootScope.tabletotal1*1)+($rootScope.menutotal*1);
                       // console.log( $rootScope.tb);
                       //$window.localStorage.setItem('tablepayment', JSON.stringify($rootScope.tb));
                    
                        var confirmPopup = $ionicPopup.confirm({
                            //title: 'Consume Ice Cream',
                            template: 'Reservation confirm',
                            cssClass: 'value_sec',
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                console.log('You are sure');
                               $window.localStorage.setItem('person', JSON.stringify($rootScope.person));
                               $window.localStorage.setItem('timecard', JSON.stringify($scope.data.time));
                              $window.localStorage.setItem('carddate', JSON.stringify($scope.data.date));
//                                console.log($window.localStorage.getItem('card'));
                                $state.go('menu.checkout1');
                            } else {
                                console.log('You are not sure');
                            }
                        });
                    };

                    // An alert dialog
                    $scope.showAlert = function () {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Don\'t eat that!',
                            template: 'It might taste good'
                        });
                        alertPopup.then(function (res) {
                            console.log('Thank you for not eating my delicious ice cream cone');
                        });
                    };
                     

})


        .controller('menuFoodCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $window, $http,$ionicLoading,Base_URL,$state,$ionicPopup) {
                    ///////////////////////asso///////////////////////////////////
                    console.log(JSON.parse($window.localStorage.getItem('prodctpick_ifgg')));

            //**************** remove **********//
                         $scope.remove_dish = function($cart_id, product_id) {
                            // alert(product_id);
                           //  alert($cart_id);
				 $scope.adata = {
                Product: {
                    id: product_id
                }};
				$http.post(Base_URL+'api/products/getsingleproduct', $scope.adata).success(function(rest) {
					console.log(rest.list.Product.AssoPro);
					if(rest.list.Product.AssoPro != null){
						console.log(rest.list.Product);
						
						
                        angular.forEach($rootScope.cartitem, function(value1,index1){
							console.log(value1.Cart.product_id);
							angular.forEach(rest.list.Product.AssoPro,function(value2,index2){
								//console.log(value2.Product.id);
		//alert(value1.Cart.product_id+"//"+value2.Product.id)
	if(value1.Cart.product_id== value2.Product.id){
		$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                 $rootScope.cartitem = response.data[1];
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.total = response.data[0].total;
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                              
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
						
                     //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
	}else if(value1.Cart.product_id==rest.list.Product.id){
				$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
							  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                 $rootScope.cartitem = response.data[1];
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.total = response.data[0].total;
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                               
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
                      // $window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });	

	}
									//alert(value1.Cart.id)
			
								})	
	});
	
					}else{
					
						$scope.cartdata = {
                    Cart: {
                        id: $cart_id
                    }};
					 $http.post(Base_URL+'shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                  $rootScope.cartitem = response.data[1];
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.total = response.data[0].total;
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                                if($rootScope.product_details.length == 0){
                                    $scope.data.disabled = 1;
                                }
                               else{
                                   $scope.data.disabled = 0;
                                  // $window.location.reload()
                               }
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
         //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
				
					}
					
					
				});
		/* 		 $timeout(function() {
     //$window.location.reload(); //close the popup after 3 seconds for some reason
  }, 5000); */


            };
              //**************** remove **********//
            
            
                    //********************** ass****************//
                    $rootScope.k={};
                var ass = [];
            $scope.data = {};

                $scope.adata = {
                Product: {
                    id: JSON.parse($window.localStorage.getItem('prodctpick_ifgg'))
                }};
            $ionicLoading.hide();
            console.log($scope.adata);
            $http.post(Base_URL+'api/products/getsingleproduct', $scope.adata).success(function(rest) {
                
                console.log(rest);
             
                $ionicLoading.hide();
                
                   if (rest.error == 0) {
                    $scope.add_product = rest.list.Product;
                     $scope.baseprice=$scope.add_product.price;
                      $rootScope.totalprice=$scope.baseprice;
                    //$rootScope.test_id =$scope.add_product.id;
                    $scope.data.parent_id = $scope.add_product.id;
                  console.log($scope.add_product);
                    var asso = [];
                    asso = rest.list.Product.AssoPro;
                    //console.log(asso);
//                             $scope.asso1=rest.list.Product.AssoPro;
                    var subcat = [];
                    var ass = [];
                    console.log(asso);
//                              
                    var k = 0;
                    var l = 0;
                    angular.forEach(asso, function(value, index) {
//    
   console.log(subcat);
//    alert(subcat.length);
//    alert(subcat[parseInt(k)-1])
                        if ((subcat.length > 0) && (subcat[parseInt(l) - 1].DishSubcat.id.indexOf(value.DishSubcat.id) != -1)){

                            console.log(subcat[parseInt(k) - 1].DishSubcat);
                            ass[k].push(value);
                            subcat.push(value);
                        } else {
                            k++;
                            ass[k] = [];
                            ass[k].push(value);
                            subcat.push(value);

                        }
                        l++;

                    });
                    console.log(ass);
                    $scope.ass = ass;

                    $scope.actualdata = [];


                    angular.forEach($scope.ass, function(keys, values) {
                        $scope.actual = [];
                        $scope.testdata = [];
                        var i = 0;
                           console.log(keys);
                        angular.forEach(keys, function(values, index) {

                            console.log(values);
                            if (values.DishSubcat.ismultiple == "1") {
                                console.log(index + "hello");
                                $scope.testdata[index.toString()] = values;
                                $scope.testdata[index.toString()]["optiontype"] = "chkbox";

                            }
                            if (values.DishSubcat.ismultiple == "0") {
                                console.log(index + "hi");
                                $scope.testdata[index.toString()] = values;
                                $scope.testdata[index.toString()]["optiontype"] = "radiobtn";
                                console.log(values.DishSubcat.ismultiple);
                            }
                            $scope.actual.push($scope.testdata);
                            i++;
                            console.log($scope.testdata);
                        });
                        $scope.actualdata.push($scope.testdata);
                        console.log($scope.actual);

                    });
                    console.log($scope.actualdata);
                    var dish_catid=[];
                    $scope.maindata=[];
                    var productss=[];
                    var index2=[];
                    angular.forEach($scope.actualdata, function(value, index){
                        console.log(value)
                        if(dish_catid.indexOf(parseInt(value[0].DishCategory.id))==-1){
                            dish_catid.push(parseInt(value[0].DishCategory.id));
                            index2.push(parseInt(value[0].DishCategory.id));
                            $scope.maindata.push(value[0]);
                            console.log(dish_catid);
                            console.log(value[0].Product);
                            $scope.index= index2.indexOf(parseInt(value[0].DishCategory.id));
                           $scope.firstdata=value[0].Product
                             $scope.maindata[$scope.index].Product=[];
                             console.log($scope.maindata);
                             console.log(value[0].Product);
                             $scope.maindata[$scope.index].Product.push($scope.firstdata)
                           
                          }else{
                              dish_catid.push(parseInt(value[0].DishCategory.id));
                              console.log(dish_catid)
                             $scope.index= dish_catid.indexOf(parseInt(value[0].DishCategory.id))
                            productss.push(value[0].Product);
                            $scope.maindata[$scope.index].Product.push(value[0].Product);
                          }
                        
                        
                        
                    })
                    console.log($scope.maindata);
                     console.log($window.localStorage.getItem('restdata'));
                    $ionicLoading.hide();

                }else {
                    $ionicLoading.hide();
                   // alert("false");
                }
                
                
                
             //   if (rest.error == 0) {
                    
                    
                  //  $scope.items=rest;
                    
                    
                    
                    
                    
//                    $scope.add_product = rest.list.Product;
//                     $scope.baseprice=$scope.add_product.price;
//                      $rootScope.totalprice=$scope.baseprice;
//                    //$rootScope.test_id =$scope.add_product.id;
//                    $scope.data.parent_id = $scope.add_product.id;
//                  console.log($scope.add_product);
//                    var asso = [];
//                    asso = rest.list.Product.AssoPro;
//                    //console.log(asso);
////                             $scope.asso1=rest.list.Product.AssoPro;
//                    var subcat = [];
//                    var ass = [];
//                    console.log(asso);
////                              
//                    var k = 0;
//                    var l = 0;
//                    angular.forEach(asso, function(value, index) {
////    
//   console.log(subcat);
////    alert(subcat.length);
////    alert(subcat[parseInt(k)-1])
//                        if ((subcat.length > 0) && (subcat[parseInt(l) - 1].DishSubcat.id.indexOf(value.DishSubcat.id) != -1)) {
//
//                            console.log(subcat[parseInt(k) - 1].DishSubcat);
//                            ass[k].push(value);
//                            subcat.push(value);
//                        } else {
//                            k++;
//
//                            ass[k] = [];
//                            ass[k].push(value);
//                            subcat.push(value);
//
//                        }
//                        l++;
//
//                    });
//                    console.log(ass);
//                    $scope.ass = ass;
//
//                    $scope.actualdata = [];
//
//
//                    angular.forEach($scope.ass, function(keys, values) {
//                        $scope.actual = [];
//                        $scope.testdata = [];
//                        var i = 0;
////                             console.log(keys);
//                        angular.forEach(keys, function(values, index) {
//
//                            console.log(values);
//                            if (values.DishSubcat.ismultiple == "1") {
//                                console.log(index + "hello");
//                                $scope.testdata[index.toString()] = values;
//                                $scope.testdata[index.toString()]["optiontype"] = "chkbox";
//
//                            }
//                            if (values.DishSubcat.ismultiple == "0") {
//                                console.log(index + "hi");
//                                $scope.testdata[index.toString()] = values;
//                                $scope.testdata[index.toString()]["optiontype"] = "radiobtn";
//                                console.log(values.DishSubcat.ismultiple);
//                            }
//                            $scope.actual.push($scope.testdata);
//                            i++;
//                            console.log($scope.testdata);
//                        });
//                        $scope.actualdata.push($scope.testdata);
//                        console.log($scope.actual);
//
//                    });
//                    console.log($scope.actualdata);
//                     console.log($window.localStorage.getItem('restdata'));
//                    $ionicLoading.hide();
//
//                } else {
                //    $ionicLoading.hide();
                   // alert("false");
   //             }
            });
                                  $scope.updateprice = function(id,price, productstatus) {
                     //  alert(id);
                     //  alert(price);
                      // alert(productstatus);
                 var j;
                if (productstatus == true) 
                {
                    if(JSON.parse($window.localStorage.getItem('customize')))
                    {
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                        $rootScope.k[id]=price;
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                          $rootScope.totalprice = parseInt($scope.baseprice);
                          console.log($rootScope.k);
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]);
                console.log($rootScope.totalprice);
                    }
                    else
                    {
                        $rootScope.k[id]=price;
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                        $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
                   console.log($rootScope.totalprice);
                    }
                }
                if (productstatus == false) 
                {
                    if(JSON.parse($window.localStorage.getItem('customize')))
                    {
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                        $rootScope.k[id]=0;
                        //$rootScope.k.removeItem(id,$rootScope.k);
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                          $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]);
                    }
                    else
                    {
                        //$rootScope.k.removeItem(id,$rootScope.k);
                        $rootScope.k[id]=0;
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                         $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
                    }
                }
  console.log($rootScope.totalprice);
            };
                  
                  $rootScope.k={};
            $scope.updateradioprice = function(id,price) 
            { 
               // alert(id);
              //  alert(price);
               var j;
               if(JSON.parse($window.localStorage.getItem('customize')))
               {
                    $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                    $rootScope.k[id]=price;
                    $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                    $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                    $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                      $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
                  console.log($rootScope.totalprice);
               }
               else
               {
                    $rootScope.k[id]=price;
                    $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                     $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
               }
               console.log($rootScope.totalprice);
            };   
  $scope.formdata= function(){
                       $scope.formdata1= function(){
                    $scope.radiodata=[];
                   console.log($scope.data);
                angular.forEach($scope.data, function(values, keys) {
                    console.log(values);
                    if(keys == "chck") 
                    {
                        angular.forEach(values, function(values, keys) 
                        {
                            if (values == true) 
                            {
                                $scope.radiodata.push(keys);
                            }
                        });
                    } 
                    else if(keys == "radio") 
                    {
                        angular.forEach(values, function(values, keys) 
                        {
                            $scope.radiodata.push(values);
                        });
                    } 
                    else 
                    {
                        $scope.radiodata.push(values);
                        $scope.parent_id=values;
                    }
                });
              
                $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
    console.log($scope.radiodata);
    $window.localStorage.setItem('associate_data',JSON.stringify($scope.radiodata));
                for (var i = 0; i < $scope.radiodata.length; i++) {
                  //  alert($scope.radiodata[i]+"//"+$scope.parent_id)
                    $scope.cart = {
                        Product: {
                            id: $scope.radiodata[i],
                        parent_id: $scope.parent_id,
                        },
                        User: {
                            uid: $rootScope.userid
                        },
                        Quantity: {
                            qty: 1
                        },
                        SnId: {
                            sid: $rootScope.snid
                        }};
                    //console.log($scope.cart);
       $ionicLoading.show();
                    $http.post(Base_URL+'api/shop/cart', $scope.cart).success(function(rest) {
                        console.log(rest);
                        if (rest.error == "0") {
                            $ionicLoading.hide();
                       //  alert(rest.data);
                            $scope.count();
                           
                            $scope.udata = {
                                User: {
                                    uid: $rootScope.userid
                                },
                                SnId: {
                                    sid: $rootScope.snid
                                }};
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                                console.log(response);
                                if (response.error == 0) {
                                  
                                    $ionicLoading.hide();
                                     $rootScope.cartitem = response.data[1];
                             $rootScope.cartitem = response.data[1];
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.total = response.data[0].total;
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                                   
                                } else {
                                    console.log("error");
                                    $ionicLoading.hide();
                                }
                            });
    $scope.ldata = $window.localStorage.getItem('restdata');
                   // console.log($scope.kdata);
                    $ionicLoading.show();
                    $rootScope.data1=[];
                    $rootScope.data2=[];

                        
                        } else {
                            console.log("error");
                            $ionicLoading.hide();
                        }
                     //   $state.go("menu.cart2");
                    });
                }
            }
                        if($window.localStorage.getItem('deliverymethod') != $window.localStorage.getItem('ordermethoddine')){
                     //   alert("Remove dine in cart")
                        $scope.userid=$window.localStorage.getItem("user_id");
                                console.log($scope.userid);
                                $scope.udata={
                                    User:{
                                        uid:$scope.userid
                                    }
                                };
                                console.log($scope.udata);
                           //     alert("ppp");
                                $http.post(Base_URL+'/api/shop/removeitemsall',$scope.udata)
                                    .success(function(response){
                                       // alert("Remove DineIn cart");
                                     
                                        console.log(response);
                                         $scope.formdata1();
                                        $window.localStorage.setItem('ordermethoddine', '1')
                                        //$window.localStorage.removeItem('pick');
                                   });
                        
                      }else{
                        //alert("error")
                         $scope.formdata1();
                        
                      }
                   
        }
            
                  
                    ///////////////////////asso///////////////////////////////////
//                 
                    $scope.userid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
                    $scope.uniqueID = JSON.parse($window.localStorage.getItem('User_Data')).uniqueID;
                       $scope.display = function (items) {
                           if(items == undefined){
                             var my = $ionicPopup.show({
                                    template:"Cart is empty",
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          my.close();
                                      
                                        }}
                                    ]
                                  });     
                               
                               
                               
                               
                               
                        //  alert("Cart is empty");
                       }else{
                        var carts = [];
                        $scope.udata = {
                            User: {
                                uid: $scope.userid
                            },
                            SnId: {
                                sid: $scope.uniqueID
                            }};
                        console.log($scope.udata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function (response) {
                            $ionicLoading.hide();
                            console.log(response);
                         $rootScope.cartitem = response.data[1];
                            $rootScope.surchargepickup = response.surcharge;
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.totalpick = response.data[0].total;
                                    console.log($rootScope.totalpick);
                                    $rootScope.total=parseFloat($rootScope.surchargepickup)+parseFloat($rootScope.totalpick);
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                            if (response.error == "0")
                            {

                              //  alert("data there");
                                $scope.cart = response.data[1];
                                $window.localStorage.setItem('cart', JSON.stringify(response.data[1]));
                                $window.localStorage.setItem('cart_data', JSON.stringify(response));
                                $rootScope.numbitemsd = response.data[0].order_item_count;
                               // $rootScope.numbitems = response.data[0].quantity;
                                console.log($rootScope.numbitemsd);
                                if ($rootScope.numbitemsd > 1) {
                                    $rootScope.item = "Items";
                                } else {
                                    $rootScope.item = "Item";
                                    //$rootScope.total = response.data[0].total;
                                    //console.log($rootScope.total);
                                  //  $window.localStorage.setItem('subtotal', JSON.stringify($rootScope.total));
                                    //$state.go("menu.cart")
                                }
                                $state.go("menu.cart");
                            } else {
                                // alert("Cart is empty");
                                console.log("noresponse");
                                //$ionicLoading.hide();		
                            }
                        });
                    };
                
                      
                  }
                    
                 

                    
                    $rootScope.prodid = $stateParams.prodid;
                    console.log($rootScope.prodid);
                    $scope.userid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
                    $scope.unique = JSON.parse($window.localStorage.getItem('User_Data')).uniqueID;
                    console.log($scope.userid);
                    console.log($scope.unique);
                    $scope.count = function () 
                    { 
                        //alert("count function");
                        var carts = [];
                        $scope.udata = {
                            User: {
                                uid: $scope.userid
                            },
                            SnId: {
                                sid: $scope.unique
                            }};
                        console.log($scope.udata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                            $rootScope.cartitem = response.data[1];
                            //$rootScope.item = response.data[0].order_item_count;

                            $rootScope.qnt = response.data[0];
                            if (response.error == "0")
                            {

                               // alert("data there");
                                $scope.cart = response.data[1];
                                $window.localStorage.setItem('cart', JSON.stringify(response.data[1]));

                                $rootScope.numbitemsd = response.data[0].order_item_count;

                                if ($rootScope.numbitemsd > 1) {
                                    $rootScope.item = "Items";
                                } else {
                                    $rootScope.item = "Item";
                                    $rootScope.total = response.data[0].total;
                                  //  $window.localStorage.setItem('subtotal', JSON.stringify($rootScope.total));


                                }
                            } else {
                                console.log("noresponse");
                                //$ionicLoading.hide();		
                            }
                        });
                    };
                })

        .controller('menuFood2Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $window, $http,$ionicLoading,Base_URL,$state,$ionicPopup) {
                        console.log(JSON.parse($window.localStorage.getItem('prodct_ifgg')));
            //**************** remove **********//
                         $scope.remove_dish = function($cart_id, product_id) {
                           //  alert(product_id);
                           //  alert($cart_id);
				 $scope.adata = {
                Product: {
                    id: product_id
                }};
				$http.post(Base_URL+'api/products/getsingleproduct', $scope.adata).success(function(rest) {
					console.log(rest.list.Product.AssoPro);
					if(rest.list.Product.AssoPro != null){
						console.log(rest.list.Product);
						
						
                        angular.forEach($rootScope.cartitem, function(value1,index1){
							console.log(value1.Cart.product_id);
							angular.forEach(rest.list.Product.AssoPro,function(value2,index2){
								//console.log(value2.Product.id);
		//alert(value1.Cart.product_id+"//"+value2.Product.id)
	if(value1.Cart.product_id== value2.Product.id){
		$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
                    $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.dinetotal.total));
                            $rootScope.qnt = response.data[0];
                              
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
						
                     //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
	}else if(value1.Cart.product_id==rest.list.Product.id){
				$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
							  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                 $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.dinetotal.total));
                            $rootScope.qnt = response.data[0];
                               
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
                      // $window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });	

	}
									//alert(value1.Cart.id)
			
								})	
	});
	
					}else{
					
						$scope.cartdata = {
                    Cart: {
                        id: $cart_id
                    }};
					 $http.post(Base_URL+'shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                 $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.dinetotal.total));
                            $rootScope.qnt = response.data[0];
                                if($rootScope.product_details.length == 0){
                                    $scope.data.disabled = 1;
                                }
                               else{
                                   $scope.data.disabled = 0;
                                  // $window.location.reload()
                               }
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
         //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
				
					}
					
					
				});
		/* 		 $timeout(function() {
     //$window.location.reload(); //close the popup after 3 seconds for some reason
  }, 5000); */


            };
              //**************** remove **********//
            
            
                    //********************** ass****************//
                    $rootScope.k={};
                var ass = [];
            $scope.data = {};

                $scope.adata = {
                Product: {
                    id: JSON.parse($window.localStorage.getItem('prodct_ifgg'))
                }};
            $ionicLoading.show();
            $http.post(Base_URL+'api/products/getsingleproduct', $scope.adata).success(function(rest) {
                console.log(rest);
                $ionicLoading.hide();
                if (rest.error == 0) {
                       $scope.add_product = rest.list.Product;
                     $scope.baseprice=$scope.add_product.price;
                      $rootScope.totalprice=$scope.baseprice;
                    //$rootScope.test_id =$scope.add_product.id;
                    $scope.data.parent_id = $scope.add_product.id;
                  console.log($scope.add_product);
                    var asso = [];
                    asso = rest.list.Product.AssoPro;
                    //console.log(asso);
//                             $scope.asso1=rest.list.Product.AssoPro;
                    var subcat = [];
                    var ass = [];
                    console.log(asso);
//                              
                    var k = 0;
                    var l = 0;
                    angular.forEach(asso, function(value, index) {
//    
   console.log(subcat);
//    alert(subcat.length);
//    alert(subcat[parseInt(k)-1])
                        if ((subcat.length > 0) && (subcat[parseInt(l) - 1].DishSubcat.id.indexOf(value.DishSubcat.id) != -1)){

                            console.log(subcat[parseInt(k) - 1].DishSubcat);
                            ass[k].push(value);
                            subcat.push(value);
                        } else {
                            k++;
                            ass[k] = [];
                            ass[k].push(value);
                            subcat.push(value);

                        }
                        l++;

                    });
                    console.log(ass);
                    $scope.ass = ass;

                    $scope.actualdata = [];


                    angular.forEach($scope.ass, function(keys, values) {
                        $scope.actual = [];
                        $scope.testdata = [];
                        var i = 0;
                           console.log(keys);
                        angular.forEach(keys, function(values, index) {

                            console.log(values);
                            if (values.DishSubcat.ismultiple == "1") {
                                console.log(index + "hello");
                                $scope.testdata[index.toString()] = values;
                                $scope.testdata[index.toString()]["optiontype"] = "chkbox";

                            }
                            if (values.DishSubcat.ismultiple == "0") {
                                console.log(index + "hi");
                                $scope.testdata[index.toString()] = values;
                                $scope.testdata[index.toString()]["optiontype"] = "radiobtn";
                                console.log(values.DishSubcat.ismultiple);
                            }
                            $scope.actual.push($scope.testdata);
                            i++;
                            console.log($scope.testdata);
                        });
                        $scope.actualdata.push($scope.testdata);
                        console.log($scope.actual);

                    });
                    console.log($scope.actualdata);
                    var dish_catid=[];
                    $scope.maindata=[];
                    var productss=[];
                    var index2=[];
                    angular.forEach($scope.actualdata, function(value, index){
                        console.log(value)
                        if(dish_catid.indexOf(parseInt(value[0].DishCategory.id))==-1){
                            dish_catid.push(parseInt(value[0].DishCategory.id));
                            index2.push(parseInt(value[0].DishCategory.id));
                            $scope.maindata.push(value[0]);
                            console.log(dish_catid);
                            console.log(value[0].Product);
                            $scope.index= index2.indexOf(parseInt(value[0].DishCategory.id));
                           $scope.firstdata=value[0].Product
                             $scope.maindata[$scope.index].Product=[];
                             console.log($scope.maindata);
                             console.log(value[0].Product);
                             $scope.maindata[$scope.index].Product.push($scope.firstdata)
                           
                          }else{
                              dish_catid.push(parseInt(value[0].DishCategory.id));
                              console.log(dish_catid)
                             $scope.index= dish_catid.indexOf(parseInt(value[0].DishCategory.id))
                            productss.push(value[0].Product);
                            $scope.maindata[$scope.index].Product.push(value[0].Product);
                          }
                        
                        
                        
                    })
                    console.log($scope.maindata);
                     console.log($window.localStorage.getItem('restdata'));
                    $ionicLoading.hide();
                    
//                    $scope.add_product = rest.list.Product;
//                     $scope.baseprice=$scope.add_product.price;
//                      $rootScope.totalprice=$scope.baseprice;
//                    //$rootScope.test_id =$scope.add_product.id;
//                    $scope.data.parent_id = $scope.add_product.id;
//                  console.log($scope.add_product);
//                    var asso = [];
//                    asso = rest.list.Product.AssoPro;
//                    //console.log(asso);
////                             $scope.asso1=rest.list.Product.AssoPro;
//                    var subcat = [];
//                    var ass = [];
//                    console.log(asso);
////                              
//                    var k = 0;
//                    var l = 0;
//                    angular.forEach(asso, function(value, index) {
////    
//   console.log(subcat);
////    alert(subcat.length);
////    alert(subcat[parseInt(k)-1])
//                        if ((subcat.length > 0) && (subcat[parseInt(l) - 1].DishSubcat.id.indexOf(value.DishSubcat.id) != -1)) {
//
//                            console.log(subcat[parseInt(k) - 1].DishSubcat);
//                            ass[k].push(value);
//                            subcat.push(value);
//                        } else {
//                            k++;
//
//                            ass[k] = [];
//                            ass[k].push(value);
//                            subcat.push(value);
//
//                        }
//                        l++;
//
//                    });
//                    console.log(ass);
//                    $scope.ass = ass;
//
//                    $scope.actualdata = [];
//
//
//                    angular.forEach($scope.ass, function(keys, values) {
//                        $scope.actual = [];
//                        $scope.testdata = [];
//                        var i = 0;
////                             console.log(keys);
//                        angular.forEach(keys, function(values, index) {
//
//                            console.log(values);
//                            if (values.DishSubcat.ismultiple == "1") {
//                                console.log(index + "hello");
//                                $scope.testdata[index.toString()] = values;
//                                $scope.testdata[index.toString()]["optiontype"] = "chkbox";
//
//                            }
//                            if (values.DishSubcat.ismultiple == "0") {
//                                console.log(index + "hi");
//                                $scope.testdata[index.toString()] = values;
//                                $scope.testdata[index.toString()]["optiontype"] = "radiobtn";
//                                console.log(values.DishSubcat.ismultiple);
//                            }
//                            $scope.actual.push($scope.testdata);
//                            i++;
//                            console.log($scope.testdata);
//                        });
//                        $scope.actualdata.push($scope.testdata);
//                        console.log($scope.actual);
//
//                    });
//                    console.log($scope.actualdata);
//                     console.log($window.localStorage.getItem('restdata'));
//                    $ionicLoading.hide();

                } else {
                    $ionicLoading.hide();
                  //  alert("false");
                }
            });
                                  $scope.updateprice = function(id,price, productstatus) {
                   //    alert(id);
                   //    alert(price);
                    //   alert(productstatus);
                 var j;
                if (productstatus == true) 
                {
                    if(JSON.parse($window.localStorage.getItem('customize')))
                    {
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                        $rootScope.k[id]=price;
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                          $rootScope.totalprice = parseInt($scope.baseprice);
                          console.log($rootScope.k);
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]);
                console.log($rootScope.totalprice);
                    }
                    else
                    {
                        $rootScope.k[id]=price;
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                        $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
                   console.log($rootScope.totalprice);
                    }
                }
                if (productstatus == false) 
                {
                    if(JSON.parse($window.localStorage.getItem('customize')))
                    {
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                        $rootScope.k[id]=0;
                        //$rootScope.k.removeItem(id,$rootScope.k);
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                        $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                          $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]);
                    }
                    else
                    {
                        //$rootScope.k.removeItem(id,$rootScope.k);
                        $rootScope.k[id]=0;
                        $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                         $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
                    }
                }
  console.log($rootScope.totalprice);
            };
                  
                  $rootScope.k={};
            $scope.updateradioprice = function(id,price) 
            { 
                //alert(id);
              //  alert(price);
               var j;
               if(JSON.parse($window.localStorage.getItem('customize')))
               {
                    $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                    $rootScope.k[id]=price;
                    $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                    $rootScope.k=JSON.parse($window.localStorage.getItem('customize'));
                    $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                      $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
                  console.log($rootScope.totalprice);
               }
               else
               {
                    $rootScope.k[id]=price;
                    $window.localStorage.setItem('customize',JSON.stringify($rootScope.k));
                     $rootScope.totalprice = $scope.baseprice;
                    for(j in $rootScope.k)
                    $rootScope.totalprice = parseInt($rootScope.totalprice) + parseInt($rootScope.k[j]); 
               }
               console.log($rootScope.totalprice);
            };
                    //***********************add to cart*********?/////
                      $scope.formdata= function(){
                          $scope.formdata2= function(){
                    $scope.radiodata=[];
                   console.log($scope.data);
                angular.forEach($scope.data, function(values, keys) {
                    console.log(values);
                    if(keys == "chck") 
                    {
                        angular.forEach(values, function(values, keys) 
                        {
                            if (values == true) 
                            {
                                $scope.radiodata.push(keys);
                            }
                        });
                    } 
                    else if(keys == "radio") 
                    {
                        angular.forEach(values, function(values, keys) 
                        {
                            $scope.radiodata.push(values);
                        });
                    } 
                    else 
                    {
                        $scope.radiodata.push(values);
                        $scope.parent_id=values;
                    }
                });
              
                $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
    console.log($scope.radiodata);
    $window.localStorage.setItem('associate_data',JSON.stringify($scope.radiodata));
                for (var i = 0; i < $scope.radiodata.length; i++) {
                  //  alert($scope.radiodata[i]+"//"+$scope.parent_id)
                    $scope.cart = {
                        Product: {
                            id: $scope.radiodata[i],
                        parent_id: $scope.parent_id,
                        },
                        User: {
                            uid: $rootScope.userid
                        },
                        Quantity: {
                            qty: 1
                        },
                        SnId: {
                            sid: $rootScope.snid
                        }};
                    //console.log($scope.cart);
       $ionicLoading.show();
                    $http.post(Base_URL+'api/shop/cart', $scope.cart).success(function(rest) {
                        console.log(rest);
                        if (rest.error == "0") {
                           // $ionicLoading.hide();
                         //   alert(rest.data);
                            $scope.count();
                           
                            $scope.udata = {
                                User: {
                                    uid: $rootScope.userid
                                },
                                SnId: {
                                    sid: $rootScope.snid
                                }};
                           // $ionicLoading.show();
                            $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                                console.log(response);
                                if (response.error == 0) {
                                  
                                    $ionicLoading.hide();
                                     $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.dinetotal.total));
                            $rootScope.qnt = response.data[0];
                                   
                                } else {
                                    console.log("error");
                                    $ionicLoading.hide();
                                }
                            });
    $scope.ldata = $window.localStorage.getItem('restdata');
                    console.log($scope.kdata);
                    $ionicLoading.show();
                    $rootScope.data1=[];
                    $rootScope.data2=[];

                        } else {
                            console.log("error");
                            $ionicLoading.hide();
                        }
                     //   $state.go("menu.cart2");
                    });
                }
            }
            if($window.localStorage.getItem('deliverymethod') != $window.localStorage.getItem('ordermethodpick')){
                      //  alert("method changes")
                         $scope.userid=$window.localStorage.getItem("user_id");
                                $scope.udata={
                                    User:{
                                        uid:$scope.userid
                                    }
                                };
                                console.log($scope.udata);
         
                                $http.post(Base_URL+'/api/shop/removeitemsall',$scope.udata)
                                    .success(function(response){
                                       // alert("Remove Pickup cart");
                                        $scope.formdata2();
                                        $window.localStorage.setItem('ordermethodpick', '0')
                                        console.log(response);
                                        //$window.localStorage.removeItem('pick');
                                   });
                       
                      }else{
                     //   alert("error")
                       $scope.formdata2();
                    }
        }
                  
                  
                    //********************** ass****************//
                    $scope.userid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
                    $scope.uniqueID = JSON.parse($window.localStorage.getItem('User_Data')).uniqueID;
                    $scope.display = function (items) {
                       // alert(items);
                       if(items == undefined){
                           
                            var mycart = $ionicPopup.show({
                                    template:"Cart is empty",
                                    scope: $scope,
                                    cssClass: 'value_sec',
                                    buttons: [
                                      { text: '<span class="oky">Okay</span>',
                                      onTap: function(e) {
                                          mycart.close();
                                      
                                        }}
                                    ]
                                  });     
                               
                         // alert("Cart is empty");
                       }else{ 
                           //alert("else");
                       
                        var carts = [];
                        $scope.udata = {
                            User: {
                                uid: $scope.userid
                            },
                            SnId: {
                                sid: $scope.uniqueID
                            }};
                        console.log($scope.udata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                            $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.dinetotal.total));
                            $rootScope.qnt = response.data[0];
                            if (response.error == "0")
                            {

                              //  alert("data there");
                                $scope.cart = response.data[1];
                                $window.localStorage.setItem('cartdine', JSON.stringify(response));
                               // $window.localStorage.setItem('cart_data', JSON.stringify(response));
console.log()
                    $rootScope.numbitemsd = response.data[0].order_item_count;
                               // $rootScope.numbitemsd = response.data[0].quantity;

                                if ($rootScope.numbitemsd > 1) {
                                    console.log($rootScope.numbitemsd);
                                    $rootScope.item = "Items";
                                } else {
                                    $rootScope.item = "Item";
                                    $rootScope.total = response.data[0].total;
                                    $window.localStorage.setItem('subtotaldine', JSON.stringify($rootScope.total));
                                    // $state.go("menu.cart2");
                                }
                                $state.go("menu.cart2");
                            } 
                            else 
                            {
                            // alert("Cart is empty");
                                console.log("noresponse");
                                //$ionicLoading.hide();		
                            }
                        });
                    };
             }    
                      
                    $window.localStorage.getItem('ordermethodpick')
                        $rootScope.price = $stateParams.price;
                    console.log($rootScope.price);
                    $rootScope.prodid = $stateParams.prodid;
                    console.log($rootScope.prodid);
                    $scope.userid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
                    $scope.unique = JSON.parse($window.localStorage.getItem('User_Data')).uniqueID;
                    console.log($scope.userid);
                    console.log($scope.unique);
                    $scope.count = function ()
                    { 
                      //  alert("count function");
                        var carts = [];
                        $scope.udata = {
                            User: {
                                uid: $scope.userid
                            },
                            SnId: {
                                sid: $scope.unique
                            }};
                        console.log($scope.udata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function (response) {
                            console.log("oooo");
                            console.log(response);
                            console.log("oooo");
                            $ionicLoading.hide();
                            $rootScope.cartitem = response.data[1];
                            $rootScope.item = response.data[0].order_item_count;
                      
                            $rootScope.qnt = response.data[0];
                            if (response.error == "0")
                            {

                            //    alert("data there");
                                $scope.cart = response.data[1];
                                $window.localStorage.setItem('cartdine', JSON.stringify(response.data[1]));
                                 

                                $rootScope.numbitemsd = response.data[0].order_item_count;
                                console.log($rootScope.numbitemsd);
                                if ($rootScope.numbitemsd > 1) {
                                   // if(response.error == "0" && response.data[0].order_item_count>=0)
                                    $rootScope.item = "Items";
                                } else {
                                    $rootScope.item= "Item";
                                    $rootScope.total = response.data[0].total;
                                    $window.localStorage.setItem('subtotaldine', JSON.stringify($rootScope.total));

                                }
                            } else {
                              //  alert("Cart is empty")
                                //$ionicLoading.hide();		
                            }
                        });
                    };
            })

        .controller('mainMenuCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $http, $state, $rootScope, $window,$ionicLoading,Base_URL) {
//                    $rootScope.name = $stateParams.name;
//                    console.log($rootScope.name);
//
//                    $rootScope.restid = $stateParams.restid;
//                    console.log($scope.restid);
//                    $rootScope.logo = $stateParams.logo;
//
//                    $rootScope.dis = $stateParams.dis;
//                    console.log($rootScope.dis);
                   // $window.localStorage.setItem('restidpickk', JSON.stringify(restidpick));
                   $scope.pickmenu=function(pickmid)
                   {
                       
                 $rootScope.mid=pickmid;
                      $scope.rest_id = JSON.parse($window.localStorage.getItem('restidpickk'));
                    var subcat = [];
                    $scope.cdata = {
                        DishSubcat: {id: pickmid},
                        Restaurant: {id:  $scope.rest_id}};

                    console.log($scope.cdata);
                    $ionicLoading.show();
                    if (pickmid)
                        $http.post(Base_URL+'api/restaurants/dishsubcat', $scope.cdata).success(function (response)
                        {
                            $ionicLoading.hide();
                            console.log(response);
                            $rootScope.subcatl1 = response.data;
                            $state.go('menu.subcategorylist1');
                        }
                        );
            }
$scope.rest_id = JSON.parse($window.localStorage.getItem('restidpickk'));
                    $scope.rdata = {
                        Restaurant: {
                            id: $scope.rest_id 
                        }
                    };
                    console.log($scope.rdata);
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/restaurants/getresmenu/', $scope.rdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response);
                        $rootScope.resmenu1 = response.data.cat;


                        //$state.go('menu.menusubcategorylist');
                    });



                })
        .controller('mainMenu2Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $http, $state, $rootScope,$window,$ionicLoading,Base_URL) {
//                     console.log($rootScope.description);
//                    $rootScope.name = $stateParams.name;
//                    console.log($rootScope.name);
//                    $rootScope.restid = $stateParams.restid;
//                    console.log($scope.restid);
//                    $rootScope.address = $stateParams.address;
//                    console.log($rootScope.address);
//                    $rootScope.logo = $stateParams.logo;
//                    $rootScope.city = $stateParams.city;
//                    console.log($rootScope.city);
//                    
                    
//$rootScope.dis=$stateParams.dis;
//alert($window.localStorage.getItem('ordermethodpick'))
               $scope.dinemenu=function(menuid)
               {
                     $window.localStorage.setItem('menuidd', JSON.stringify(menuid));
                   
                   $scope.rest_id = JSON.parse($window.localStorage.getItem('restm'));
                   // $rootScope.id = $stateParams.id;
                    var subcat = [];
                    $scope.cdata = {
                        DishSubcat: {
                            id:menuid
                        },
                        Restaurant: {
                            id:$scope.rest_id 
                        }};

                    console.log($scope.cdata);
                    $ionicLoading.show();
                    if (menuid)
                        $http.post(Base_URL+'api/restaurants/dishsubcat', $scope.cdata).success(function (response)
                        {
                            $ionicLoading.hide();
                            console.log(response);
                            $rootScope.subcat = response.data;
                          $state.go('menu.menusubcategorylist');
                        }
                                
                        );
                   
               }
                   // console.log($stateParams.dis);
                  //$window.localStorage.setItem('restm', JSON.stringify(restiddd));
                  $scope.rest_id = JSON.parse($window.localStorage.getItem('restm'));
                    $scope.rdata = {
                        Restaurant: {
                            id:$scope.rest_id 
                        }
                    };
                    console.log($scope.rdata);
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/restaurants/getresmenu/', $scope.rdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response);
                        $rootScope.resmenu = response.data.cat;


                        //$state.go('menu.menusubcategorylist');
                    });
                })


        .controller('menusubcategorylistCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $http,$ionicLoading,Base_URL,$window,$state) {
                   

//alert($window.localStorage.getItem('ordermethodpick'))
                    $scope.submenu11=function(menuid)
                    
                    {
                        
                         $scope.rest_id = JSON.parse($window.localStorage.getItem('restm'));
                      console.log($scope.rest_id );
                 // $rootScope.id= JSON.parse($window.localStorage.getItem('menuidd'));
               $window.localStorage.setItem('menuid1', JSON.stringify(menuid));
                    $scope.cdata = {
                        Restaurant: {
                            dishid: menuid,
                            id: $scope.rest_id 
                            
                        }
                    };
                    console.log($scope.cdata );
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/products/getproductbyid', $scope.cdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response.list);
                        $rootScope.menuitem = response.list;
                        $state.go('menu.menuItems2');
                    });
                

                    }
                   $scope.rest_id = JSON.parse($window.localStorage.getItem('restm'));
                $rootScope.id= JSON.parse($window.localStorage.getItem('menuidd'));
                   console.log( $rootScope.id);
                    ///$rootScope.id = $stateParams.id;
                    var subcat = [];
                    $scope.cdata = {
                        DishSubcat: {
                            id: $rootScope.id
                        },
                        Restaurant: {
                            id:$scope.rest_id 
                        }};

                    console.log($scope.cdata);
                    $ionicLoading.show();
                    if ($rootScope.id)
                        $http.post(Base_URL+'api/restaurants/dishsubcat', $scope.cdata).success(function (response)
                        {
                            $ionicLoading.hide();
                            console.log(response);
                            $rootScope.subcat = response.data;
                        }
                        );

                })
        .controller('subcategorylist1Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $http,$ionicLoading,Base_URL,$window,$state) {
                    $rootScope.name = $stateParams.name;
                    console.log($rootScope.name);
                    $rootScope.restid = $stateParams.restid;
                    $rootScope.id = $stateParams.id;
                    $rootScope.logo = $stateParams.logo;
                    console.log($rootScope.restid);
                    console.log($rootScope.id);
                    console.log($stateParams.dis);
                   $scope.rest_id = JSON.parse($window.localStorage.getItem('restidpickk'));
                   console.log($scope.rest_id);
                   $scope.picksubmenu11=function(dissubcattid)
                   {
                        $rootScope.iddd=dissubcattid;
                        $scope.cdata = {
                        Restaurant: {
                            dishid: dissubcattid,
                            id: $scope.rest_id
                        }
                    };
                    console.log($scope.cdata);
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/products/getproductbyid', $scope.cdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response.list);
                        $rootScope.menuitem1 = response.list;
                        $state.go('menu.menuItems');
                    });
                       
                   }
                    var subcat = [];
                    $scope.cdata = {
                        DishSubcat: {id: $rootScope.mid},
                        Restaurant: {id:  $scope.rest_id}};

                    console.log($scope.cdata);
                    $ionicLoading.show();
                    if ($rootScope.mid)
                        $http.post(Base_URL+'api/restaurants/dishsubcat', $scope.cdata).success(function (response)
                        {
                            $ionicLoading.hide();
                            console.log(response);
                            $rootScope.subcat1 = response.data;
                        }
                        );



                })
        .controller('menuItemsCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $http,$ionicLoading,Base_URL,$window,$state) {
//                    $rootScope.name = $stateParams.name;
//                    console.log($rootScope.name);
                    //$rootScope.id = $stateParams.id;
                   // $rootScope.logo = $stateParams.logo;
                   // $rootScope.restid = $stateParams.restid;
                   // console.log($rootScope.restid);
                    //console.log($rootScope.id);
                    //$rootScope.dis = $stateParams.dis;
                    // $scope.rest_id = JSON.parse($window.localStorage.getItem('restm'));
                      
 $scope.rest_id = JSON.parse($window.localStorage.getItem('restidpickk'));
                    $scope.cdata = {
                        Restaurant: {
                            dishid:$rootScope.iddd,
                            id: $scope.rest_id 
                        }
                    };
                    console.log($scope.cdata);
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/products/getproductbyid', $scope.cdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response.list);
                        $rootScope.menuitem1 = response.list;
                    });

$scope.piskmenu=function(pdfid){
    $window.localStorage.setItem('prodctpick_ifgg',JSON.stringify(pdfid));
                     console.log(JSON.parse($window.localStorage.getItem('prodctpick_ifgg')));
    //alert(pdfid)
                       
                        
                        $scope.addata = {
                        Product: {
                            id: pdfid
                        }};
                    console.log($scope.addata);
                    $http.post(Base_URL+'api/products/getsingleproduct', $scope.addata) .success(function (response) {
                                console.log(response);
                           $rootScope.poodetails=response.list.Product;
//                               
$state.go('menu.menuFood');
    
});
};



                })

        .controller('menuItems2Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $http,$ionicLoading,Base_URL,$window,$state) {
                   // alert($window.localStorage.getItem('ordermethodpick'))
                    $scope.menufood2=function(pid){
                  //   alert(pid);
                     $window.localStorage.setItem('prodct_ifgg',JSON.stringify(pid));
                     console.log(JSON.parse($window.localStorage.getItem('prodct_ifgg')));
                        $rootScope.prodid = pid;
                        
                        $scope.addata = {
                        Product: {
                            id: pid
                        }};
                    console.log($scope.addata);
                    $http.post(Base_URL+'api/products/getsingleproduct', $scope.addata) .success(function (response) {
                                console.log(response);
                           $rootScope.pdetails=response.list.Product;
//                               
$state.go('menu.menuFood2');
                                
                            });
                    }
//                   
                      $scope.rest_id = JSON.parse($window.localStorage.getItem('restm'));
                     $rootScope.id= JSON.parse($window.localStorage.getItem('menuid1'));

                    $scope.cdata = {
                        Restaurant: {
                            dishid:$rootScope.id,
                            id: $scope.rest_id 
                            
                        }
                    };
                    console.log($scope.cdata );
                    $ionicLoading.show();
                    $http.post(Base_URL+'api/products/getproductbyid', $scope.cdata).success(function (response)
                    {
                        $ionicLoading.hide();
                        console.log(response.list);
                        $rootScope.menuitem = response.list;
                    });
                })




        .controller('cartCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $rootScope, $window, $http,$ionicLoading,Base_URL,$state) {
                    
                    ///////////////////remove/////////////////////////////
                                             $scope.remove_dish = function($cart_id, product_id) {
                           //  alert(product_id);
                            // alert($cart_id);
				 $scope.adata = {
                Product: {
                    id: product_id
                }};
				$http.post(Base_URL+'api/products/getsingleproduct', $scope.adata).success(function(rest) {
					console.log(rest.list.Product.AssoPro);
					if(rest.list.Product.AssoPro != null){
						console.log(rest.list.Product);
						
						
                        angular.forEach($rootScope.cartitem, function(value1,index1){
							console.log(value1.Cart.product_id);
							angular.forEach(rest.list.Product.AssoPro,function(value2,index2){
								//console.log(value2.Product.id);
		//alert(value1.Cart.product_id+"//"+value2.Product.id)
	if(value1.Cart.product_id== value2.Product.id){
		$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                $rootScope.cartitem = response.data[1];
                             $rootScope.cartitem = response.data[1];
                            
                             $rootScope.surchargepickup = response.surcharge;
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.totalpick = response.data[0].total;
                            $rootScope.numbitemsd= response.data[1].length;
                                    console.log($rootScope.totalpick);
                                    $rootScope.total=parseFloat($rootScope.surchargepickup)+parseFloat($rootScope.totalpick);
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                              
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
						
                     //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
	}else if(value1.Cart.product_id==rest.list.Product.id){
				$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
							  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                   $rootScope.cartitem = response.data[1];
                             $rootScope.cartitem = response.data[1];
                            $rootScope.surchargepickup = response.surcharge;
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.totalpick = response.data[0].total;
                                    console.log($rootScope.totalpick);
                                    $rootScope.total=parseFloat($rootScope.surchargepickup)+parseFloat($rootScope.totalpick);
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                               
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
                      // $window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });	

	}
									//alert(value1.Cart.id)
			
								})	
	});
	
					}else{
					
						$scope.cartdata = {
                    Cart: {
                        id: $cart_id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                                  $rootScope.cartitem = response.data[1];
                             $rootScope.cartitem = response.data[1];
                            $rootScope.surchargepickup = response.surcharge;
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.totalpick = response.data[0].total;
                                    console.log($rootScope.totalpick);
                                    $rootScope.total=parseFloat($rootScope.surchargepickup)+parseFloat($rootScope.totalpick);;
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                                    $rootScope.numbitemsd = response.data[0].order_item_count;
                                if($rootScope.product_details.length == 0){
                                    $scope.data.disabled = 1;
                                }
                               else{
                                   $scope.data.disabled = 0;
                                  // $window.location.reload()
                               }
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
         //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
				
					}
					
					
				});
		/* 		 $timeout(function() {
     //$window.location.reload(); //close the popup after 3 seconds for some reason
  }, 5000); */


            }; 
                    ///////////////////remove/////////////////////////////
                    
                    $rootScope.image = $stateParams.image;
                    $rootScope.dis = $stateParams.dis;


                    $scope.userid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
                    $scope.uniqueID = JSON.parse($window.localStorage.getItem('User_Data')).uniqueID;
                    console.log($scope.userid);
                    console.log($scope.uniqueID);
                    $scope.display = function () {
                        var carts = [];
                        $scope.udata = {
                            User: {
                                uid: $scope.userid
                            },
                            SnId: {
                                sid: $scope.uniqueID
                            }};
                        console.log($scope.udata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function (response) {
                            $ionicLoading.hide();
                            console.log(response);
                            $rootScope.cartitem = response.data[1];
                            $rootScope.surchargepickup = response.surcharge;
                            console.log($rootScope.surchargepickup)
                           // $rootScope.item = response.data[0];
                            $rootScope.qnt = response.data[0];
                            $rootScope.totalpick = response.data[0].total;
                                    console.log($rootScope.totalpick);
                                    $rootScope.total=parseFloat($rootScope.surchargepickup)+parseFloat($rootScope.totalpick);
                                    console.log($rootScope.total);
                                    $window.localStorage.setItem('subtotal1', JSON.stringify($rootScope.total));
                            if (response.error == "0")
                            {

                              //  alert("data there");
                                $scope.cart = response.data[1];
                                $window.localStorage.setItem('cart', JSON.stringify(response.data[1]));
                                $window.localStorage.setItem('cart_data', JSON.stringify(response));
$rootScope.numbitemsd = response.data[0].order_item_count;
                               // $rootScope.numbitems = response.data[0].quantity;
                                console.log($rootScope.numbitemsd);
                                if ($rootScope.numbitemsd > 1) {
                                    $rootScope.item = "Items";
                                } else {
                                    $rootScope.item = "Item";
                                    //$rootScope.total = response.data[0].total;
                                    //console.log($rootScope.total);
                                  //  $window.localStorage.setItem('subtotal', JSON.stringify($rootScope.total));
                                    //$state.go("menu.cart")
                                }
                                $state.go("menu.cart");
                            } else {
                               //  alert("Cart is empty");
                                console.log("noresponse");
                                //$ionicLoading.hide();		
                            }
                        });
                    };
                    $scope.display();
                    $scope.data = {
                        showDelete: false
                    };

                    $scope.edit = function (item) {
                        alert('Edit Item: ' + item.id);
                    };
                    $scope.share = function (item) {
                        alert('Share Item: ' + item.id);
                    };

                    $scope.moveItem = function (item, fromIndex, toIndex) {
                        $scope.items.splice(fromIndex, 1);
                        $scope.items.splice(toIndex, 0, item);
                    };

                    $scope.onItemDelete = function (item) {
                        $scope.items.splice($scope.items.indexOf(item), 1);
                    };

                    $scope.removeitem = function ($cart_id)
                    {
                     //   alert("remove");
                        //var carts = [];
                        //$rootScope.cart='';
                        $scope.cartdata = {
                            Cart: {
                                id: $cart_id
                            }};
                   //    alert("Item remove");
                        console.log($cart_id);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function (response) {
                            $ionicLoading.hide();
                       //     alert("Item removed");

                            //    document.getElementById('cart').style.display = 'none';
                            console.log(response);
                            $scope.display();
//			$scope.taxes();

                        });
                    }
                    $scope.inc = function ($cart_id)
                    {
                        $scope.cartdata = {
                            Cart: {
                                id: $cart_id
                            }};
                        console.log($scope.cartdata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/increaseqty', $scope.cartdata).success(function (response) {
                           // alert("INC");
$ionicLoading.hide();
                            console.log(response);
                             
                            //console.log(response.data);
                            console.log($scope.cartdata);
                            $scope.display();
                        });

                    }
                    $scope.dec = function ($cart_id)
                    {
                        $scope.cartdata = {
                            Cart: {
                                id: $cart_id
                            }};
                        $ionicLoading.show();
                        console.log($cart_id);
                        if ($cart_id > 1) {
                            $http.post(Base_URL+'api/shop/decreaseqty', $scope.cartdata).success(function (response) {
                             //   alert("DEC");
                             $ionicLoading.hide();
                                console.log(response);
                                
                                $scope.display();

                            });
                        } else {
                          //  alert("cannot");
                        }
                    }
//                    $scope.next=function(){
////                        if($rootScope.total<300){
////                            alert("Minimum order is 300");
////                        }
////                         if($rootScope.total>=300){
//                           $state.go("menu.checkout");
////                        }
//                        
//                    };
    $scope.nextpickup=function(){
       
        
         var day1 = [];
                    $scope.data = {};
                    var date = new Date();
                    $rootScope.n = date.getDate();
                    $scope.day_id = {
                        time: {
                            id: 1
                        }
                    };
                    $http.post(Base_URL+'api/shop/time', $scope.day_id).success(function (response)
                    {
                       console.log("bhumika");
                       console.log(response);
                        $rootScope.cardIndex='0';
                        $rootScope.card2p = response.day;
                        //$rootScope.timecard = response.time[0];
                        $rootScope.timeIndex='0';
                        $rootScope.datep=  response.day;
                        $rootScope.timep =  response.time;
                        // $rootScope.day=response.day; 
                       
                       $rootScope.date_length = $rootScope.datep.length;
                       //var final = $rootScope.day[0];
                        //var values  = final.split("-");
                        // var val1 = values[0];
                        //console.log(val1);
                        
                        $rootScope.timep = response.time;
                        console.log($rootScope.timep);
                        $scope.data.timep = "";
                        
                        });
                        $scope.userid=JSON.parse($window.localStorage.getItem("user_id"));
                        $scope.restid=JSON.parse ($window.localStorage.getItem("restidpickk"));
 //console.log($scope.userid);
 //console.log($scope.restid);
                    $scope.rpdata = {
                Restaurant: {
                    id: $scope.restid
                    },
                    user_id:$scope.userid
                };
                console.log($scope.rpdata);
                $ionicLoading.show();
                $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rpdata)
                .success(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $rootScope.reservationdetailpick=response.data;
              //  console.log($rootScope.reservationdetail);
                $rootScope.webdetp = response.data.website;
                });
                        
                        
                        
                   $state.go("menu.reservationpickup")
                   
                   
                    
       
    }


                })

        .controller('cart2Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
                function ($scope, $stateParams, $window, $http, $rootScope,$ionicLoading,Base_URL,$state,$ionicPopup) {
                   //**************** remove **********//
                         $scope.remove_dish = function($cart_id, product_id) {
                         //    alert(product_id);
                           //  alert($cart_id);
				 $scope.adata = {
                Product: {
                    id: product_id
                }};
				$http.post(Base_URL+'api/products/getsingleproduct', $scope.adata).success(function(rest) {
					console.log(rest.list.Product.AssoPro);
					if(rest.list.Product.AssoPro != null){
						console.log(rest.list.Product);
						
						
                        angular.forEach($rootScope.cartitem, function(value1,index1){
							console.log(value1.Cart.product_id);
							angular.forEach(rest.list.Product.AssoPro,function(value2,index2){
								//console.log(value2.Product.id);
		//alert(value1.Cart.product_id+"//"+value2.Product.id)
	if(value1.Cart.product_id== value2.Product.id){
		$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                             $rootScope.surcharge = response.surcharge;
                              console.log($rootScope.surcharge);
                            $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                            $rootScope.total= $rootScope.dinetotal.total
                            console.log($rootScope.total);
                            $rootScope.totaldine=parseFloat($rootScope.surcharge)+parseFloat($rootScope.total);
                            console.log($rootScope.totaldine);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.totaldine));
                            $rootScope.qnt = response.data[0];
                             $rootScope.numbitemsd = response.data[0].order_item_count;
                              
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
						
                     //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
	}else if(value1.Cart.product_id==rest.list.Product.id){
				$scope.cartdata = {
                    Cart: {
                        id: value1.Cart.id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
							  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                              $rootScope.surcharge = response.surcharge;
                              console.log($rootScope.surcharge);
                            $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                            $rootScope.total= $rootScope.dinetotal.total
                            console.log($rootScope.total);
                            $rootScope.totaldine=parseFloat($rootScope.surcharge)+parseFloat($rootScope.total);
                            console.log($rootScope.totaldine);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.totaldine));
                            $rootScope.qnt = response.data[0];
                             $rootScope.numbitemsd = response.data[0].order_item_count;
                               
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
                      // $window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });	

	}
									//alert(value1.Cart.id)
			
								})	
	});
	
					}else{
					
						$scope.cartdata = {
                    Cart: {
                        id: $cart_id
                    }};
					 $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function(rest) {
                    console.log(rest);
                    if (rest.error == 0) {
						  $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                            if (response.error == 0) {
                                $ionicLoading.hide();
                              $rootScope.surcharge = response.surcharge;
                              console.log($rootScope.surcharge);
                            $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                            $rootScope.total= $rootScope.dinetotal.total
                            console.log($rootScope.total);
                            $rootScope.totaldine=parseFloat($rootScope.surcharge)+parseFloat($rootScope.total);
                            console.log($rootScope.totaldine);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.totaldine));
                            $rootScope.qnt = response.data[0];
                             $rootScope.numbitemsd = response.data[0].order_item_count;
                                if($rootScope.product_details.length == 0){
                                    $scope.data.disabled = 1;
                                }
                               else{
                                   $scope.data.disabled = 0;
                                  // $window.location.reload()
                               }
                            } else {
                                $ionicLoading.hide();
                                console.log("error");
                            }
                        });
         //$window.location.reload();
                    } else {
                        $ionicLoading.hide();
                    }
                });
				
					}
					
					
				});
		/* 		 $timeout(function() {
     //$window.location.reload(); //close the popup after 3 seconds for some reason
  }, 5000); */


            };
            
              //**************** remove **********//
               
               
               
                    
//                    $rootScope.image = $stateParams.image;
//                    $rootScope.dis = $stateParams.dis;
//                    console.log($rootScope.dis);
//                    $rootScope.city = $stateParams.city;
//                    console.log($rootScope.city);
//                    $rootScope.address = $stateParams.address;
//                    console.log($rootScope.address);
//                    $rootScope.logo = $stateParams.logo;
//
//                    $rootScope.restname = $stateParams.restname;
//                    console.log($rootScope.restname);
 
                    
                    $scope.userid = JSON.parse($window.localStorage.getItem('User_Data')).user_id;
                    $scope.uniqueID = JSON.parse($window.localStorage.getItem('User_Data')).uniqueID;
                    console.log($scope.userid);
                    console.log($scope.uniqueID);
                    $scope.display = function () {
                        var carts = [];
                        $scope.udata = {
                            User: {
                                uid: $scope.userid
                            },
                            SnId: {
                                sid: $scope.uniqueID
                            }};
                        console.log($scope.udata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                              $rootScope.surcharge = response.surcharge;
                              console.log($rootScope.surcharge);
                            $rootScope.cartitem = response.data[1];
                            console.log($rootScope.cartitem);
                            $rootScope.dinetotal = response.data[0];
                            console.log($rootScope.dinetotal);
                             console.log($rootScope.dinetotal.total);
                            $rootScope.total= $rootScope.dinetotal.total
                            console.log($rootScope.total);
                            $rootScope.totaldine=parseFloat($rootScope.surcharge)+parseFloat($rootScope.total);
                            console.log($rootScope.totaldine);
                             $window.localStorage.setItem('carttotaldine', JSON.stringify($rootScope.totaldine));
                            $rootScope.qnt = response.data[0];
                            if (response.error == "0")
                            {

                              //  alert("data there");
                                $scope.cart = response.data[1];
                                $window.localStorage.setItem('cartdine', JSON.stringify(response));
                               // $window.localStorage.setItem('cart_data', JSON.stringify(response));

                    $rootScope.numbitemsd = response.data[0].order_item_count;
                               // $rootScope.numbitemsd = response.data[0].quantity;

                                if ($rootScope.numbitemsd > 1) {
                                    $rootScope.item = "Items";
                                } else {
                                    $rootScope.item = "Item";
                                    $rootScope.total = response.data[0].total;
                                    $window.localStorage.setItem('subtotaldine', JSON.stringify($rootScope.totaldine));
                                    // $state.go("menu.cart2");
                                }
                                $state.go("menu.cart2");
                            } 
                            else 
                            {
                           //  alert("Cart is empty");
                                console.log("noresponse");
                                //$ionicLoading.hide();		
                            }
                        });
                    };
                   // $scope.taxes=function(){
// $scope.subtotal = JSON.parse(($window.localStorage.getItem('total')));
// 
//   $rootScope.restid=JSON.parse( $window.localStorage.getItem('rest_id'));
//  $scope.data = {
//  Restaurant:{
//  id:  $rootScope.restid
//  }};
// $http.post(Base_URL+'api/restaurants/tax',$scope.data).success(function(response){
// console.log(response);
// 
//  $scope.tax = response.data[0].Tax.tax;
  
  //console.log($scope.tax);
// $scope.subtotal = JSON.parse(($window.localStorage.getItem('total')));
// console.log($scope.subtotal);
// $rootScope.taxinr = ($scope.tax*$scope.subtotal)/100;
// console.log($rootScope.taxinr);
// $rootScope.grandtotal = ($rootScope.taxinr*1) + ($scope.subtotal*1);
// $rootScope.grandtotalfinal = $window.localStorage.setItem('grandtotal',JSON.stringify($rootScope.grandtotal));
// });
//};
                    
                    
                    
                    
                    
                    
                    $scope.display();
                    $scope.data = {
                        showDelete: false
                    };

                    $scope.edit = function (item) {
                        alert('Edit Item: ' + item.id);
                    };
                    $scope.share = function (item) {
                        alert('Share Item: ' + item.id);
                    };

                    $scope.moveItem = function (item, fromIndex, toIndex) {
                        $scope.items.splice(fromIndex, 1);
                        $scope.items.splice(toIndex, 0, item);
                    };

                    $scope.onItemDelete = function (item) {
                        $scope.items.splice($scope.items.indexOf(item), 1);
                    };

                    $scope.removeitem = function ($cart_id)
                    {
                      //  alert("remove");
                        //var carts = [];
                        //$rootScope.cart='';
                        $scope.cartdata = {
                            Cart: {
                                id: $cart_id
                            }};
                     //   alert("Item remove");
                        console.log($cart_id);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/removeitems', $scope.cartdata).success(function (response) {
                            $ionicLoading.hide();
                          //  alert("Item removed");

                            //    document.getElementById('cart').style.display = 'none';
                            console.log(response);
                            $scope.display();
//			$scope.taxes();

                        });
                    }
                    $scope.inc = function ($cart_id)
                    {
                        $scope.cartdata = {
                            Cart: {
                                id: $cart_id
                            }};
                        console.log($scope.cartdata);
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/increaseqty', $scope.cartdata).success(function (response) {
                          //  alert("INC");
$ionicLoading.hide();
                            console.log(response);
                            
                            //console.log(response.data);
                            console.log($scope.cartdata);
                            $scope.display();
                        });

                    }
                    $scope.dec = function ($cart_id)
                    {
                        $scope.cartdata = {
                            Cart: {
                                id: $cart_id
                            }};
                        console.log($cart_id);
                        $ionicLoading.show();
                        if ($cart_id > 1) {
                            $http.post(Base_URL+'api/shop/decreaseqty', $scope.cartdata).success(function (response) {
                             //   alert("DEC");
                              $ionicLoading.hide();
                             
                                console.log(response);
                                $scope.display();

                            });
                        } else {
                        //    alert("cannot");
                        }
                    }
                     $scope.nextdine=function(){
                        
                        $rootScope.minimum=JSON.parse($window.localStorage.getItem('min_order'));
                        if($rootScope.totaldine<$rootScope.minimum){
                             var day1 = [];
                    $scope.data = {};

                   // alert("abc");
                  //  console.log($scope.data.date);
                    var date = new Date();
                    $rootScope.n = date.getDate();
                    console.log(date);
                    console.log($rootScope.n);
                   // alert($scope.date);
                    $scope.day_id = {time: {id: 1}};


                    $http.post(Base_URL+'api/shop/time', $scope.day_id).success(function (response)
                    {
                        console.log("bhumika");
                        console.log(response);
                        
                         //$rootScope.card2 = response.day[0];
                        $rootScope.card2 = response.day[0];
                        $rootScope.timecard = response.time[0];
                        console.log($rootScope.timecard);
                        $rootScope.date =  response.day;
                         $rootScope.time =  response.time;
                           // if($rootScope.timecard != )
                       
                        // var res=[];
                        // res = $rootScope.card2.split('-');
                        // console.log(res[0]+-+res[1]);
                        // $rootScope.card = res[0]+'-'+res[1];
                        
                        // $rootScope.day=response.day; 
                       
                       $rootScope.date_length = $rootScope.date.length;
                        //var final = $rootScope.day[0];
                        //var values  = final.split("-");
                        // var val1 = values[0];
                        //console.log(val1);

                        $rootScope.time = response.time;
                        console.log($rootScope.time);
                        $scope.data.time = "";

                    });
                           // alert("Your order is low to Minimum Order");
                            var myPopup = $ionicPopup.show({
                         template: '<span class="kdd">KD</span>' + $rootScope.minimum,
                         title:'Minimum Order',
                         subTitle: '<p>Your order is low</p>',
                         cssClass: 'value_sec',
                         scope: $scope,
                         buttons: [
                      {  text: '<span class="oky">Okay</span>',
                      onTap: function(e) {
                             }}
                    ]
                  });
                        }
                         if($rootScope.totaldine >=$rootScope.minimum){
                           $scope.data = {};
						    var day1 = [];
                    $scope.data = {};

                   // alert("abc");
                  //  console.log($scope.data.date);
                    var date = new Date();
                    $rootScope.n = date.getDate();
                   // console.log(date);
                   // console.log($rootScope.n);
                   // alert($scope.date);
                    $scope.day_id = {time: {id: 1}};


                    $http.post(Base_URL+'api/shop/time', $scope.day_id).success(function (response)
                    {
                        console.log("bhumika");
                       console.log(response);
                       
                         //$rootScope.card2 = response.day[0];
                         $rootScope.cardIndex='0';
                        $rootScope.card2 = response.day;
                        //$rootScope.timecard = response.time[0];
                       $rootScope.timeIndex='0';
                       
//                        var res=[];
//                        res = $rootScope.card2.split('-');
//                        console.log(res[0]+-+res[1]);
//                        $rootScope.card = res[0]+'-'+res[1];
                      $rootScope.date =  response.day;
                         $rootScope.time =  response.time;
                        // $rootScope.day=response.day; 
                       
                       $rootScope.date_length = $rootScope.date.length;
                       //var final = $rootScope.day[0];
                        //var values  = final.split("-");
                        // var val1 = values[0];
                        //console.log(val1);
                        
                        $rootScope.time = response.time;
                        console.log($rootScope.time);
                        $scope.data.time = "";

                    });
//                  
                             $scope.userid = JSON.parse($window.localStorage.getItem("user_id"));
                            $scope.restid = JSON.parse($window.localStorage.getItem("restm"));
                            console.log($scope.userid);
                            console.log($scope.restid);
                            $scope.rdata = {
                                Restaurant: {
                                    id: $scope.restid

                                },
                                user_id: $scope.userid
                            };
                            console.log($scope.rdata);
                            $ionicLoading.show();
                            $http.post(Base_URL + 'api/restaurants/restaurantbyid', $scope.rdata)
                                    .success(function (response) {
                                        $ionicLoading.hide();
                                        console.log(response);
                                        $rootScope.reservationdetail = response.data;
                                        console.log($rootScope.reservationdetail);
                                    });
                           $state.go("menu.reservation");
                        }
                        
                    };
                })

        .controller('checkoutCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope,$window,$state){
                $scope.data ={};
//                  if ($window.localStorage.getItem('billing_address')) {
//                $scope.data.firstname = $window.localStorage.getItem('billing_address').fname;
//                $scope.data.lastname = $window.localStorage.getItem('billing_address').lname ;
//                $scope.data.email = $window.localStorage.getItem('billing_address').email ;
//                $scope.data.phone = $window.localStorage.getItem('billing_address').phone ;
//                $scope.data.add = $window.localStorage.getItem('billing_address').address ;
//                $scope.data.city = $window.localStorage.getItem('billing_address').city ;
//                $scope.data.zip = $window.localStorage.getItem('billing_address').zip ;
//                $scope.data.state = $window.localStorage.getItem('billing_address').state ;
//            }else{
             $scope.check=function(){
            $scope.user_address ={fname:$scope.data.firstname,lname:$scope.data.lastname,email:$scope.data.email,phone:$scope.data.phone,city:"null",state:"null",zip:"null",address:"null"};
            $window.localStorage.setItem('billing_address', JSON.stringify($scope.user_address));
            console.log(JSON.parse($window.localStorage.getItem('billing_address')));
            $state.go('menu.paymentInformations');
                };
         //   }
        })

// .controller('paymentCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// // You can include any angular dependencies as parameters for this function
// // TIP: Access Route Parameters for your page via $stateParams.parameterName
//             function ($scope, $stateParams) {


//             }])
.controller('checkout1Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$rootScope,$http,$state,$window,Base_URL,$ionicPopup) {
                 $scope.data ={};
                if (localStorage.getItem('address')) {
                 $scope.data.firstname = JSON.parse(localStorage.getItem('address')).Table.fname;
                 console.log($scope.data.firstname);
                $scope.data.lastname = JSON.parse(localStorage.getItem('address')).Table.lname ;
                $scope.data.email = JSON.parse(localStorage.getItem('address')).Table.email ;
                $scope.data.phone = JSON.parse(localStorage.getItem('address')).Table.phone ;
                $scope.data.add = JSON.parse(localStorage.getItem('address')).Table.address ;
            }
               
                $scope.check1=function(){
                if($window.localStorage.getItem("carddate")== "undefined")
                  {
                   var datem = $ionicPopup.show({
                             title:'Select date and time for Reservation',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              datem.close();
                             
                                            }}
                                        ]
                                      });
                } else{          
                $window.localStorage.setItem('billing_address', JSON.stringify($scope.user_address));
                $rootScope.restid=JSON.parse( $window.localStorage.getItem('restm'));
             //   $rootScope.table_pricing1=JSON.parse( $window.localStorage.getItem('table_pricing1'));
                $rootScope.usr_id= JSON.parse($window.localStorage.getItem("user_id")) ; 
            //    alert($rootScope.usr_id);
                
                $rootScope.person= JSON.parse($window.localStorage.getItem("person")) ;
                $rootScope.timecard= $window.localStorage.getItem("timecard") ;
                $rootScope.card= $window.localStorage.getItem("carddate") ;
                $rootScope.fname =   $scope.data.firstname;
                $rootScope.lname =   $scope.data.lastname;
                $rootScope.email =   $scope.data.email;
                $rootScope.phone =   $scope.data.phone; 
                $rootScope.address =   "null";
             //   alert($rootScope.fname);
                    
                    
                    
                    $scope.rdata = {
                         Table:{
                           rid :$rootScope.restid,
                           fname : $scope.data.firstname ,
                           lname : $rootScope.lname,
                          address : $rootScope.address,
                           phone : $rootScope.phone,
                           number :$rootScope.person,
                           date :$rootScope.card,
                           time :$rootScope.timecard,
                           email :$rootScope.email,
                           uid:$rootScope.usr_id,
                           tid:0

                         }};

                       console.log($scope.rdata);
                      // alert(JSON.parse($scope.rdata));
                       localStorage.setItem('address', JSON.stringify($scope.rdata));
                   console.log(JSON.parse(localStorage.getItem('address')));
                       console.log("i am clicked");
                       console.log($scope.data.firstname);
                       $http.post(Base_URL+'api/shop/tablesucess',$scope.rdata).success(function(response){
                       console.log(response);
              
                       //console.log(response.id);
                       
                        // alert(response.id);
                         $rootScope.tableid=response.table_no;
                         console.log(response.data);
//                         $rootScope.tablenumber=response.data.table_no;
//                         console.log($rootScope.tablenumber);
//                    
                         
                        $window.localStorage.setItem('tableid1', JSON.stringify($rootScope.tableid));
                        
                     //   alert(JSON.parse($window.localStorage.getItem('tableid1')));
                   console.log(JSON.parse($window.localStorage.getItem('tableid1')));
                    

                              
                $state.go('menu.paymentinformation1');
            
                });
                };
}

            })

  

        .controller('confirmationCtrl', 
            function ($rootScope,$scope,$window,$state,Base_URL,$http,$ionicHistory,$ionicSideMenuDelegate,$ionicLoading,$cordovaGeolocation) {
//            $rootScope.order_sum=JSON.parse(localStorage.getItem('order_summery'));
//            console.log($rootScope.order_sum);
         //   alert(JSON.stringify($rootScope.order_sum)); 
            $scope.userid=$window.localStorage.getItem("user_id");
           // alert($window.localStorage.getItem('deliverymethod'))
           if(parseInt($window.localStorage.getItem('deliverymethod'))==1){
         $scope.usdata={
             user:{
                 uid:$scope.userid
             }
         };
        // alert("pickup");
          $http.post(Base_URL+'/api/Users/ccresponse',$scope.usdata).success(function (response) {
                console.log(response);
              //   alert("pickup");
              //  alert(JSON.stringify(response));
                $rootScope.pickdata=response.data;
                $rootScope.order=response.data.Order;
               })
           }
           if(parseInt($window.localStorage.getItem('deliverymethod'))== '0'){
                $scope.usdata={
             user:{
                 uid:$scope.userid
             }
         };
       //  alert("thfhht");
          $http.post(Base_URL+'/api/Users/ccresponsedinein',$scope.usdata).success(function (response) {
            //  alert("dinein");
                console.log(response);
            //    alert(JSON.stringify(response));
                $rootScope.pickdata=response.data;
                console.log($rootScope.pickdata);
                $rootScope.order=response.data.TableReservation;
               })
           }
         
         $scope.remove=function(){
             $window.localStorage.removeItem('carddate');
              $window.localStorage.removeItem('timecard');
             $window.localStorage.removeItem('search_lat');
             $window.localStorage.removeItem('search_long');
             $window.localStorage.removeItem('cart_data');
              $scope.userid=$window.localStorage.getItem("user_id");
                                console.log($scope.userid);
                                $scope.udata={
                                    User:{
                                        uid:$scope.userid
                                    }
                                };
                                console.log($scope.udata);
                              //  alert("ppp");
                                $http.post(Base_URL+'/api/shop/removeitemsall',$scope.udata)
                                    .success(function(response){
                                         $rootScope.table="";
                                         $rootScope.order="";       
                                         delete $rootScope.numbitemsd;
                                         delete $rootScope.table   ; 
                                         delete $rootScope.order; 
                                        //alert("remove dine");
                                     
                                        console.log(response);
                                         $ionicHistory.nextViewOptions({
                disableBack: true,
//                disableAnimate: true,
//                historyRoot: true
            });
//            $ionicHistory.clearCache();
//            $ionicHistory.clearHistory();
//            $ionicSideMenuDelegate.toggleLeft();
                                       // $state.go("menu.nearestRestaurants");
                                         function deg2rad(deg) {
                        rad = deg * Math.PI / 180; // radians = degrees * pi/180
                        return rad;
                    }


                    // round to the nearest 1/1000
                    function round(x) {
                        return Math.round(x * 1000) / 1000;
                    }

                    $rootScope.findDistance = function (lat, long, lat1, long1) {
                        //alert(lat);
                        var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km, Rm, Rk, frm;

                        var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
                        var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
                        // get values for lat1, lon1, lat2, and lon2
                        t1 = lat;// 30.7206541;
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
                        a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
                        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
                        dm = c * Rm; // great circle distance in miles
                        dk = c * Rk; // great circle distance in km

                        // round the results down to the nearest 1/1000
                        mi = round(dm);
                        km = round(dk);
                        return km;


                    };
                 
                  
   
   
                 
               
                                                //   alert("dine in");
                      $window.localStorage.setItem('count',JSON.stringify(0));
                      var restdetails = [];
                       // alert("hello");
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                       // alert("dkjnvks");
                        $cordovaGeolocation.getCurrentPosition(posOptions)

                                .then(function (position) {

                                    console.log(position);
                                    //  alert("hgdh");
                                    // console.log('position');

                                    $rootScope.lat = position.coords.latitude;
                                    $rootScope.long = position.coords.longitude;
                                    $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                    $window.localStorage.setItem('long', JSON.stringify($rootScope.long));

                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                          
                                        }};
                                    console.log($scope.restdata);

                                     $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        console.log(response);
                                        $ionicLoading.hide();
                                        if (response.isSuccess === "true") {
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');

                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                            }

                                            $rootScope.resname1 = restdetails;
                                           //  $scope.modal.hide();
                                              $rootScope.clat =  $scope.lat;
                                    $rootScope.clong = $scope.long;
                                  //  $rootScope.favrest = response.data.favrest;
								
                                    //onsole.log($rootScope.favrest);
                                    $ionicLoading.hide();
                                    console.log($rootScope.clat);
                                    console.log($rootScope.clong);
			var link = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$rootScope.clat+','+$rootScope.clong+'&key=AIzaSyBgdQ9h1BXJOBQ2pgMn4eXz_sffMn7vyrE';
                            $http.post(link).success(function(response) {
                            console.log(response);
                            //document.getElementById('place').innerHTML= res[3];
                             cityname = response.results[0].formatted_address.split(',');
                        console.log(cityname[3]);
                        $rootScope.search =cityname[3]; 
                       //  document.getElementById('place').innerHTML= cityname[3];
                            if (response.isSuccess = true){
								
							}else{}
							});
                                                        
                                                        
                                                        
                  $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                        alert("Restaurant types not fetch successfully");
                    }
                }).error(function(){
                    alert("Error Occur");
                    $ionicLoading.hide();
                });
                                            //alert("hello");
                                            $state.go("menu.nearestRestaurants");
                                        } else {
                                            alert('Please Check');
                                            $state.go("menu.nearestRestaurants");
                                        }
//                                            $window.localStorage.setItem('distance', $rootScope.resname1);
//                                            console.log($rootScope.resname1);
                                              
                                            //alert($rootScope.resname1[0].distance);

                                          //  $scope.modal.hide();
                                           // alert("hello");
                                          
                                
                                
                                    });
                                });
                              
                                
                                       // $scope.addtocart2();
                                        //$window.localStorage.setItem('ordermethoddine', '1')
                                        //$window.localStorage.removeItem('pick');
                                   });
                               };

            })
//            .controller('confirmationwalletCtrl', 
//            function ($rootScope,$scope,$window,$state,$http,Base_URL) {
//                
////            $rootScope.order_wallet=JSON.parse($window.localStorage.getItem('orderwallet'));
////            console.log($rootScope.order_wallet);
//            $scope.userid=$window.localStorage.getItem("user_id");
//            
//         $scope.usdata={
//             user:{
//                 uid:$scope.userid
//             }
//         };
//         
//          $http.post(Base_URL+'/api/Users/ccresponsedinein',$scope.usdata).success(function (response) {
//               console.log(response);
//                
//
//                                        alert(JSON.stringify(response));
//                                       
//                                        $rootScope.pickdata=response.data;
//                                        
//                                        
//                                       // alert(JSON.parse(response));
//                                       // alert(response.data);
//                                        //alert(response.data.Order.total);
//                                       // $ionicLoading.hide();
////                                        if (response.error === "0") {
////                                            $rootScope.addfdd= response.data.Ad.image;
////                                             $rootScope.ghfhg= response.data.Ad.name;
////                                            console.log($rootScope.addfdd);
////                                        }else{
////                                            
////                                        } 
//                                    })
//         //   alert(JSON.stringify($rootScope.order_sum));
//       $scope.remove=function(){
//             $window.localStorage.removeItem('cart_data');
//             $scope.userid=$window.localStorage.getItem("user_id");
//                                console.log($scope.userid);
//                                $scope.udata={
//                                    User:{
//                                        uid:$scope.userid
//                                    }
//                                };
//                                console.log($scope.udata);
//                             //   alert("ppp");
//                                $http.post(Base_URL+'/api/shop/removeitemsall',$scope.udata)
//                                    .success(function(response){
//                                        //alert("remove dine");
//                                     
//                                        console.log(response);
//                                        $state.go("menu.nearestRestaurants");
//                                       // $scope.addtocart2();
//                                        //$window.localStorage.setItem('ordermethoddine', '1')
//                                        //$window.localStorage.removeItem('pick');
//                                   });
//         };
//
//            })
//            .controller('confirmation1Ctrl', 
//            function ($rootScope,$window,$scope,$state,$http,Base_URL,$ionicHistory,$ionicSideMenuDelegate) {
//         //   alert(JSON.parse ( $window.localStorage.getItem('order')));
//            var order_sum1=JSON.parse($window.localStorage.getItem('order'));
//          $rootScope.id=order_sum1.data.TableReservation.id;
//            $rootScope.firstname=order_sum1.data.TableReservation.fname;
//            $rootScope.date=order_sum1.data.TableReservation.d_day;
//            $rootScope.time=order_sum1.data.TableReservation.d_time;
//            $scope.removedata=function(){
//                
//         //  alert("wdhduheh")
//             // $window.localStorage.reset('cart');
//              $window.localStorage.removeItem('cartdine');
//              $scope.userid=$window.localStorage.getItem("user_id");
//                                console.log($scope.userid);
//                                $scope.udata={
//                                    User:{
//                                        uid:$scope.userid
//                                    }
//                                };
//                                console.log($scope.udata);
//                              //  alert("ppp");
//                                $http.post(Base_URL+'/api/shop/removeitemsall',$scope.udata)
//                                    .success(function(response){
//                                        //alert("remove dine");
//                                     
//                                        console.log(response);
//                                         $ionicHistory.nextViewOptions({
//                disableBack: true,
//                disableAnimate: true,
//                historyRoot: true
//            });
//            $ionicHistory.clearCache();
//            $ionicHistory.clearHistory();
//            $ionicSideMenuDelegate.toggleLeft();
//                                        $state.go("menu.nearestRestaurants");
//                                       // $scope.addtocart2();
//                                        //$window.localStorage.setItem('ordermethoddine', '1')
//                                        //$window.localStorage.removeItem('pick');
//                                   });
//    
//  // $window.localStorage.removeItem('carttotal');
// //  $window.localStorage.removeItem('cart_data');
//         };
//            
//            })
//            
//            
            
            .controller('orderhistoryCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$http,$rootScope,$window,$ionicLoading,$state,Base_URL,$timeout,$filter,$ionicPopup,$ionicPlatform) {
             $scope.history=function(){
                $rootScope.useriid = JSON.parse(($window.localStorage.getItem('User_Data'))); 
              $rootScope.userid = $rootScope.useriid.user_id;
              console.log($rootScope.useriid);
           
            //  console.log($steperootScope.userid);
              $scope.noMoreItemsAvailable = false;
              $scope.totalpa=1;
              $rootScope.snid = JSON.parse(($window.localStorage.getItem('User_Data'))).uniqueID;
                 $scope.all ={
                             User:{
                              id:$rootScope.userid,
                              page:0,
                              items:10
                             }
                             
                         };
                         console.log($scope.all );
                 
                        $scope.loadMore = function() {
                        $scope.allhis ={
                             User:{
                              id:$rootScope.userid,
                              page:$scope.totalpa,
                              items:10
                             }
                        };
                        console.log("fjfjfv");
                       
    $http.post(Base_URL+'api/shop/orderHistory',$scope.allhis).success(function(items) {
        console.log(items);
        console.log($scope.cancel);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if($scope.totalpa<$rootScope.checkLen){
                console.log($scope.totalcount); 
                console.log(items.data);
               
            if(items.data!=null)
{
console.log("vikkiisdiodssojhdfdfv");
 for(var i=0;i<10;i++)
 {
    $rootScope.orders.push(items.data[i]);
 }
$scope.totalpa=$scope.totalpa+1;
   console.log($rootScope.orders);
   var orders=[];
console.log($scope.totalpa+"hellidososi"); 

   var i;
   for(i=0;i<items.data.length;i++){     
       //console.log(response.data[i].OrderItem.length);
       //console.log(response.data[i].OrderItem[0].created);     
       if(parseInt(items.data[i].OrderItem.length)>0){
    for(var j=0;j<items.data[i].OrderItem.length;j++){
      // console.log(response.data[i].OrderItem[j].created);

      $rootScope.userlastcheckintime = new Date(items.data[i].OrderItem[j].created.replace(/-/g, '/'));
$scope.currentdate = new Date();
//console.log($rootScope.userlastcheckintime);
//console.log($scope.currentdate);
$scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
var secondsDiff = $scope.difference / 1000;
var minutesDiff = secondsDiff / 60;
 // var hoursDiff = minutesDiff / 60;
//console.log(minutesDiff);
items.data[i].OrderItem[j].timediff=minutesDiff;
orders.push(items.data[i]);
}
   }
   }
}
}
else
{
    console.log("ramit");
$scope.noMoreItemsAvailable = true;
}
// $rootScope.knowledgepoint=items.knowledgepoints;
});
};
 $ionicLoading.show();
 $scope.cancel = []
      $http.post(Base_URL+'api/shop/orderHistory',$scope.all)
              .success(function(response){
                  $ionicLoading.hide();
                       console.log(response);
                      if(response.error == "0")
                         {    
   console.log(response);
   $scope.totalcount=response.cnt;
   console.log($scope.totalcount);
  //var createddate = []
   $rootScope.orderdetails = response.data;
  
   //alert(JSON.parse($rootScope.orderdetails ));
   //console.log($rootScope.orderdetails);
   var orders=[];
   $rootScope.orders = response.data;
  // $rootScope.ordersjj = response.data[i].Restaurant.id;
   console.log(response.data[0].OrderItem[0].created);
   console.log(response.data);
   
 
   
   
   
   $rootScope.checkLen=Math.ceil(response.cnt/10);
   
   console.log("vikrant");
   console.log($scope.checkLen);
   console.log("vikki");
   var i;
   for(i=0;i<response.data.length;i++){ 
        if(parseInt(response.data[i].Restaurant.length)>0){
            console.log(response.data[i].Restaurant.length);
//    for(var k=0;k<response.data[i].Restaurant.length;k++){
//        angular.forEach(response.data[i].Restaurant[k].id , function(values, keys) {
//                console.log(values);
//                });
//            }
        }
      // console.log(res
       //console.log(response.data[i].OrderItem.length);
       //console.log(response.data[i].OrderItem[0].created);     
       if(parseInt(response.data[i].OrderItem.length)>0){
    for(var j=0;j<response.data[i].OrderItem.length;j++){
        
      // console.log(response.data[i].OrderItem[j].created);

      $rootScope.userlastcheckintime = new Date(response.data[i].OrderItem[j].created.replace(/-/g, '/'));
$scope.currentdate = new Date();
//console.log($rootScope.userlastcheckintime);
//console.log($scope.currentdate);
$scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
var secondsDiff = $scope.difference / 1000;
var minutesDiff = secondsDiff / 60;
//console.log(minutesDiff*30);
 // var hoursDiff = minutesDiff / 60;
//console.log(minutesDiff);
response.data[i].OrderItem[j].timediff=minutesDiff;
orders.push(response.data[i])
$state.go("menu.orderhistory");

   }
   }
   }
   }
   else{
                 var order_hist = $ionicPopup.show({
                             title:'No Order has been placed',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              order_hist.close();
                             
                                            }}
                                        ]
                                      });
 //  alert("No Order has been placed ");
   }
    });

    }
              
   $scope.cancelorder = function($id)
   {
   // alert("click");
  //  alert($id);
    
    
    $scope.data={
     order:{
      id:$id
     }
     };
     $ionicLoading.show();
    $http.post(Base_URL+'api/shop/cancelorder',$scope.data).success(function(response){
     console.log(response);
     $ionicLoading.hide();
   //  alert(JSON.stringify(response));
    
     if(response.error== "0")
     {
       $rootScope.useriid = JSON.parse(($window.localStorage.getItem('User_Data'))); 
              $rootScope.userid = $rootScope.useriid.user_id;
                    $scope.all ={
                             User:{
                              id:$rootScope.userid,
                              page:0,
                              items:10
                             }
                             
                         };
                          $ionicLoading.show();
      $http.post(Base_URL+'api/shop/orderHistory',$scope.all)
              .success(function(response){
                  $ionicLoading.hide();
                       console.log(response);
                         $rootScope.orders = response.data;
                         var orders=[];
                            var i;
   for(i=0;i<response.data.length;i++){     
       //console.log(response.data[i].OrderItem.length);
       //console.log(response.data[i].OrderItem[0].created);     
       if(parseInt(response.data[i].OrderItem.length)>0){
    for(var j=0;j<response.data[i].OrderItem.length;j++){
      // console.log(response.data[i].OrderItem[j].created);

      $rootScope.userlastcheckintime = new Date(response.data[i].OrderItem[j].created.replace(/-/g, '/'));
$scope.currentdate = new Date();
//console.log($rootScope.userlastcheckintime);
//console.log($scope.currentdate);
$scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
var secondsDiff = $scope.difference / 1000;
var minutesDiff = secondsDiff / 60;
 // var hoursDiff = minutesDiff / 60;
//console.log(minutesDiff);
response.data[i].OrderItem[j].timediff=minutesDiff;
orders.push(response.data[i]);
}
   }
   }
                         
                   });
     }
     else
     {
       //  alert("abc");
     }
    
    });
   };

$scope.redirect=function(iddd)
{
  //  alert(iddd)
    $rootScope.rest_idr=iddd;
    
    $state.go("menu.rating");
   
}
  $scope.doRefresh=function()
                     
  {
//      $window.localStorage.removeItem('search_lat');
//      $window.localStorage.removeItem('search_long');
     $window.localStorage.setItem('count',JSON.stringify(0));
      $rootScope.useriid = JSON.parse(($window.localStorage.getItem('User_Data'))); 
              $rootScope.userid = $rootScope.useriid.user_id;
              console.log($rootScope.useriid);
              console.log($rootScope.userid);
                $rootScope.snid = JSON.parse(($window.localStorage.getItem('User_Data'))).uniqueID;
                 $scope.all ={
                             User:{
                              id:$rootScope.userid,
                              page:0,
                              items:10
                             }
                             
                         };
                         // $ionicLoading.show();
      $http.post(Base_URL+'api/shop/orderHistory',$scope.all)
              .success(function(response){
                 // $ionicLoading.hide();
                       console.log(response);
                       
                      if(response.error == "0")
                         {    
   console.log(response);
  //var createddate = []
   $rootScope.orderdetails = response.data;
  
   //alert(JSON.parse($rootScope.orderdetails ));
   //console.log($rootScope.orderdetails);
   var orders=[];
   $rootScope.orders = response.data;
   console.log(response.data[0].OrderItem[0].created);
   console.log(response.data);
   var i;
   for(i=0;i<response.data.length;i++){     
       //console.log(response.data[i].OrderItem.length);
       //console.log(response.data[i].OrderItem[0].created);     
       if(parseInt(response.data[i].OrderItem.length)>0){
    for(var j=0;j<response.data[i].OrderItem.length;j++){
      // console.log(response.data[i].OrderItem[j].created);

      $rootScope.userlastcheckintime = new Date(response.data[i].OrderItem[j].created.replace(/-/g, '/'));
$scope.currentdate = new Date();
//console.log($rootScope.userlastcheckintime);
//console.log($scope.currentdate);
$scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
var secondsDiff = $scope.difference / 1000;
var minutesDiff = secondsDiff / 60;
 // var hoursDiff = minutesDiff / 60;
//console.log(minutesDiff);
response.data[i].OrderItem[j].timediff=minutesDiff;
orders.push(response.data[i])
$state.go("menu.orderhistory");

   }
   }
   }
   $scope.$broadcast('scroll.refreshComplete');
   }
   else{
   //alert("No Order has been placed ");
   }
    });
     

  };
  

  
  
  
  
  
 $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
            $state.go('menu.nearestRestaurants')
        }
    }, 1000);
    
    
    })      
  
                
              
       
         .controller('reservationhistoryCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$rootScope ,$window,$http,$ionicLoading,Base_URL,$state,$ionicPlatform,$ionicPopup) {
              $scope.reserve_his=function(){
            $rootScope.uid = JSON.parse(($window.localStorage.getItem('User_Data'))).user_id;
             $scope.noMoreReserveItemsAvailable = false;
              $scope.totalpaRes=1;
              //$scope.totalpa=0;
            $scope.all =
                    {
                        User:
                        {
                            uid:$rootScope.uid,
                            page:0,
                            items:10
                        }                       
                    };
            console.log($scope.all);
                                $scope.loadReserveMore = function() {
                                           $scope.allhis ={
                                                User:{
                                                uid:$rootScope.uid,
                                                page:$scope.totalpaRes,
                                                items:10
                                                }
                                           };
                                           console.log($scope.allhis);
                       $http.post(Base_URL+'api/shop/tablehistry',$scope.allhis).success(function(items) {
                               $scope.$broadcast('scroll.infiniteScrollComplete');
                               if($scope.totalpaRes<$rootScope.checkResLen){
                                   //console.log($scope.totalcount); 
                                   console.log(items.data);
                               if(items.data!=null)
                   {
                   console.log("vikkiisdiodssojhdfdfv");
                    for(var v=0;v<10;v++)
                    {
                       $rootScope.table.push(items.data[v]);
                          var orders=[];
                var i;
               for(i=0;i<=items.data.length;i++){
                    //console.log(response.data[i].TableReservation.d_time);
                    // console.log(items.data[i].TableReservation.created);
                    $rootScope.userlastcheckintime = new Date(items.data[i].TableReservation.created.replace(/-/g, '/'));
                    $scope.currentdate = new Date();
                  // console.log($rootScope.userlastcheckintime);
                  // console.log($scope.currentdate);
                   $scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
                   var secondsDiff = $scope.difference / 1000;
                    var minutesDiff = secondsDiff / 60;
                     // var hoursDiff = minutesDiff / 60;
                    //console.log(minutesDiff);
                    items.data[i].TableReservation.timediff=minutesDiff;
                    orders.push(items.data[i])
                   
                }
                       
                    }
                   $scope.totalpaRes=$scope.totalpaRes+1;
                     // console.log($rootScope.orders);
                   console.log($scope.totalpaRes+"hellidososi");
                   }
                   }
                   else
                   {
                       console.log("ramit");
                   $scope.noMoreReserveItemsAvailable = true;
                   }
                   // $rootScope.knowledgepoint=items.knowledgepoints;
                   });
                   };

            $ionicLoading.show();
            $http.post(Base_URL+'api/shop/tablehistry',$scope.all).success(
                    function(response)
            { 
                console.log(response);
                 
                $ionicLoading.hide();
                if(response.error == "0"){
                 $rootScope.checkResLen=Math.ceil(response.cnt/10);
   
                console.log("vikrant");
                    console.log($rootScope.checkResLen);
                console.log("vikki");
              //  var orders=[];
                $rootScope.table = response.data;
                console.log($rootScope.table);
                console.log(response.data.length);
                var orders=[];
                var i;
               for(i=0;i<=response.data.length;i++){
                   
                    //console.log(response.data[i].TableReservation.d_time);
                     console.log(response.data[i].TableReservation.created);
                    $rootScope.userlastcheckintime = new Date(response.data[i].TableReservation.created.replace(/-/g, '/'));
                    $scope.currentdate = new Date();
             //      console.log($rootScope.userlastcheckintime);
              //     console.log($scope.currentdate);
                   $scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
                   var secondsDiff = $scope.difference / 1000;
                    var minutesDiff = secondsDiff / 60;
                     // var hoursDiff = minutesDiff / 60;
           //         console.log(minutesDiff);
                    response.data[i].TableReservation.timediff=minutesDiff;
                    orders.push(response.data[i])
                    $state.go("menu.reservationhistory");
                   
                }
                
                
            }else{
                var reserve_his = $ionicPopup.show({
                             title:'No Order has been placed',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              reserve_his.close();
                             
                                            }}
                                        ]
                                      });
             // alert("No Order has been placed ");
            }
           
                });  
            }
          
                
                
                
                
           
                 $scope.doRefresh=function()
                     
  {
       $window.localStorage.setItem('count',JSON.stringify(0));

$rootScope.uid = JSON.parse(($window.localStorage.getItem('User_Data'))).user_id;
            $scope.all =
                    {
                        User:
                        {
                               uid:$rootScope.uid,
                            page:0,
                            items:10
                        }                       
                    };
            console.log($scope.all);
          //  $ionicLoading.show();
            $http.post(Base_URL+'api/shop/tablehistry',$scope.all).success(
                    function(response)
            { 
                console.log(response);
              //  $ionicLoading.hide();
              //  var orders=[];
                $rootScope.table = response.data;
                console.log($rootScope.table);
                $state.go("menu.reservationhistory");
                $scope.$broadcast('scroll.refreshComplete');
                }); 
  };
  
  
  $scope.rest_menu=function(rest_mid,dineid){
      delete $rootScope.reviews;
      delete $rootScope.reviewslenght;
      $window.localStorage.setItem('deliverymethod', dineid);
      $window.localStorage.removeItem('restiddd');
       $window.localStorage.removeItem('rest_id');
     
        $window.localStorage.setItem('restiddd', JSON.stringify(rest_mid));
  //   alert(rest_mid);
   $scope.userid=$window.localStorage.getItem("user_id");
            $rootScope.dis = $stateParams.dis;
            //console.log( $rootScope.dis);

            $scope.rdata = {
                Restaurant: {
                    id: rest_mid

                },
            user_id:$scope.userid
        };
console.log($scope.rdata);
$ionicLoading.show();
            $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rdata)
                    .success(function (response) {
                        $ionicLoading.hide();
                        console.log(response);

                        if (response.isSucess == "true") {
                            $rootScope.rest_detail = response.data;
                            $window.localStorage.setItem('rest_id', JSON.stringify(response.data.id));
                            $window.localStorage.setItem('min_order', JSON.stringify(response.data.min_order));
                            $rootScope.address = response.data.address;
                         
                        $window.localStorage.removeItem('carddate');
                        $window.localStorage.removeItem('timecard');
                        $window.localStorage.removeItem('person');
                       $state.go('menu.restaurantDetails');
                       
                       
                       
                       
                       
                       
                   }
                          $rootScope.userid = JSON.parse(localStorage.getItem('user_id'));
                        $rootScope.snid = JSON.parse(localStorage.getItem('randomid'));
                        $scope.udata = {
                            User: {
                                uid: $rootScope.userid
                            },
                            SnId: {
                                sid: $rootScope.snid
                            }};
                          console.log($scope.udata );
                        $ionicLoading.show();
                        $http.post(Base_URL+'api/shop/displaycart', $scope.udata).success(function(response) {
                            console.log(response);
                             $ionicLoading.hide();
                            if (response.error == 0) {
                                
                                 if(response.data[1].length > 0){
                               console.log(JSON.parse($window.localStorage.getItem('restm')));
                               console.log(response.data[1][0].Cart.resid);
                                if(response.data[1][0].Cart.resid !=JSON.parse($window.localStorage.getItem('restm'))){
                                 
                                     $scope.uid = (JSON.parse(localStorage.getItem('user_id')));
                $scope.udata = {User: {
                        uid:  $scope.uid
                    }};
                console.log($scope.udata);
                $ionicLoading.show();
                $http.post(Base_URL+'/api/shop/removeitemsall', $scope.udata).success(function(response) {
                    console.log(response);
                    $ionicLoading.hide();
                   
                    //alert("cart empty");
                    console.log(response);
                    if(response.error="0"){
                         $window.localStorage.removeItem('cartdine');
                         $window.localStorage.removeItem('carttotaldine');
                         delete $rootScope.numbitemsd; 
                      //$rootScope.numbitemsd="";
                    $rootScope.dinetotal="";
                    $rootScope.cartitem="";
                    
                       $ionicLoading.hide();
                         
                    }
                }) 
            }}
    }
                            }
                        );
                    });
                }
                
                           $scope.canceltable = function($id)
   {
 //   alert("click");
  //  alert($id);
    
    
    $scope.data={
     TableReservation:{
      id:$id
     }
     };
     console.log($scope.data);
    $http.post(Base_URL+'api/shop/tablecancelorder',$scope.data).success(function(response){
     console.log(response);
    // alert(JSON.stringify(response));
    
   if(response.error== "0")
    {
     //   alert(response);
        
                                           $scope.allhis ={
                                                User:{
                                                uid:$rootScope.uid,
                                                page:0,
                                                items:10
                                                }
                                           };
                                           console.log($scope.allhis);
                       $http.post(Base_URL+'api/shop/tablehistry',$scope.allhis).success(function(response) {
                           console.log(response);
                            $rootScope.table = response.data;
                console.log($rootScope.table);
                  var orders=[];
                var i;
               for(i=0;i<=response.data.length;i++){
                    //console.log(response.data[i].TableReservation.d_time);
                  //   console.log(response.data[i].TableReservation.created);
                    $rootScope.userlastcheckintime = new Date(response.data[i].TableReservation.created.replace(/-/g, '/'));
                    $scope.currentdate = new Date();
             //      console.log($rootScope.userlastcheckintime);
              //     console.log($scope.currentdate);
                   $scope.difference = parseInt($scope.currentdate - $rootScope.userlastcheckintime);
                   var secondsDiff = $scope.difference / 1000;
                    var minutesDiff = secondsDiff / 60;
                     // var hoursDiff = minutesDiff / 60;
           //         console.log(minutesDiff);
                    response.data[i].TableReservation.timediff=minutesDiff;
                    orders.push(response.data[i])
                   
                }
                
                       })
     // $window.location.reload();
    }
    else
    {
      //  alert("abc");
    }
    
    });
   };
                
                
                
 $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) {
            $state.go('menu.nearestRestaurants')
        }
    }, 1000);
            })
 
         .controller('selectOptionCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            }])
         .controller('forgetpasswordCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$ionicLoading,$http,$state,$ionicPopup,Base_URL) {
                $scope.data = {}
                 $scope.forgot_password =function(){
       $ionicLoading.show();
         var link = Base_URL+"/api/users/forgetpwd"
        var postData ={User:{username:$scope.data.email}}
        $http.post(link, postData).then(function (res){
            $scope.response = res.data;
            console.log($scope.response)
            $ionicLoading.hide();
            if($scope.response.isSucess === "true"){
                
                 var myPopup = $ionicPopup.show({
                    template: 'Check your mail to reset password',
                    title: 'Forgot Password',
                    cssClass: 'value_sec',
                    scope: $scope,
                    buttons: [
                      { text: '<span class="oky">Okay</span>',
                      onTap: function(e) {
                          $state.go('menu.step1');
                        }}
                    ]
                  });
            }
            
        });
    }


            })
         .controller('inviteCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams) {


            })
            .controller('changepasswordCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope,$window,$ionicLoading,$http,$state,$ionicPopup,Base_URL,$rootScope,$ionicHistory) {
                 $scope.data = {}
//    console.log($scope.data);
// var profile_data1=JSON.parse($window.localStorage.getItem('profile_data'));
 var profile_data1 = JSON.parse($window.localStorage.getItem('profile_data'));
  console.log(profile_data1);
 
  $rootScope.pro_email=profile_data1.profileemail;
  
 // alert($rootScope.loyalty_points1);
    $scope.userid = $window.localStorage.getItem('user_id');
   // $scope.username = JSON.parse($window.localStorage.getItem('profile_data'))
    //console.log($scope.username);
     if($scope.userid){
    $scope.changePassword = function(){
        $ionicLoading.show();
        var postData = {
           User:{
//               id:$scope.userid,
            username:$rootScope.pro_email,
            old_password:$scope.data.oldpassword,
            new_password:$scope.data.newpassword
          }
      }
      console.log(postData);
        var link = Base_URL+"/api/users/changepasswordwork ";
        $http.post(link, postData).then(function (res){
            $ionicLoading.hide();
            $scope.response = res.data;
            console.log($scope.response);
            if($scope.response.isSucess == "true"){
                $ionicLoading.hide();
                 var myPopupchange = $ionicPopup.show({
                     title: 'Password Updated Successfully',
                  //  template: 'Password Updated Successfully',
                   cssClass: 'value_sec',
                    scope: $scope,
                    buttons: [
                      { text: '<span class="oky">Okay</span>',
                      onTap: function(e) {
                          myPopupchange.close();
                          $state.go('menu.step1');
                        }}
                    ]
                  });
            }else{
                $ionicLoading.hide();
                var myPopupchange = $ionicPopup.show({
                    template: 'Old password incorrect',
                    scope: $scope,
                    buttons: [
                      { text: 'Okay',
                      onTap: function(e) {
                          myPopupchange.close();
                        }}
                    ]
                  });
            }
        });
    
    }}


            })
            .controller('ratingCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope,$stateParams,$state,$window,$http,Base_URL,$rootScope,$ionicHistory,$ionicPopup,$ionicLoading) {
               
        $scope.data = {};  
        $scope.postreviewrating=function(){
        //    alert("bhumi");
    
           // alert("restidr");
            console.log("vikki");
            console.log($scope.data);
            console.log("vikkkklli");
      // alert($scope.data.review);
   $scope.text=$scope.data.review;
   console.log($scope.text);
   $scope.food_quality=$scope.data.rating;
   $scope.punctuality=$scope.data.ratingc;
   console.log($scope.courtesy);
   $scope.courtesy=$scope.data.ratingp;
   console.log($scope.courtesy);
   $scope.price=$scope.data.ratingy;
    console.log($scope.data);

    $scope.userid=JSON.parse($window.localStorage.getItem("user_id"));

    $scope.name=JSON.parse($window.localStorage.getItem('profile_data')).profilename;
    console.log($scope.name);
    $scope.email=JSON.parse($window.localStorage.getItem('profile_data')).profileemail;
    console.log($scope.email);
    $scope.rvdata ={
    
    Review:
    {
        uid:$scope.userid,
        text :$scope.text,
        name:$scope.name,
        resid:$rootScope.rest_idr,
        email:$scope.email,
        food_quality:$scope.food_quality,
        price:$scope.price,
        punctuality:$scope.punctuality,
        courtesy:$scope.courtesy
    }
}; 
    console.log($scope.rvdata);
  //  alert($scope.rvdata);
    $ionicLoading.show();
    $http.post(Base_URL+'/api/shop/review',$scope.rvdata).success(function(response){
    console.log(response);
   // alert("my");
    if(response.error==0)
    {
        $ionicLoading.hide();
        // alert("myfdfg");
          var myreviewPopup = $ionicPopup.show({
                             title:'You have submitted the review',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              myreviewPopup.close();
                              $state.go('menu.orderhistory');
                                            }}
                                        ]
                                      });
        
    }
    else{
        $ionicLoading.hide();
                          var myreviewPopup = $ionicPopup.show({
                             title:'you already submitted a review for this order',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              myreviewPopup.close();
                              $state.go('menu.orderhistory');
                                            }}
                                        ]
                                      });
     // alert(response.msg);
     
    }
    
    });
    };
})
   .controller('menuCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams,$rootScope,$state,$window,$http,$ionicLoading,$cordovaGeolocation,Base_URL,$filter,$ionicPopup,$ionicHistory,$timeout)
    {
//                 $ionicLoading.show({ 
//                    template: '<p>Loading...</p><ion-spinner></ion-spinner>',
//                          duration:3000
//                       });
    if($window.localStorage.getItem('profile_data')){
 console.log(JSON.parse($window.localStorage.getItem('profile_data')));
  var profile_data1 = JSON.parse($window.localStorage.getItem('profile_data'));
  console.log(profile_data1);
  
  $rootScope.pro_email=profile_data1.profileemail;
  $rootScope.pro_image=profile_data1.profileimage;
  $rootScope.pro_name=profile_data1.profilename;
  $rootScope.pro_phone=profile_data1.profilephone;
  $rootScope.loyalty_points1=profile_data1.loyalty_points1;
 // alert($rootScope.loyalty_points1);
  //return false;
  console.log($rootScope.loyalty_points1);
  console.log(profile_data1.profileimage);
  console.log(profile_data1.profilename);
  console.log(profile_data1.profilephone);

    console.log(JSON.parse($window.localStorage.getItem("user_id")));
             console.log( $scope.name);
             $scope.id= JSON.parse($window.localStorage.getItem("user_id"));
//$scope.data.name= $scope.name;
//$scope.data.phone= $scope.phone;
//$scope.data.image= $scope.image;
$scope.cddata={
      user:{
          id:$scope.id
      }
  };
  console.log($scope.cddata);
$ionicLoading.show();
  $http.post(Base_URL+'/api/users/user',$scope.cddata).success(function(response)
  {
   //alert("edit");
   console.log(response);
   $ionicLoading.hide();
//   $scope.data.name=response.data[0].User.name;
//   $scope.data.phone=response.data[0].User.phone;
//   $scope.data.image=response.data[0].User.image;
  $rootScope.pro_image=response.data[0].User.image;
  $rootScope.pro_name=response.data[0].User.name;
  $rootScope.pro_phone=response.data[0].User.phone;
  $rootScope.loyalty_points1=response.data[0].User.loyalty_points;
   console.log(response.data[0].User.name);
   console.log(response.data[0].User.phone);
   console.log(response.data[0].User.image);
  // $window.location.reload();
   
  });            }else{
                   
                }
  
//  
$scope.reservepending=function(){
  var pending=[];
   
$scope.all ={
User:{
uid:$scope.id
}};
console.log($scope.all);
$http.post(Base_URL+'api/shop/tablehistry',$scope.all).success(function(response)
{ console.log(response);
                 $rootScope.table = response.data;
                    console.log($rootScope.table);
           var dates= new Date();
           $scope.sdsef = $filter('date')(new Date(), 'dd-MM-yyyy');
                   console.log($scope.sdsef);
                   console.log($rootScope.table[0].TableReservation.d_day);
                    for(var i=0;i<=$rootScope.table.length;i++){
                   if ($rootScope.table[i].TableReservation.d_day == $scope.sdsef){
                                    console.log($rootScope.table[i].TableReservation.d_day);
                                    console.log($rootScope.table[i].TableReservation.dl_status);
                    if($rootScope.table[i].TableReservation.dl_status==0){                      
                               $scope.res =  pending.push($rootScope.table[i]); 
                                $window.localStorage.setItem('status', JSON.stringify($scope.res));
                                console.log(JSON.parse($window.localStorage.getItem('status')));
                                $scope.stus =  JSON.parse($window.localStorage.getItem('status'));
                               console.log(pending); 
                               console.log(pending[0].Restaurant.name);
                               console.log(pending[0].Restaurant.created);
                               console.log(pending[0].TableReservation.no_of_people);
                               console.log(pending.length);
                               for(var j=0;j<=pending.length;j++){
                               // console.log(pending[j].Restaurant.name);
                                $scope.datepending=pending[j].Restaurant.created;
                                $scope.restan = pending[j].Restaurant.name;
                                $scope.restpeopl = pending[j].TableReservation.no_of_people;
                                console.log($scope.restan);
                                console.log($scope.restpeopl);
                                $rootScope.resta = $scope.restan;
                                  console.log($rootScope.resta);
                          
                                    }
                               }
                                  $rootScope.resta = $scope.restan;
                                  console.log($rootScope.resta);
                                $rootScope.Pending = "Pending";
                                console.log($rootScope.Pending);
                                
                                    }
                   }
                   
                   //      console.log($rootScope.table[0].TableReservation.d_day);
                   }
            );
}     



 function deg2rad(deg) {
                        rad = deg * Math.PI / 180; // radians = degrees * pi/180
                        return rad;
                    }


                    // round to the nearest 1/1000
                    function round(x) {
                        return Math.round(x * 1000) / 1000;
                    }

                    $rootScope.findDistance = function (lat, long, lat1, long1) {
                        //alert(lat);
                        var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km, Rm, Rk, frm;

                        var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
                        var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator
                        // get values for lat1, lon1, lat2, and lon2
                        t1 = lat;// 30.7206541;
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
                        a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
                        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
                        dm = c * Rm; // great circle distance in miles
                        dk = c * Rk; // great circle distance in km

                        // round the results down to the nearest 1/1000
                        mi = round(dm);
                        km = round(dk);
                        return km ;


                    };
                 
                  
   
   
                  $scope.menuu=function(){if($window.localStorage.getItem('search_lat')){ 
                            var restdetails = [];
                            $scope.lat = $window.localStorage.getItem('search_lat');
                            $scope.long = $window.localStorage.getItem('search_long');

                            $scope.restdata = {
                                data: {
                                    Restaurant: { 
                                        latitude: $scope.lat,
                                        longitude: $scope.long
                                    }
                                }
                            };
                            //console.log($scope.restdata);
                            $ionicLoading.show();
                            $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                $ionicLoading.hide();
                                if (response.isSuccess === "true") {
                                    $rootScope.resname1 = response.data.Restaurant;
                                    //console.log($rootScope.resname1);
                                   // $scope.lat = $window.localStorage.getItem('lat');
                                   // $scope.long = $window.localStorage.getItem('long');
                                    for (var i = 0; i < response.data.Restaurant.length; i++) {
                                        restdetails.push(response.data.Restaurant[i]);
                                        restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                    }

                                    $rootScope.resname1 = restdetails;
                                  //  $scope.floc = "name";
                                    //console.log($scope.floc);
                                    //$scope.closeModal1();
                                    $state.go("menu.nearestRestaurants");
                                    $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                        alert("Restaurant types not fetch successfully");
                    }
                }).error(function(){
                   // alert("Error Occur");
                    $ionicLoading.hide();
                });
                                } 
                            });
                        }else{
                      //  alert("my")
                                            var restdetails = [];
                    var restcountry = [];
                  //$scope.openModal = function () {
                       // alert("hello");
                        var posOptions = {timeout: 10000, enableHighAccuracy: true};
                       // alert("dkjnvks");
                        $cordovaGeolocation.getCurrentPosition(posOptions)

                                .then(function (position) {

                                    console.log(position);
                            $rootScope.Gps=0;
                                    //  alert("hgdh");
                                    // console.log('position');

                                        $rootScope.lat = position.coords.latitude;
                                        $rootScope.long = position.coords.longitude;
                                        $window.localStorage.setItem('lat', JSON.stringify($rootScope.lat));
                                        $window.localStorage.setItem('long', JSON.stringify($rootScope.long));

                                    $scope.coords = position.coords;
                                    $scope.restdata = {data: {
                                            Restaurant: {latitude: $rootScope.lat, longitude: $rootScope.long
                                            }
                                          
                                        }};
                                    console.log($scope.restdata);

                                     $ionicLoading.show();
                                    $http.post(Base_URL+'api/restaurants/restaurantslist/', $scope.restdata).success(function (response) {
                                        console.log(response);
                                        $ionicLoading.hide();
                                        if (response.isSuccess === "true") {    
                                              $window.localStorage.removeItem('search_lat');
                                              $window.localStorage.removeItem('search_long');
                                            $scope.lat = $window.localStorage.getItem('lat');
                                            $scope.long = $window.localStorage.getItem('long');

                                            for (var i = 0; i < response.data.Restaurant.length; i++) {
                                                restdetails.push(response.data.Restaurant[i]);
                                                restdetails[i].distance = $rootScope.findDistance($scope.lat, $scope.long, response.data.Restaurant[i].latitude, response.data.Restaurant[i].longitude);
                                           
                                            }   
                                            $rootScope.resname1 = restdetails;
                                            console.log(response.data.Restaurant[0].typename[0].RestaurantsType.name);
                                            console.log($rootScope.resname1[0].distance);

                                            $scope.modal.hide();
                                            $rootScope.clat =  $scope.lat;
                                    $rootScope.clong = $scope.long;
                                  //  $rootScope.favrest = response.data.favrest;
								
                                    //onsole.log($rootScope.favrest);
                                    $ionicLoading.hide();
                                    console.log($rootScope.clat);
                                    console.log($rootScope.clong);
			var link = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$rootScope.clat+','+$rootScope.clong+'&key=AIzaSyBgdQ9h1BXJOBQ2pgMn4eXz_sffMn7vyrE';
                            $http.post(link).success(function(response) {
                            console.log(response);
                            //document.getElementById('place').innerHTML= res[3];
                             cityname = response.results[0].formatted_address.split(',');
                        console.log(cityname[3]);
                        $rootScope.search =cityname[3]; 
                       //  document.getElementById('place').innerHTML= cityname[3];
                            if (response.isSuccess = true){
								
							}else{}
							});
                                                        
                                                        
                                                        
                  $http.post(Base_URL+'api/restaurants/getalltype')
                  .success(function(response){
                    $ionicLoading.hide();
                    console.log(response);
                    if(response.isSuccess == "true"){
                        $rootScope.rest_types = response.data;
                        console.log($rootScope.rest_types);
                       // $state.go("menu.truckdetail");
                    }else{
                        alert("Restaurant types not fetch successfully");
                    }
                }).error(function(){
                   // alert("Error Occur");
                    $ionicLoading.hide();
                });
                                            //alert("hello");
                                            $state.go("menu.nearestRestaurants");
                                        } else {
                                             var fav_lis11 = $ionicPopup.show({
                             title:"No restaurants are avialable near you, Please select another city",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              $state.go("menu.search");
                                            }}
                                        ]
                                      });
                                            $ionicLoading.hide();
                                           // alert('Please Check');
                                            //$state.go("menu.nearestRestaurants");
                                        }
                                    })
                                },
                                function(err) {
                                    $rootScope.Gps=1;
                                    var fav_lis11 = $ionicPopup.show({
                             title:"Please ON your Mobile GPS",
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                            buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              //$state.go("menu.search");
                                            }}
                                        ]
                                      });
                                   // alert(JSON.stringify(err));
      // error
    });
    
                    }
                }

                                
                                $scope.logout=function(){
                                    
//                                    $window.localStorage.removeItem('User_Data');
//                                    $window.localStorage.removeItem('count');
//                                    $window.localStorage.removeItem('profile_data');
//                                    $window.localStorage.removeItem('randomid');
//                                    $window.localStorage.removeItem('user_id')
                                    $window.localStorage.clear();
                                     // $window.localStorage.clear();
                                        localStorage.clear();
            
                                    $rootScope = '';
                                      $rootScope = undefined;
                                     $scope.userid=$window.localStorage.getItem("user_id");
                                console.log($scope.userid);
                                $scope.udata={
                                    User:{
                                        uid:$scope.userid
                                    }
                                };
                                console.log($scope.udata);
                              //  alert("ppp");
                                $http.post(Base_URL+'/api/shop/removeitemsall',$scope.udata)
                                    .success(function(response){
                                        delete $rootScope.table;
                                         delete $rootScope.order;       
                                         delete $rootScope.numbitemsd; 
                                          $window.localStorage.removeItem('User_Data');
                                     })
                                    //  console.log("ss");
                                    //$rootScope.numbitems=0;
                                    // alert('signout');
                                   // console.log($rootScope.numbitems);
                                    // console.log(JSON.parse(localStorage.getItem('User_Data')));
                                    //console.log($window.localStorage.removeItem('User_id'));
                                   // delete $rootScope.user_loggedin;
                                   // delete $rootScope.numbitems;
                                    // console.log($rootScope.numbitems);
                                    var alertPopup = $ionicPopup.alert({
                                    title: 'Signout',
                                    template: 'You have successfully logged out',
                                    cssClass: 'login_success', // String, The custom CSS class name
                                     buttons: [
                                          { text: '<span class="oky">Okay</span>',
                                          onTap: function(e) {
                                             $state.go('menu.slider');
                                             $timeout(function () {
                                            location.reload(true);
                                               }, 1000);
//                                               $ionicHistory.nextViewOptions({
//                                                 disableBack: true,        
//                                                });
                                            }}
                                        ]
                                    });
                                    alertPopup.then(function(res) {
                                  //  console.log($rootScope.numbitems);
                                   // console.log('bye')
                                    //$state.go('menu.slider');
//                                   $ionicHistory.nextViewOptions({
//               disableBack: true,
//                disableAnimate: true,
//                historyRoot: true
//            });
                                    });
                                    //$window.location.reload();
                                     }
//                                     $scope.rest_history=function(){
//                                            $rootScope.uid = JSON.parse(($window.localStorage.getItem('User_Data'))).user_id;
//            $scope.all =
//                    {
//                        User:
//                        {
//                            uid:$rootScope.uid
//                        }                       
//                    };
//            console.log($scope.all);
//            $ionicLoading.show();
//            $http.post(Base_URL+'api/shop/tablehistry',$scope.all).success(
//                    function(response)
//            { 
//                console.log(response);
//                
//               
//                $rootScope.table = response.data;
//                console.log($rootScope.table);
//                $state.go("menu.reservationhistory");
//                $ionicLoading.hide();
//            });
//                                     }
                                })
                  
            .controller('editinfoCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for ur page via $stateParams.parameterName
            function ($scope, $stateParams,$window,$http,$rootScope,Base_URL,$ionicLoading,$cordovaCamera,$ionicPopup) {
                
             $scope.data ={};
             console.log(JSON.parse($window.localStorage.getItem("user_id")));
             console.log( $scope.name);
             $scope.id= JSON.parse($window.localStorage.getItem("user_id"));
$scope.data.pro_name= $scope.pro_name;
$scope.data.pro_phone= $scope.pro_phone;
$scope.data.pro_image= $scope.pro_image;
$scope.cddata={
      user:{
          id:$scope.id
      }
  };
  console.log($scope.cddata);
  $http.post(Base_URL+'/api/users/user',$scope.cddata).success(function(response)
  {
   //alert("edit");
   console.log(response);
   $scope.data.pro_name=response.data[0].User.name;
   $scope.data.pro_phone=response.data[0].User.phone;
   $scope.data.pro_image=response.data[0].User.image;
   
   console.log(response.data[0].User.name);
   console.log(response.data[0].User.phone);
   console.log(response.data[0].User.image);
   
  });
  $scope.save_profile=function()
 {
//      alert($id)
//    alert(JSON.parse($window.localStorage.getItem('user_details')));
//    $scope.useriid = JSON.parse(($window.localStorage.getItem('user_details')));
$scope.id= JSON.parse($window.localStorage.getItem("user_id"));
console.log($scope.id);
//$scope.data.name= $scope.name;
//$scope.data.phone= $scope.phone;
//$scope.data.image= $scope.image; 
//  $scope.userid = $scope.user_id;
//  $scope.name = $scope.data.name;
//  $scope.phone = $scope.data.phone;
  $scope.cdata={
      user:{
          id:$scope.id,
          phone:$scope.data.pro_phone,
          name:$scope.data.pro_name
      }
  };
  console.log($scope.cdata);
  $ionicLoading.show();
 $http.post(Base_URL+'api/users/editprofile',$scope.cdata).success(function(response)
 {
     console.log(response.data);
  
//   $rootScope.detail=response.data.User;
//   console.log($rootScope.detail);
 if(response.msg="success")
  {
    //  alert("ads");
console.log(response);
    $rootScope.pro_name = response.data.user.name;
    $rootScope.pro_phone = response.data.user.phone;
    $rootScope.pro_phone = response.data.user.phone;
                 $scope.id= JSON.parse($window.localStorage.getItem("user_id"));
$scope.data.pro_name= $scope.pro_name;
$scope.data.pro_phone= $scope.pro_phone;
$scope.data.pro_image= $scope.pro_image;
$scope.cddata={
      user:{
          id:$scope.id
      }
  };
  console.log($scope.cddata);
  $http.post(Base_URL+'api/users/user',$scope.cddata).success(function(response)
  {
      $ionicLoading.hide();
   //alert("edit");
   console.log(response);
  $rootScope.pro_name=response.data[0].User.name;
  $rootScope.pro_phone=response.data[0].User.phone;
   $rootScope.pro_image=response.data[0].User.image;
   
   console.log(response.data[0].User.name);
   console.log(response.data[0].User.phone);
   console.log(response.data[0].User.image);
   var profile_data1 = JSON.parse($window.localStorage.getItem('profile_data'));
                                     var myPopup = $ionicPopup.show({
                                         
                                        title: 'Profile Updated Successfully',
                                        cssClass: 'value_sec',
                                        scope: $scope,
                                        buttons: [
                                          { text: '<span class="oky">Okay</span>',
                                          onTap: function(e) {
                                             // $state.go('menu.profile');
                                            }}
                                        ]
                                      });
   
 
                                      });
   }else{
       $ionicLoading.hide();
   }
 });
}

$scope.picture = function (options) {
 $rootScope.Popup = $ionicPopup.show({
   scope: $scope,
    template: '<div ng-controller="editinfoCtrl" class="pop_profile"><button class="button-full icon-left ion-camera button-small" ng-click="takePicture()" style="margin-bottom:8px; background: #0F75BC; color: #fff; border:none;"> Take Picture</button><button class="button-full icon-left ion-images button-small" ng-click = "getPicture()" style="background: #0F75BC; color: #fff; border:none;"> Open Gallery</button></div>',
    title: 'Picture',
    buttons: [
      { text: 'Cancel',
        type:'button button-login' }
    ]
  });
    };

  
  

   $scope.takePicture = function (options) {
 // alert('bhu');
    var options = {
     quality: 70,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: Camera.PictureSourceType.CAMERA,
  allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false,
    correctOrientation:true
    };
     $cordovaCamera.getPicture(options).then(function(imageData) {
 //  alert(imageData)
    $rootScope.dataImg = imageData; // <--- this is your Base64 string 
$rootScope.imgUrl =  imageData;
$scope.id= JSON.parse($window.localStorage.getItem("user_id"));
//$scope.useriid = JSON.parse(($window.localStorage.getItem('User_Data')));
//$scope.userid = $scope.useriid.user_id;
$scope.profiledata={
    user:
            {
                id:$scope.id,
        img:$rootScope.dataImg
    }
};
$ionicLoading.show();
$http.post(Base_URL+'api/users/saveimage',$scope.profiledata).success(function(response)
{
if(response.data==true)
{
    $scope.cddata={
      user:{
          id:$scope.id
      }
  };
  console.log($scope.cddata);
  $http.post(Base_URL+'api/users/user',$scope.cddata).success(function(response)
  {
   //alert("edit");
   console.log(response);
     if(response.msg == "Success"){
         $ionicLoading.hide();
  $rootScope.pro_name=response.data[0].User.name;
  $rootScope.pro_phone=response.data[0].User.phone;
   $rootScope.pro_image=response.data[0].User.image;
   
   console.log(response.data[0].User.name);
   console.log(response.data[0].User.phone);
   console.log(response.data[0].User.image);
   $rootScope.Popup.close();
//   $rootScope.myPopup = $ionicPopup.hide({
//    scope: $scope,
//   template: '<div ng-controller="editinfoCtrl" class="pop_profile"><button class="button-full icon-left ion-camera button-small" ng-click="takePicture()" style="margin-bottom:8px; background: #0F75BC; color: #fff; border:none;"> Take Picture</button><button class="button-full icon-left ion-images button-small" ng-click = "getPicture()" style="background: #0F75BC; color: #fff; border:none;"> Open Gallery</button></div>',
//   title: 'Picture',
//   buttons:[{ 
//   text: 'Cancel',
//   type:'button button-login'
//    }]
//    });
     }else{
         $ionicLoading.hide();
          var myPopup = $ionicPopup.show({
                                         
                                        title: 'Profile data not access',
                                        cssClass: 'value_sec',
                                        scope: $scope,
                                        buttons: [
                                          { text: '<span class="oky">Okay</span>',
                                          onTap: function(e) {
                                             // $state.go('menu.profile');
                                            }}
                                        ]
                                      });
      //  alert("Profile data not access");
          }
        });
       }
    })
    }, function(err) {
   // alert(err);
    });
    };  
    
    $scope.getPicture = function (options) {
//  alert('helloooqqq');
    var options = {
    quality: 70,
    destinationType: Camera.DestinationType.DATA_URL,
    sourceType: 0,
    allowEdit: true,
    encodingType: Camera.EncodingType.JPEG,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false,
    correctOrientation:true
    };
   $cordovaCamera.getPicture(options).then(function(imageData) {
  // alert("imageData");
    $rootScope.dataImg = imageData; // <--- this is your Base64 string 
$rootScope.imgUrl = imageData;
 $scope.id= JSON.parse($window.localStorage.getItem("user_id"));
//$scope.useriid = JSON.parse(($window.localStorage.getItem('User_Data')));
//$scope.userid = $scope.useriid.user_id;
$scope.profiledata={
    user:
            {
        id:$scope.id,
        img:$rootScope.dataImg
    }
};
//alert($scope.profiledata);
$ionicLoading.show();
$http.post(Base_URL+'api/users/saveimage',$scope.profiledata).success(function(response)
{
   // alert(response);
if(response.data==true)
{
    $scope.cddata={
      user:{
          id:$scope.id
      }
  };
  console.log($scope.cddata);
  $http.post(Base_URL+'api/users/user',$scope.cddata).success(function(response)
  {
   //alert("edit");
   console.log(response);
   if(response.msg == "Success"){
       $ionicLoading.hide();
  $rootScope.pro_name=response.data[0].User.name;
  $rootScope.pro_phone=response.data[0].User.phone;
   $rootScope.pro_image=response.data[0].User.image;
   
   console.log(response.data[0].User.name);
   console.log(response.data[0].User.phone);
   console.log(response.data[0].User.image);
    $rootScope.Popup.close();
//   $rootScope.myPopup = $ionicPopup.hide({
//    scope: $scope,
//   template: '<div ng-controller="editinfoCtrl" class="pop_profile"><button class="button-full icon-left ion-camera button-small" ng-click="takePicture()" style="margin-bottom:8px; background: #0F75BC; color: #fff; border:none;"> Take Picture</button><button class="button-full icon-left ion-images button-small" ng-click = "getPicture()" style="background: #0F75BC; color: #fff; border:none;"> Open Gallery</button></div>',
//   title: 'Picture',
//   buttons:[{ 
//   text: 'Cancel',
//   type:'button button-login'
//    }]
//    });
   }else{
       $ionicLoading.hide();
           var myPopup = $ionicPopup.show({
                                         
                                        title: 'Profile data not access',
                                        cssClass: 'value_sec',
                                        scope: $scope,
                                        buttons: [
                                          { text: '<span class="oky">Okay</span>',
                                          onTap: function(e) {
                                             // $state.go('menu.profile');
                                            }}
                                        ]
                                      });
       
        //alert("Profile data not access");
     }
    });
}
})
}, 
    function(err) {
     
   // alert(err);
    });
    }; 
})
  .controller('creditCtrl',  
  function($rootScope,$window,$scope,$ionicLoading,$http,Base_URL,$state,$cordovaInAppBrowser,$ionicPopup){
      $scope.credit= function(){
            if($window.localStorage.getItem('carddatepick') == "undefined")
        {
                 var datemq = $ionicPopup.show({
                             title:'Select date and time for Pickup',
                        // subTitle: '<p>you already submitted a review for this order</p>',
                             cssClass: 'value_sec',
                             scope: $scope,
                             buttons: [
                             { text: '<span class="oky">Okay</span>',
                              onTap: function(e) {
                              datemq.close();
                             
                                            }}
                                        ]
                                      });
        }else{
       //   alert("ythhjgg")
//      $rootScope.paymentstatus= JSON.stringify(payment.response.state);
//          alert($rootScope.paymentstatus);
//           $rootScope.paymentId=JSON.stringify(payment.response.id);
//           alert($rootScope.paymentId);
           $rootScope.sesn_id= JSON.parse($window.localStorage.getItem("randomid")) ;
           //alert($rootScope.sesn_id);
           $rootScope.usr_id= JSON.parse($window.localStorage.getItem("user_id")) ;   
           //alert($rootScope.usr_id);
          // $rootScope.billing_address= JSON.parse(localStorage.getItem('billing_address'));
           //alert($rootScope.billing_address);
//           $rootScope.address2= JSON.parse(localStorage.getItem('address2')) ;
          $rootScope.last_total= JSON.parse($window.localStorage.getItem('subtotal1')) ;
        //  alert($rootScope.last_total);
          $rootScope.notes= JSON.parse($window.localStorage.getItem('note1'));//alert($rootScope.notes);
          $rootScope.cart=JSON.parse($window.localStorage.getItem('cart_data')) ;
          $rootScope.billing_address= JSON.parse(localStorage.getItem('billing_address'));
          $rootScope.timep= JSON.parse($window.localStorage.getItem('timecardpick'));
          $rootScope.datep= JSON.parse($window.localStorage.getItem('carddatepick'));
         //  alert($rootScope.billing_address);
        // alert($rootScope.cart);
             $scope.all ={
               User:{
               id:$rootScope.usr_id,
               snid:$rootScope.sesn_id
              },products:{
               prod:$rootScope.cart
              },address:{
               billing:$rootScope.billing_address,
               shipping:$rootScope.billing_address
              },payment:{
               mode:"creditcard",
              // mode_of_order:"delivery",
               total:$rootScope.last_total,
//               pickupdate:null,
//               pickuptime:null
              pickupdate:$rootScope.datep,
               pickuptime:$rootScope.timep
              }, delivery:{
                 status:1
              },Table:{
                  no:"0"
              },
              
              creditcard:{
                  status:"0"
                  },
              notes:{
                  notes:"null"
              }
              
                  
              };
              console.log( $scope.all);
              $ionicLoading.show();
      
//              alert(JSON.stringify($scope.all));
//              //console.log($scope.all);
  
   $http.post(Base_URL+'api/shop/creditcard',$scope.all).success(function(response){
console.log(response);
 $ionicLoading.hide();
   $scope.url=response.data[0];
    var options = {
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no'
    };

    
    
     $cordovaInAppBrowser.open($scope.url, '_blank', options)
		
      .then(function(event) {
       //   alert("hello");
      //   alert(event);
      })
		
      .catch(function(event) {
       //   alert("hii");
       // alert(event);
      });
      $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
          if (event.url.match('/confirmation')){
          $cordovaInAppBrowser.close();
          $state.go("menu.confirmation");
          
          }
  });

  });
}
      };
  })
   .controller('creditdineCtrl',  
  function($rootScope,$window,$scope,$ionicLoading,$http,Base_URL,$state,$cordovaInAppBrowser){
      $scope.creditdine= function(){
       //   alert("ythhjgg")
//      $rootScope.paymentstatus= JSON.stringify(payment.response.state);
//          alert($rootScope.paymentstatus);
//           $rootScope.paymentId=JSON.stringify(payment.response.id);
//           alert($rootScope.paymentId);
           $rootScope.sesn_id= JSON.parse($window.localStorage.getItem("randomid")) ;
           //alert($rootScope.sesn_id);
           $rootScope.usr_id= JSON.parse($window.localStorage.getItem("user_id")) ;   
           //alert($rootScope.usr_id);
          // $rootScope.billing_address= JSON.parse(localStorage.getItem('billing_address'));
           //alert($rootScope.billing_address);
//           $rootScope.address2= JSON.parse(localStorage.getItem('address2')) ;
 
          $rootScope.last_total= JSON.parse($window.localStorage.getItem('carttotaldine')) ;
        // alert($rootScope.last_total);
          $rootScope.notes= JSON.parse($window.localStorage.getItem('note1'));//alert($rootScope.notes);
          $rootScope.cart=JSON.parse($window.localStorage.getItem('cartdine')) ;
          $rootScope.billing_address= JSON.parse(localStorage.getItem('address'));
         // alert($rootScope.billing_address);
          //alert($rootScope.cart);
         
          var tableid = JSON.parse($window.localStorage.getItem('tableid1'));
        //  alert(tableid);
        
  
         
         
             $scope.all ={
               User:{
               id:$rootScope.usr_id,
               snid:$rootScope.sesn_id
              },products:{
               prod:$rootScope.cart
              },address:{
               billing:$rootScope.billing_address,
              // shipping:$rootScope.billing_address
              },payment:{
               mode:"creditcard",
              // mode_of_order:"delivery",
               total:$rootScope.last_total
              },
              delivery:{
                status:0
             },
              Table:{
                  no:tableid
              },
              
              creditcard:{
                  status:"0"
                  },
              notes:{
                  notes:""
              }
              
                  
              };
              console.log( $scope.all);
              $ionicLoading.show();
      
//              alert(JSON.stringify($scope.all));
//              //console.log($scope.all);
  
   $http.post(Base_URL+'api/shop/creditcardtable',$scope.all).success(function(response){
console.log(response);
$ionicLoading.hide();
   $scope.url=response.data[0];
    var options = {
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no'
    };

    
    
     $cordovaInAppBrowser.open($scope.url, '_blank', options)
		
      .then(function(event) {
        //  alert("hello");
       //  alert(event);
      })
		
      .catch(function(event) {
        //  alert("hii");
       // alert(event);
      });
      $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event){
          if (event.url.match('/confirmation')){
          $cordovaInAppBrowser.close();
          $state.go("menu.confirmation");
          
          }
  });
  });
      };
  })

  .controller('orderHistorydetailsCtrl',
  function ($scope, $stateParams,$rootScope,$http,Base_URL,$state) {
      $scope.orderhistorydetail = function(id){
         // alert(id)
          $scope.order={
             Order:{ 
                 id:id,
             }
          };
  $http.post(Base_URL+'api/shop/orderById',$scope.order).success(function(response){
console.log(response);
if(response.error== 0)
$rootScope.orderdea_his=response.data;
console.log($rootScope.orderdea_his);
  $state.go("menu.orderHistorydetails");
      });
  };

            })       

.controller('reservationpickupCtrl',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
            function ($scope, $stateParams,$rootScope,$http,Base_URL,$window,$ionicLoading,$cordovaInAppBrowser,$ionicPopup,$state) {
                  var day1 = [];
                    $scope.data = {};
                    var date = new Date();
                    $rootScope.n = date.getDate();
                    $scope.day_id = {
                        time: {
                            id: 1
                        }
                    };
                    $http.post(Base_URL+'api/shop/time', $scope.day_id).success(function (response)
                    {
                       console.log("bhumika");
                       console.log(response);
                        $rootScope.cardIndex='0';
                        $rootScope.card2 = response.day;
                        //$rootScope.timecard = response.time[0];
                        $rootScope.timeIndex='0';
                        $rootScope.date=  response.day;
                        $rootScope.time =  response.time;
                        // $rootScope.day=response.day; 
                       
                       $rootScope.date_length = $rootScope.date.length;
                       //var final = $rootScope.day[0];
                        //var values  = final.split("-");
                        // var val1 = values[0];
                        //console.log(val1);
                        
                        $rootScope.time = response.time;
                        console.log($rootScope.time);
                        $scope.data.time = "";

                    });
 
                     $scope.kj=function(card,indexValue){
                        //alert(card);
                        //alert(date);
                        //$rootScope.decrement_flag = 0;
                        if(typeof $rootScope.date !='undefined'){
                        $scope.start_date = $rootScope.date[0]
                        var alignFillDate = new Date(card);
                        var pickUpDate = new Date($scope.start_date);
                        
                        console.log(card);
                        console.log(pickUpDate);
                        console.log(alignFillDate);
                        if (angular.equals(pickUpDate, alignFillDate)) {
                        //$rootScope.decrement_flag = 1;
                        console.log('same date')
			$scope.day_id={
                        time:{
                            id:1
                        }
                    };
                
                        $http.post(Base_URL+'api/shop/time',$scope.day_id).success(function(response){
                        console.log(response);
                        $rootScope.time=response.time;
                        $scope.data.time="";
                        }
                    );
                }else{ 
                    console.log("bhumika grover")
                    $scope.day_id={
                        time:{id:0
                        }
                    };
                
                $http.post(Base_URL+'api/shop/time',$scope.day_id).success(function(response){
                console.log(response);
                $rootScope.time=response.time;
                $scope.data.time="";
                }
            );
        }           
    }
    }
$scope.userid=JSON.parse($window.localStorage.getItem("user_id"));
$scope.restid=JSON.parse ($window.localStorage.getItem("restidpickk"));
 //console.log($scope.userid);
 //console.log($scope.restid);
   $scope.rpdata = {
                Restaurant: {
                    id: $scope.restid
                    },
                    user_id:$scope.userid
                };
                console.log($scope.rpdata);
                $ionicLoading.show();
                $http.post(Base_URL+'api/restaurants/restaurantbyid', $scope.rpdata)
                .success(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $rootScope.reservationdetailpick=response.data;
              //  console.log($rootScope.reservationdetail);
                $rootScope.webdetp = response.data.website;
                });
                $scope.webres=function(){ 
                var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no'
                };
                  // alert("hellogfggh");
                $cordovaInAppBrowser.open($rootScope.webdetp, '_blank', options)    
                .then(function(event) {
            //  alert("hello");
             //   alert(event);
                })
                .catch(function(event) {
       //   alert("hii");
       // alert(event);
                }); 
            }
             $scope.showConfirm = function(tb1) {
                        console.log(tb1);
                    //  $window.localStorage.setItem('tabletotal', JSON.stringify(tb1));
                     // $rootScope.tabletotal1=JSON.parse( $window.localStorage.getItem('tabletotal'));
                      //$rootScope.menutotal=JSON.parse( $window.localStorage.getItem('subtotal'));
                     // alert($rootScope.menutotal);
                        //$rootScope.tb=($rootScope.tabletotal1*1)+($rootScope.menutotal*1);
                       // console.log( $rootScope.tb);
                       //$window.localStorage.setItem('tablepayment', JSON.stringify($rootScope.tb));
                    
                        var confirmPopup = $ionicPopup.confirm({
                            //title: 'Consume Ice Cream',
                            template: 'Pickup confirm',
                            cssClass: 'value_sec',
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                console.log('You are sure');
                             
                               $window.localStorage.setItem('timecardpick', JSON.stringify($scope.data.time));
                              $window.localStorage.setItem('carddatepick', JSON.stringify($scope.data.date));
//                                console.log($window.localStorage.getItem('card'));
                                $state.go('menu.checkout');
                            } else {
                                console.log('You are not sure');
                            }
                        });
                    };
    })

         