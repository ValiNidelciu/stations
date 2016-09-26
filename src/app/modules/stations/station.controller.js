(function () {
    'use strict';

    angular
        .module('vapp')
        .controller('StationController', StationController);

    StationController.$inject = ['stationList','$interval']
    function StationController(stationList,$interval) {
        var vm = this;
        vm.list;
        
        stationList.getStationByUser().then(onReqComplete, onError)
        function onReqComplete(data) {
            vm.list = data
        };
        function onError() {
            alert("error")
        }



        var id = "";

        
        vm.showStations = function (x) {
            id = x.stationId;
            
          
           
            stationList.getStationById(id).then(onIdReqComplete, onError)
          

            function onIdReqComplete(data) {
                
                vm.stationDetails = data;

            }

            vm.show = true;
        }
        vm.showTable = true;

        //getting chart data s and default options

        vm.queryType = 0;
        vm.date = "2013-03-03";
        var series = [];
        var categories = [];
        var yearCategories = [];
        var dayCategories = [];


        var yearSeries = [];
        var monthSeries = [];
        var daySeries = [];





        vm.showHistoryF = function () {
            
            vm.showTable = false;
            vm.showHistory=true;
            vm.loadingStationList=true;
            stationList.getChartDetailsById(id, vm.queryType, vm.date).then(onChartReqComplete, onError).finally(function(){vm.loadingStationList=false;})  
            
            function onChartReqComplete(data) {
                vm.chartDetails = data;
                if(vm.chartDetails){
                    console.log("details ok");
                     $interval(vm.updateData,100)
                }
               



  

                
                //setting the series values from the api
                if (vm.queryType == 0) {
                    yearSeries=[];
                    yearCategories=[]
                    for (var x in vm.chartDetails) {
                        yearSeries.push(vm.chartDetails[x].YearEnergy);
                        yearCategories.push(vm.chartDetails[x].YearNum);
                        

                        
                    };
                   
                } else if (vm.queryType == 1) {
                   
                    
                    for (var y in vm.chartDetails) {
                        monthSeries.push(vm.chartDetails[y].MonthEnergy)
                    
                    }
                } else if (vm.queryType == 2) {
                    daySeries=[];
                    dayCategories=[];
                    for (var z in vm.chartDetails) {
                        daySeries.push(vm.chartDetails[z].DayEnergy);
                        dayCategories.push(vm.chartDetails[z].DayNum);
                    }

                }

                if (vm.queryType == 0) {
                    categories = yearCategories;
                    series = yearSeries;
                } else if (vm.queryType == 1) {
                    categories = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    series = monthSeries;
                } else if (vm.queryType == 2) {
                    categories = dayCategories;
                    series = daySeries;
                }
                
               
          
            };

        }


  



    vm.updateData=function(){    
        vm.dateFilterActive = false;
        vm.lineChart = {
            labels: categories,
            series: ['W'],
            data  : [
                series
                
            ]
        };
    }
    vm.updateData();
     
    

    }
})();