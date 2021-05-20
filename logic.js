'use strict';
(function() {
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
            //calculate available area in square meters and calculate other variables
            row.forEach(test => {
                let sol = ((test[1] / 100) * 75);
                test[4] = sol;
                test[5] = Math.floor(Math.random() * 100 + 1900);
                let A = [4] / test[5];
                test[6] = A;
            });

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


        });

        function getSelectedSheet(worksheetName) {
            return tableau.extensions.dashboardContent.dashboard.worksheets.find(function(sheet) {
                return sheet.name === worksheetName;
            });
        }
    };
})();