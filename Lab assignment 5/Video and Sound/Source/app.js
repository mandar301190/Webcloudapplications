// 'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [])


    .controller('View1Ctrl', function ($scope, $http) {
        $scope.itemsList = new Array();
        $scope.mostRecentReview;
        $scope.getVenues = function () {
            var placeEntered = document.getElementById("txt_placeName").value;
            var searchQuery = document.getElementById("txt_searchFilter").value;
            if (placeEntered != null && placeEntered != "" && searchQuery != null && searchQuery != "") {
                document.getElementById('div_ReviewList').style.display = 'none';
                //This is the API that gives the list of venues based on the place and search query.
                var handler = $http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q="+searchQuery+"&key=AIzaSyCSXzgOQmHkUDrO_jEObq5o9WS3A4ACE_0");

                handler.success(function (data) {

                    if (data != null) {
                        // Tie an array named "venueList" to the scope which is an array of objects.
                        // Each object should have key value pairs where the keys are "name", "id" , "location" and values are their corresponding values from the response
                        for(i=0;i<data.items.length;i++){

                            $scope.itemsList[i]={
                                "title":data.items[i].snippet.title,
                                "description":data.items[i].snippet.description,
                            "publishedAt":data.items[i].snippet.publishedAt
                            }
                            console.log(data.items[i].snippet.title);
                        }
                    }

                })
                handler.error(function (data) {
                    alert("There was some error processing your request. Please try after some time.");
                });
            }
        }
        $scope.getReviews = function (videoSelected) {
            if (videoSelected != null) {
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
                        var callback = $http.get("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q="+searchQuery+"&key=AIzaSyCSXzgOQmHkUDrO_jEObq5o9WS3A4ACE_0" + $scope.mostRecentReview.text);
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
