angular.module('madlibs', [
	'ngAnimate'
])
.controller('mainCtrl', [
	'$scope',
	'$http',
	'$q',
	function($scope, $http, $q) {
		$scope.photos = [];
		$scope.client_id = '2ddc37c3a124490d95214a7fae9c622e';
		$scope.url = 'https://api.instagram.com/v1/tags/[searchTerm]/media/recent?client_id=' + $scope.client_id + '&callback=JSON_CALLBACK';

		$scope.setOutputText = function (txt) {
			$scope.outputText = txt;
		};

		$scope.doSearch = function () {
			if ($scope.inputForm.$invalid) {
				// invalid input
			} else {
				$scope.photos = [];
				$scope.searchingFor = $scope.searchText;
				$scope.searchText = '';
				$scope.setOutputText('Searching Instagram for photos tagged with "' + $scope.searchingFor + '"');

				$scope.requestForPhotos($scope.url.replace('[searchTerm]', $scope.searchingFor)).then(function (ret) {
					$scope.setOutputText('We found ' + ret.data.length + ' results for "' + $scope.searchingFor + '"');
					$scope.generateOutput(ret.data);
				}, function (err) {
					$scope.setOutputText('Instagram is current unavailable.  Please try again.  <br> Error: ' + err);
				});
			}
		};

		$scope.requestForPhotos = function (url) {
			var deferred = $q.defer();
			$http({
				method: 'JSONP',
				url: url
			}).then(function (ret) {
				deferred.resolve(ret.data);
			}, function (err) {
				deferred.reject(err);
			});
			return deferred.promise;
		}

		$scope.generateOutput = function (data) {
			$scope.photos = data;
		}

		$scope.numberMatching = new RegExp('^[0-9]*$');
	}
]);