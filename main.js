(function () {
  angular.module('app.spinal-pannel')
    .run(["$templateCache", "$http", "goldenLayoutService",
      function ($templateCache, $http, goldenLayoutService) {
        let load_template = (uri, name) => {
          $http.get(uri).then((response) => {
            $templateCache.put(name, response.data);
          }, (errorResponse) => {
            console.log('Cannot load the file ' + uri);
          });
        };
        let toload = [{
          uri: '../templates/spinal-env-drive-pannel-logs/log-pannel.html',
          name: 'log-pannel.html'
        }];
        for (var i = 0; i < toload.length; i++) {
          load_template(toload[i].uri, toload[i].name);
        }

        goldenLayoutService.registerPannel({
          id: "drag-log-pannel",
          name: "Log",
          cfg: {
            isClosable: true,
            title: "Log",
            type: 'component',
            width: 20,
            componentName: 'SpinalHome',
            componentState: {
              template: 'log-pannel.html',
              module: 'app.spinal-pannel',
              controller: 'LoggerCtrl'
            }
          }
        })


      }
    ])
	.controller('LoggerCtrl', ["spinalFileSystem", "$scope", "$injector", "authService", "$mdToast", "$interval", "$timeout",
	function (spinalFileSystem, $scope, $injector, authService, $mdToast, $interval, $timeout) {
        $scope.injector = $injector;
        $scope.log = "log not ok";
        setTimeout(() => {
          $scope.log = "log ok";
        }, 1000);

	  $scope.folderDropCfg = {
	      "drop": (event) => {
		  event.stopPropagation(); // Stops some browsers from redirecting.
		  event.preventDefault();
      let selected = spinalFileSystem.FE_selected_drag;
		  if (selected && selected[0]) { // change to multiple selection later
          $scope.fs_path = Array.from(spinalFileSystem.FE_fspath_drag);
          let serv_id = FileSystem._objects[selected[0]._server_id];
		      let log = serv_id._info.log;
          if (log)
          {
            let tab = [];
            for (var i = 0; i < log.length; i++)
            {
              tab.push({
                  action:log[i].action.get(),
                  date:log[i].date.get(),
                  name:log[i].name.get()
          })
            }
            $scope.name = selected[0].name;
            $scope.records = tab;
          }
          else
            {
              $scope.name = selected[0].name;
              $scope.records = [];
            }
		  }
		  return false;
	      },
	      "dragover": (event) => {
		  event.preventDefault();

		  return false;
	      },
	      "dragenter": (event) => {
		  event.preventDefault();
		  return false;
	      }

    };
    
	  
      }
    ]);



})();
