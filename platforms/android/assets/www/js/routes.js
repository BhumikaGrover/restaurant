angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.slider', {
    url: '/slider',
    views: {
      'side-menu21': {
        templateUrl: 'templates/slider.html',
        controller: 'sliderCtrl'
      }
    }
  })

  .state('menu.createProfile', {
    url: '/signup',
    views: {
      'side-menu21': {
        templateUrl: 'templates/createProfile.html',
        controller: 'createProfileCtrl'
      }
    }
  })

  .state('menu.step1', {
      cache:false,
    url: '/step',
    views: {
      'side-menu21': {
        templateUrl: 'templates/step1.html',
        controller: 'step1Ctrl'
      }
    }
  })

  .state('menu.finalStep', {
    url: '/finalstep',
    views: {
      'side-menu21': {
        templateUrl: 'templates/finalStep.html',
        controller: 'finalStepCtrl'
      }
    }
  })

  .state('menu', {
      chache:false,
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.nearestRestaurants', {
    url: '/nearestRestaurants',
    views: {
      'side-menu21': {
        templateUrl: 'templates/nearestRestaurants.html',
        controller: 'nearestRestaurantsCtrl'
      }
    }
  })

  .state('menu.favorites', {
    url: '/favorites',
    views: {
      'side-menu21': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }
    }
  })
  
  .state('menu.gallery', {
    url: '/gallery',
    views: {
      'side-menu21': {
        templateUrl: 'templates/gallery.html',
        controller: 'galleryCtrl'
      }
    }
  })
  
  .state('menu.galleryFull', {
    url: '/galleryFull',
    views: {
      'side-menu21': {
        templateUrl: 'templates/galleryFull.html',
        controller: 'galleryFullCtrl'
      }
    }
  })
  .state('menu.history', {
    url: '/history',
    views: {
      'side-menu21': {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
      }
    }
  })
  
  .state('menu.discover', {
    url: '/discover',
    views: {
      'side-menu21': {
        templateUrl: 'templates/discover.html',
        controller: 'discoverCtrl'
      }
    }
  })
  .state('menu.profile', {
    url: '/profile',
    views: {
      'side-menu21': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })
  .state('menu.map', {
    url: '/map/:lat/:long/:rest_name',
    views: {
      'side-menu21': {
        templateUrl: 'templates/map.html',
        controller: 'mapCtrl'
      }
    }
  })

  .state('menu.restaurantDetails', {
    cache: false,
    url: '/restaurantDetails/:num',
    views: {
      'side-menu21': {
        templateUrl: 'templates/restaurantDetails.html',
        controller: 'restaurantDetailsCtrl'
      }
    }
  })

  .state('menu.reservation', {
      cache:false,
    url: '/reservation/:person',
    views: {
      'side-menu21': {
        templateUrl: 'templates/reservation.html',
        controller: 'reservationCtrl'
      }
    }
  })
  .state('menu.splitbill', {
    url: '/splitbill',
    views: {
      'side-menu21': {
        templateUrl: 'templates/splitbill.html',
        controller: 'splitbillCtrl'
      }
    }
  })

//---------------------//

.state('menu.menuItems', {
  cache: false,
    url: '/menuItems',
    views: {
      'side-menu21': {
        templateUrl: 'templates/menuItems.html',
        controller: 'menuItemsCtrl'
      }
    }
  })
.state('menu.menuItems2', {
  cache: false,
    url: '/menuItems2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/menuItems2.html',
        controller: 'menuItems2Ctrl'
      }
    }
  })
.state('menu.mainMenu', {
  cache: false,
    url: '/mainMenu',
    views: {
      'side-menu21': {
        templateUrl: 'templates/mainMenu.html',
        controller: 'mainMenuCtrl'
      }
    }
  })
.state('menu.mainMenu2', {
  cache: false,
    url: '/mainMenu2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/mainMenu2.html',
        controller: 'mainMenu2Ctrl'
      }
    }
  })
  .state('menu.menusubcategorylist', {
    cache: false,
    url: '/menusubcategorylist',
    views: {
      'side-menu21': {
        templateUrl: 'templates/menusubcategorylist.html',
        controller: 'menusubcategorylistCtrl'
      }
    }
  })
  .state('menu.subcategorylist1', {
    cache: false,
    url: '/subcategorylist1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/subcategorylist1.html',
        controller: 'subcategorylist1Ctrl'
      }
    }
  })
.state('menu.menuFood', {
  cache: false,
    url: '/menuFood',
    views: {
      'side-menu21': {
        templateUrl: 'templates/menuFood.html',
        controller: 'menuFoodCtrl'
      }
    }
  })
.state('menu.menuFood2', {
  cache: false,
    url: '/menuFood2',
    views: {
      'side-menu21': {
        templateUrl: 'templates/menuFood2.html',
        controller: 'menuFood2Ctrl'
      }
    }
  })
.state('menu.cart', {
    url: '/cart/:dis/:image',
    views: {
      'side-menu21': {
        templateUrl: 'templates/cart.html',
        controller: 'cartCtrl'
      }
    }
  })
