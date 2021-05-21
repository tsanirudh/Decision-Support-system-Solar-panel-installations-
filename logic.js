'use strict';

function fn1() {
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
            initMap();
            var percentage = document.getElementById('P').value;
            var bio = document.getElementById('biogkg').value;
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
                let costforsolar = (((array[4] / (percentage)) * 1.6) + 1000);
                array[6] = costforsolar;
                let costforbiogas = (bio) * 50;
                array[7] = costforbiogas;
                array[5] = Math.floor(Math.random() * 100 + 1900);
                let A = [4] / array[5];
                let carbonemissions = 100;

            });

            let E_usage_permonth = [];
            row.forEach(array2 => {
                E_usage_permonth.push(array2[9]);
            });
            let G_usage_permonth;
            G_usage_permonth = []
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
            let cost_gas = (sum_gas_R * .92) * 12;

            console.log(sum_energy_R);
            console.log(sum_gas_R);
            let sum_a;
            sum_a = []
            row.forEach(test2 => {
                sum_a.push(test2[5]);
            });
            var histGenerator = d3.bin()
                .domain([0, 1]) // Set the domain to cover the entire intervall [0;]
                .thresholds(5); // number of thresholds; this will create 19+1 bins

            var bins = histGenerator(sum_a);
            console.log(bins);

            var x1 = (sum_a);
            var trace1 = {
                x: x1,
                type: "histogram",
            };
            let data = [trace1];
            Plotly.newPlot(`my_Div`, data);

            let vis2 = [];
            let vis2_t = [];
        });

        let map;
        let panorama;

        function initMap() {
            const berkeley = { lat: 37.869085, lng: -122.254775 };
            const sv = new google.maps.StreetViewService();
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById("pano")
            );
            // Set up the map.
            map = new google.maps.Map(document.getElementById("map"), {
                center: berkeley,
                zoom: 16,
                streetViewControl: false,
            });
            // Set the initial Street View camera to the center of the map
            sv.getPanorama({ location: berkeley, radius: 50 }, processSVData);
            // Look for a nearby Street View panorama when the map is clicked.
            // getPanorama will return the nearest pano when the given
            // radius is 50 meters or less.
            map.addListener("click", (event) => {
                sv.getPanorama({ location: event.latLng, radius: 50 }, processSVData);
            });
        }

        function processSVData(data, status) {
            if (status === "OK") {
                const location = data.location;
                const marker = new google.maps.Marker({
                    position: location.latLng,
                    map,
                    title: location.description,
                });
                panorama.setPano(location.pano);
                panorama.setPov({
                    heading: 270,
                    pitch: 0,
                });
                panorama.setVisible(true);
                marker.addListener("click", () => {
                    const markerPanoID = location.pano;
                    // Set the Pano to use the passed panoID.
                    panorama.setPano(markerPanoID);
                    panorama.setPov({
                        heading: 270,
                        pitch: 0,
                    });
                    panorama.setVisible(true);
                });
            } else {
                console.error("Street View data not found for this location.");
            }
        }

        function getSelectedSheet(worksheetName) {
            return tableau.extensions.dashboardContent.dashboard.worksheets.find(function(sheet) {
                return sheet.name === worksheetName;
            });
        }
    };
};