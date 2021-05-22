'use strict';;
const fn1 = () => {
    $(document).ready(function() {
        tableau.extensions.initializeAsync().then(function() {
            showChooseSheetDialog();

        });
    });

    function showChooseSheetDialog() {
        $('#choose_sheet_buttons').empty();

        const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
        $('#choose_sheet_title').text(dashboardName);

        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

        worksheets.forEach(function(worksheet) {
            const button = $("<button type='button' class='btn btn-default btn-block'></button>");
            button.text(worksheet.name);

            button.click(function() {
                const worksheetName = worksheet.name;
                $('#choose_sheet_dialog').modal('toggle');
                loadSelectedMarks(worksheetName);
            });
            $('#choose_sheet_buttons').append(button);
        });


        $('#choose_sheet_dialog').modal('toggle');
    }

    function createButton(buttonTitle) {
        const button =
            $(`<button type='button' class='btn btn-default btn-block'>
      ${buttonTitle}
    </button>`);

        return button;
    }

    const loadSelectedMarks = worksheetName => {
        const worksheet = getSelectedSheet(worksheetName);
        $('#seleted_marks_title').text(worksheet.name);

        worksheet.getSelectedMarksAsync().then(function(marks) {
            // Get the first DataTable for our selected marks (usually there is just one)
            const worksheetData = marks.data[0];
            const row = worksheetData.data.map(function(row, index) {
                const rowD = row.map(function(cell) {
                    return cell.value;
                });

                return rowD;
            });
            const col = worksheetData.columns.map(function(column) {
                return {
                    title: column.fieldName
                };
            });
            // initMap();
            var percentage = document.getElementById('perc').value;
            var cost_per_sqft = document.getElementById('cost').value
            var sunlight = document.getElementById('sunlight').value;
            var eff1 = document.getElementById("eff");
            var efficiency = eff1.options[eff1.selectedIndex].value;


            // var bio = document.getElementById('biogkg').value;
            //calculate available area in square meters and calculate other variables
            row.forEach(array => {
                // current situation
                //in KWH // ADD A FACTOR BASED ON BUILDING AGE array 7 = current electricity usage cubic feet
                //array 8 = current gas usage per month in cubic feet
                if (array[5] < 1950) {
                    let energyusage_gas = (array[1] * 190);
                    array[8] = energyusage_gas;
                    let energyusage_elec = (array[1] * 22);
                    array[9] = energyusage_elec;
                } else {
                    let energyusage_gas = (array[1] * 250);
                    array[8] = energyusage_gas;
                    let energyusage_elec = (array[1] * 30);
                    array[9] = energyusage_elec;
                };
                //simulated situation

                // let costforbiogas = (bio) * 50;
                // array[7] = costforbiogas;
                array[5] = Math.floor(Math.random() * 100 + 1900);
                let A = [4] / array[5];

            });

            let E_usage_permonth = [];
            row.forEach(array2 => {
                E_usage_permonth.push(array2[9]);
            });
            let G_usage_permonth;
            G_usage_permonth = [];
            row.forEach(array1 => {
                G_usage_permonth.push(array1[8]);
            });
            console.log(E_usage_permonth);
            console.log(G_usage_permonth);
            let sum_energy = (E_usage_permonth.reduce((a, b) => a + b, 0));
            let sum_gas = (G_usage_permonth.reduce((a, b) => a + b, 0));
            let sum_energy_R = ~~sum_energy;
            let sum_gas_R = ~~sum_gas;
            //money matters
            let cost_energy = (sum_energy_R * .15) * 12;
            let cost_gas = (sum_gas_R * .30) * 12;


            console.log(cost_energy);
            console.log(cost_gas);

            // simulated condition 
            //available area
            row.forEach(array => {
                let available_area = (((array[1] / 100) * percentage));
                array[10] = available_area;
            });
            //installation cost
            row.forEach(array => {
                let installation_cost = (array[10] * cost_per_sqft) + 1000;
                array[14] = installation_cost;
            });
            //energy production per month
            row.forEach(array => {
                //kwh per day
                let wah = (((((array[10] * 1000) / (efficiency) / 10)) * sunlight) / 1000) * 30;
                array[11] = wah;
            });
            //carbon emission permonth in kg
            row.forEach(array => {
                let carbonemission_pre = (array[9] * .41);
                array[12] = carbonemission_pre;
            });
            row.forEach(array => {
                let carbonemission_red = ((array[9] - array[11]) * .41);
                array[13] = carbonemission_red;
            });
            console.log(row)









            //wah
            let wah = [];
            //cost_wah

            let building_age;
            building_age = [];
            row.forEach(test2 => {
                building_age.push(test2[5]);
            });





            var x1 = (building_age);
            var trace1 = {
                x: x1,
                type: "histogram",
            };
            let data = [trace1];
            Plotly.newPlot(`replace`, data);

            let vis2 = [];
            let vis2_t = [];


            Date.prototype.addDays = function(days) {
                var dat = new Date(this.valueOf())
                dat.setDate(dat.getDate() + days);
                return dat;
            }

            function getDates(startDate, stopDate) {
                var dateArray = new Array();
                var currentDate = startDate;
                while (currentDate <= stopDate) {
                    var day = currentDate.getDate()
                    var month = currentDate.getMonth() + 1
                    var year = currentDate.getFullYear()
                    dateArray.push(day + "/" + month + "/" + year)
                    currentDate = currentDate.addDays(30);
                }
                return dateArray;
            }

            var dateArray = getDates((new Date()).addDays(2), (new Date()).addDays(1000));

            console.log(dateArray)

            var yearStart = 2000;

            var dummy = [];

            while (dummy.length < dateArray.length) {
                dummy.push(yearStar);
            }
            console.log(dummy);









        });

        // let map;
        // let panorama;

        // function initMap() {
        //     const berkeley = { lat: 37.869085, lng: -122.254775 };
        //     const sv = new google.maps.StreetViewService();
        //     panorama = new google.maps.StreetViewPanorama(
        //         document.getElementById("pano")
        //     );
        //     // Set up the map.
        //     map = new google.maps.Map(document.getElementById("map"), {
        //         center: berkeley,
        //         zoom: 16,
        //         streetViewControl: false,
        //     });
        //     // Set the initial Street View camera to the center of the map
        //     sv.getPanorama({ location: berkeley, radius: 50 }, processSVData);
        //     // Look for a nearby Street View panorama when the map is clicked.
        //     // getPanorama will return the nearest pano when the given
        //     // radius is 50 meters or less.
        //     map.addListener("click", (event) => {
        //         sv.getPanorama({ location: event.latLng, radius: 50 }, processSVData);
        //     });
        // }

        // function processSVData(data, status) {
        //     if (status === "OK") {
        //         const location = data.location;
        //         const marker = new google.maps.Marker({
        //             position: location.latLng,
        //             map,
        //             title: location.description,
        //         });
        //         panorama.setPano(location.pano);
        //         panorama.setPov({
        //             heading: 270,
        //             pitch: 0,
        //         });
        //         panorama.setVisible(true);
        //         marker.addListener("click", () => {
        //             const markerPanoID = location.pano;
        //             // Set the Pano to use the passed panoID.
        //             panorama.setPano(markerPanoID);
        //             panorama.setPov({
        //                 heading: 270,
        //                 pitch: 0,
        //             });
        //             panorama.setVisible(true);
        //         });
        //     } else {
        //         console.error("Street View data not found for this location.");
        //     }
        // }

        function getSelectedSheet(worksheetName) {
            return tableau.extensions.dashboardContent.dashboard.worksheets.find(function(sheet) {
                return sheet.name === worksheetName;
            });
        }
    };
};