.state('menu.cart2', {
     cache: false,
    url: '/cart2/',
    views: {
      'side-menu21': {
        templateUrl: 'templates/cart2.html',
        controller: 'cart2Ctrl'
      }
    }
  })
  
.state('menu.checkout', {
    url: '/checkout/:person',
    views: {
      'side-menu21': {
        templateUrl: 'templates/checkout.html',
        controller: 'checkoutCtrl'
      }
    }
  })
  .state('menu.checkout1', {
    url: '/checkout1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/checkout1.html',
        controller: 'checkout1Ctrl'
      }
    }
  })
.state('menu.payment', {
    url: '/payment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/payment.html',
        controller: 'paymentCtrl'
      }
    }
  })
.state('menu.confirmation', {
     cache: false,
    url: '/confirmation',
    views: {
      'side-menu21': {
        templateUrl: 'templates/confirmation.html',
        controller: 'confirmationCtrl'
      }
    }
  })
  .state('menu.confirmation1', {
    url: '/confirmation1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/confirmation1.html',
        controller: 'confirmation1Ctrl'
      }
    }
  })
.state('menu.selectOption', {
    url: '/selectOption',
    views: {
      'side-menu21': {
        templateUrl: 'templates/selectOption.html',
        controller: 'selectOptionCtrl'
      }
    }
  })
  .state('menu.wallet', {
      cache:false,
    url: '/wallet/:id',
    views: {
      'side-menu21': {
        templateUrl: 'templates/wallet.html',
        controller: 'walletCtrl'
      }
    }
  })
  
  .state('menu.paymentInformations', {
    url: '/paymentInformations',
    views: {
      'side-menu21': {
        templateUrl: 'templates/paymentInformations.html',
        controller: 'paymentInformationsCtrl'
      }
    }
  })
  .state('menu.paymentinformation1', {
    url: '/paymentinformation1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/paymentinformation1.html',
        controller: 'paymentinformation1Ctrl'
      }
    }
  })
  .state('menu.orderhistory', {
    url: '/orderhistory',
    views: {
      'side-menu21': {
        templateUrl: 'templates/orderhistory.html',
        controller: 'orderhistoryCtrl'
      }
    }
  })
   .state('menu.reservationhistory', {
    url: '/reservationhistory',
    views: {
      'side-menu21': {
        templateUrl: 'templates/reservationhistory.html',
        controller: 'reservationhistoryCtrl'
      }
    }
  })
       .state('menu.search', {
          cache: false,
    url: '/search',
    views: {
      'side-menu21': {
        templateUrl: 'templates/search1.html',
        controller: 'searchCtrl'
      }
    }
  })
    .state('menu.invite', {
    url: '/invite',
    views: {
      'side-menu21': {
        templateUrl: 'templates/invite.html',
        controller: 'inviteCtrl'
      }
    }
  })
  .state('menu.changepassword', {
      cache:false,
    url: '/changepassword',
    views: {
      'side-menu21': {
        templateUrl: 'templates/changepassword.html',
        controller: 'changepasswordCtrl'
      }
    }
  })
  .state('menu.editinfo', {
      cache: false,
    url: '/editinfo',
    views: {
      'side-menu21': {
        templateUrl: 'templates/editinfo.html',
        controller: 'editinfoCtrl'
      }
    }
  })
  .state('menu.confirmationwallet', {
    url: '/confirmationwallet',
    views: {
      'side-menu21': {
        templateUrl: 'templates/confirmationwallet.html',
        controller: 'confirmationwalletCtrl'
      }
    }
  })
//  .state('menu.walletpayment1Ctrl', {
//    url: '/confirmationwallet',
//    views: {
//      'side-menu21': {
//        templateUrl: 'templates/walletpayment1Ctrl.html',
//        controller: 'walletpayment1Ctrl'
//      }
//    }
//  })
  .state('menu.rating', {
      cache: false,
    url: '/rating',
    views: {
      'side-menu21': {
        templateUrl: 'templates/rating.html',
        controller: 'ratingCtrl'
      }
    }
  })
  .state('menu.forgetpassword', {
    url: '/forgetpassword',
    views: {
      'side-menu21': {
        templateUrl: 'templates/forgetpassword.html',
        controller: 'forgetpasswordCtrl'
      }
    }
  })
  
  .state('menu.orderHistorydetails', {
    url: '/orderHistorydetails',
    views: {
      'side-menu21': {
        templateUrl: 'templates/orderHistorydetails.html',
        controller: 'orderHistorydetailsCtrl'
      }
    }
  })
  
   .state('menu.reservationpickup', {
       cache:false,
    url: '/reservationpickup',
    views: {
      'side-menu21': {
        templateUrl: 'templates/reservationpickup.html',
        controller: 'reservationpickupCtrl'
      }
    }
  })
  
    .state('menu.contact', {
        cache :false,
    url: '/contact',
    views: {
      'side-menu21': {
        templateUrl: 'templates/contact.html',
        controller: 'contactCtrl'
      }
    }
  })


$urlRouterProvider.otherwise('/side-menu21/slider')

  

});