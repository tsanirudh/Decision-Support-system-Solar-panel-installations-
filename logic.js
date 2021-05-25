'use strict';
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
            const button = $("<button type='button' class='block'></button>");
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
            $(`<button type='button' class = "block">
      ${buttonTitle}
    </button>`);

        return button;
    }

    const loadSelectedMarks = worksheetName => {
        const worksheet = getSelectedSheet(worksheetName);

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
                    let energyusage_elec = (array[1] * 5);
                    array[9] = energyusage_elec;
                } else {
                    let energyusage_gas = (array[1] * 250);
                    array[8] = energyusage_gas;
                    let energyusage_elec = (array[1] * 7);
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
            // console.log(G_usage_permonth);
            let sum_energy = (E_usage_permonth.reduce((a, b) => a + b, 0));
            // let sum_gas = (G_usage_permonth.reduce((a, b) => a + b, 0));
            // let sum_energy_R = ~~sum_energy;
            // let sum_gas_R = ~~sum_gas;
            //money matters
            // let cost_energy = (sum_energy_R * .15) * 12;
            // let cost_gas = (sum_gas_R * .30) * 12;


            // console.log(cost_energy);
            // console.log(cost_gas);

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
                let carbonemission_red = (array[11]) * .41;
                array[13] = carbonemission_red;
            });
            row.forEach(array => {
                let savings = (array[11]) * .15;
                array[15] = savings;
            });
            console.log(row);


            // building age to an array
            let building_age;
            building_age = [];

            //energy usage pre per month
            let energy_usage_pre;
            let energy_production;
            let installation_C_A;
            let carbon_emission_pre;
            let carbon_emission_post;
            energy_usage_pre = [];
            energy_production = [];
            installation_C_A = [];
            carbon_emission_pre = [];
            carbon_emission_post = [];
            let savings_s = [];


            row.forEach(array => {
                building_age.push(array[5]);
                energy_usage_pre.push(array[9]);
                energy_production.push(array[11]);
                installation_C_A.push(array[14]);
                carbon_emission_pre.push(array[12]);
                carbon_emission_post.push(array[13]);
                savings_s.push(array[14]);

            });
            console.log(installation_C_A);


            //testing cumilative





            //plot plotly histogram


            //dummy date
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
                    currentDate = currentDate.addDays(90);
                }
                return dateArray;
            }

            var dateArray = getDates((new Date()).addDays(2), (new Date()).addDays(365));

            console.log(dateArray)
                //cumulative function


            //cumilative energy usage


            // energy_usage_pre = [];
            // energy_production = [];
            // installation_C_A = [];
            // carbon_emission_pre = [];
            // carbon_emission_post= [];

            // let sum_energy = (E_usage_permonth.reduce((a, b) => a + b, 0));
            // function to calculate total _sum of abcccc   
            function sum_a(a) {
                let A = [];
                A.push(a.reduce((a, b) => a + b, 0));
                return A;
            }


            ///new test function for cumulative functon

            const cumsum = arr => {
                let sum = 0;
                for (var i = 0; i < arr.length; ++i) {
                    sum += arr[i]
                }
                return sum
            };

            const cumulative_add = initialArray => {
                while (initialArray.length < dateArray.length) {
                    initialArray.push(cumsum(initialArray))
                }
                return initialArray
            };



            //arrays and more final stuff

            let energy_usage_pre_s = [(sum_a(energy_usage_pre)) / 1000];
            let energy_production_s = [(sum_a(energy_production)) / 1000];
            let installation_C_A_s = [sum_a(installation_C_A)];
            let carbon_emission_pre_s = [(sum_a(carbon_emission_pre)) / 1000];
            let carbon_emission_post_s = [((sum_a(carbon_emission_post))) / 1000];
            let savings_sa = [(sum_a(savings_s))];
            console.log(energy_production_s);
            console.log(installation_C_A_s);

            console.log(carbon_emission_post_s);
            let energy_usage_pre_s_C = cumulative_add(energy_usage_pre_s);
            let energy_production_s_C = cumulative_add(energy_production_s)
            let carbon_emission_pre_s_C = cumulative_add(carbon_emission_pre_s);
            let carbon_emission_post_s_C = cumulative_add(carbon_emission_post_s);
            let savings_s_C = cumulative_add(savings_sa);
            console.log(savings_s_C);
            console.log(energy_production_s_C);
            console.log(carbon_emission_post_s_C);


            // create arrays for visualization
            //function to combine arrays and date
            function combine(array_C, array_N) {
                for (var i = 0; i < array_C.length; i++) {
                    array_N.push([dateArray[i], array_C[i]]);
                }
                return array_N;
            };
            // vis_array_energy_pre = [combine(energy_usage_pre_s_C, test_array)];
            // vis_array_energy_pro = [combine(energy_production_s_C, test_array)];
            // vis_array_emission_pre = [combine(carbon_emission_pre_s_C, test_array)];
            // vis_array_emission_red = [combine(carbon_emission_post_s_C, test_array)];
            // buttons 
            // var button1 = document.getElementById("carbon_pre_b");
            // button1.onclick = test4();

            // function test() {
            //     vis1();

            // };

            // building age vis
            A: buttons_initialize();

            async function buttons_initialize() {
                document.getElementById("Building_hist").addEventListener("click", function begin() { message(1) });
                document.getElementById("carbon_pre").addEventListener("click", function begin() { message(5) });
                document.getElementById("savings").addEventListener("click", function begin() { message(3) });
                document.getElementById("cost").addEventListener("click", function begin() { message(4) });
                document.getElementById("carbon_post").addEventListener("click", function begin() { message(2) });
            };

            function message(a) {
                if (a == 1) {
                    Building_hist();
                } else if (a == 2) {
                    carbon_post();
                } else if (a == 3) {
                    savings();

                } else if (a == 4) {
                    cost();

                } else if (a == 5) {
                    carbon_pre();
                }

            };


            function Building_hist() {

                var x1 = (building_age);
                var layout1 = {
                    title: {
                        text: 'Building_age',
                        font: {
                            family: 'Georgia',
                            size: 18,
                            color: '#000000'
                        },
                    },
                    showlegend: false,
                    height: 350,
                    width: 800,
                    xaxis: {
                        title: {
                            text: 'Date',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        },
                    },
                    yaxis: {
                        title: {
                            text: 'Count',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        }
                    }
                };
                var trace1 = {
                    x: x1,
                    type: "histogram",
                };
                let plot_building = [trace1];
                Plotly.newPlot(`vis`, plot_building, layout1);
            };




            //visulisation carbon emission

            function carbon_post() {
                var x2 = {
                    x: (dateArray),
                    y: (carbon_emission_post_s_C),
                    mode: 'markers',
                    marker: {
                        size: [20, 40, 60, 80, 100],
                    }
                };

                var plot_carb_post = [x2];

                var layout2 = {
                    title: {
                        text: 'Reduction in carbon emission',
                        font: {
                            family: 'Georgia',
                            size: 18,
                            color: '#000000'
                        },


                    },
                    showlegend: false,
                    height: 350,
                    width: 800,
                    xaxis: {
                        title: {
                            text: 'Date',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        },
                    },

                    yaxis: {
                        title: {
                            text: 'In tons',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        }

                    }

                };
                // plottttssss
                Plotly.newPlot('vis', plot_carb_post, layout2);
            };



            function carbon_pre() {
                var x3 = {
                    x: (dateArray),
                    y: (carbon_emission_pre_s_C),
                    mode: 'markers',
                    marker: {
                        size: [20, 40, 60, 80, 100],
                    }
                };

                var plot_carb_pre = [x3];

                var layout3 = {
                    title: {
                        text: 'Cabon emission _ cumulative',
                        font: {
                            family: 'Georgia',
                            size: 18,
                            color: '#000000'
                        },


                    },
                    showlegend: false,
                    height: 350,
                    width: 800,
                    xaxis: {
                        title: {
                            text: 'Date',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        },
                    },

                    yaxis: {
                        title: {
                            text: 'In tons',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        }

                    }

                };
                // plottttssss
                Plotly.newPlot('vis', plot_carb_pre, layout3);
            };

            function cost() {
                var x3 = {
                    x: (dateArray),
                    y: (savings_s_C),
                    type: 'bar',
                };

                var savings = [x3];

                var layout3 = {
                    title: {
                        text: 'Savings in euro',
                        font: {
                            family: 'Georgia',
                            size: 18,
                            color: '#000000'
                        },


                    },
                    showlegend: false,
                    height: 350,
                    width: 800,
                    xaxis: {
                        title: {
                            text: 'Date',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        },
                    },

                    yaxis: {
                        title: {
                            text: 'Euros',
                            font: {
                                family: 'Georgia',
                                size: 18,
                                color: '#000000'
                            }
                        }

                    }

                };
                // plottttssss
                Plotly.newPlot('vis', savings, layout3);
            };




            function savings() {
                var data = [{
                    type: "sunburst",
                    labels: ["month1", "month1", "month1", "month1", "month1"],
                    parents: (dateArray),
                    values: (carbon_emission_pre_s_C),
                    outsidetextfont: { size: 20, color: "#377eb8" },
                    leaf: { opacity: 0.4 },
                    marker: { line: { width: 2 } },
                }];

                var layout = {
                    margin: { l: 0, r: 0, b: 0, t: 0 },
                    width: 500,
                    height: 500
                };


                Plotly.newPlot('vis', data, layout);

            };










            // SAVINGS PLOT














            //money that can be saved

            //percentage cover




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