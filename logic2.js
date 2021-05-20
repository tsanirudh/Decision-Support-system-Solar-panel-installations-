'use strict';
(function() {
        $(document).ready(function() {
            tableau.extensions.initializeAsync().then(function() {
                showChooseSheetDialog();
            });
        });



        let showChooseSheetDialog = () => {
            $('#choose_sheet_buttons').empty();

            const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
            $('#choose_sheet_title').text(dashboardName);
            const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
            worksheets.forEach(function(worksheet) {
                const button = $("<button type='button' class='btn btn-default btn-block'></button>");
                button.text(worksheet.name)
                button.click(function() {
                    worksheetName = worksheet.name;
                    $('#choose_sheet_buttons').append(button);
                });
            })
            loadSelectedMarks();
        };

        function getSelectedSheet(worksheetName) {
            return tableau.extensions.dashboardContent.dashboard.worksheets.find(function(sheet) {
                return sheet.name === worksheetName;
            })
        }

        const loadSelectedMarks = worksheetName => {
            let worksheet = getSelectedSheet(worksheetName);
            console.log(worksheet);
            worksheet.getSelectedMarksAsync().then(marks => {
                const worksheetData = marks.data[0];
                const row = worksheetData.data.map(function(row, index) {
                    const rowD = row.map(function(cell) {
                        return cell.value;

                    });
                    return rowD

                });
            });
        };
    };

    function funtion1() {
        row.forEach(test => {
            let sol = ((test[1] / 100) * 75);
            test[4] = sol;
            test[5] = Math.floor(Math.random() * 100 + 1900);
            let A = [4] / test[5];
            test[6] = A;
            console.log(row);
        });


    )();
};