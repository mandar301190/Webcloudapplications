// 'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [])


    .controller('View1Ctrl', function ($scope, $http) {
        $scope.weatherList = new Array();
        $scope.mostRecentReview;
        $scope.getVenues = function () {
            var placeEntered = document.getElementById("txt_placeName").value;
            var searchQuery = document.getElementById("txt_searchFilter").value;
            if (placeEntered != null && placeEntered != "" && searchQuery != null && searchQuery != "") {
                document.getElementById('div_ReviewList').style.display = 'none';
                //This is the API that gives the list of venues based on the place and search query.
                var handler = $http.get("http://samples.openweathermap.org/data/2.5/box/city?bbox=12,32,15,37,10&appid=b1b15e88fa797225412429c1c50c122a1");

                handler.success(function (data) {

                    if (data != null) {
                        // Tie an array named "WeatherList" to the scope which is an array of objects.
                        // Each object should have key value pairs where the keys are "name", "id" , "location" and values are their corresponding values from the response
                        for(i=0;i<data.list.length;i++){
                            $scope.weatherList[i]={
                                "main":data.list[i].weather[0].main,
                                "id":data.list[i].weather[0].id,
                                "description":data.list[i].weather[0].description,
                             }
                             console.log(data.list[i].weather[0].main)
                        }
                    }

                })
                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time.");
                });
            }
        }
        $scope.getReviews = function (venueSelected) {
            if (venueSelected != null) {
                //This is the API call being made to get the reviews(tips) for the selected place or venue.
                var handler = $http.get("https://api.foursquare.com/v2/venues/" + venueSelected.id + "/tips" +
                    "?sort=recent" +
                    "&client_id=Q0ENF1YHFTNPJ31DCF13ALLENJW0P5MTH13T1SA0ZP1MUOCI" +
                    "&client_secret=ZH4CRZNEWBNTALAE3INIB5XG0QI12R4DT5HKAJLWKYE1LHOG&v=20160215" +
                    "&limit=5");
                handler.success(function (result) {
                    if (result != null && result.response != null && result.response.tips != null &&
                        result.response.tips.items != null) {
                        $scope.mostRecentReview = result.response.tips.items[0];
                        //This is the Alchemy API for getting the sentiment of the most recent review for a place.
                        var callback = $http.get("http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment" +
                            "?apikey=d0e7bf68cdda677938e6c186eaf2b755ef737cd8" +
                            "&outputMode=json&text=" + $scope.mostRecentReview.text);
                        callback.success(function (data) {
                            if (data != null && data.docSentiment != null) {
                                // Tie an object named "ReviewWithSentiment" to the scope which has key value pairs.
                                // The keys in object are "reviewText" , "sentiment", "score" and their respective values from mostRecentReview and data from the alchemy API
                                $scope.ReviewWithSentiment={
                                    "reviewText":$scope.mostRecentReview.text,
                                    "sentiment":data.docSentiment.type,
                                    "score":data.docSentiment.score}

                                document.getElementById('div_ReviewList').style.display = 'block';


                            }
                        })
                    }
                })
                handler.error(function (result) {
                    alert("There was some error processing your request. Please try after some time.")
                })
            }

        }

    });
