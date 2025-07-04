// fetch('distribution.csv')
//   .then(response => response.text())
//   .then(contents => {
//     var data = parseCsvData(contents); // Parse the CSV data
//     createChart(data); // Create the chart with the parsed data
//   })
//   .catch(error => console.error('Error fetching CSV data:', error));

// fetch('prediction.csv')
//   .then(response => response.text())
//   .then(contents => {
//      console.log(contents);
//     var data2 = parseCsvData2(contents); // Parse the CSV data
//     createChart2(data2); // Create the chart with the parsed data
//   })
//   .catch(error => console.error('Error fetching CSV data:', error));
// console.log("obese");

  
// // Function to parse CSV data and remove every other column
// function parseCsvData(csvData) {
//   var lines = csvData.split('\n');
//   var headers = lines[0].split(',').slice(1);
//   var datasets = [];
//   var colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];

//   for (var i = 1; i < lines.length; i++) {
//     var line = lines[i].trim();
//     if (line !== '') {
//       var parts = line.split(',');
//       var label = parts[0];
//       var values = parts.slice(1).filter((value, index) => index % 2 === 0).map(parseFloat); // Filter out every other column of data
//       var colorIndex = i - 1;
//       datasets.push({
//         label: label,
//         data: values,
//         backgroundColor: colors[colorIndex],
//         borderColor: colors[colorIndex],
//         borderWidth: 1
//       });
//     }
//   }

//   return { headers: headers.filter((value, index) => index %  2 === 0), datasets: datasets }; // Filter out every other column of headers
// }

// // Function to create a chart using Chart.js
// function createChart(data) {
//   var ctx = document.getElementById('myChart').getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: data.headers,
//       datasets: data.datasets
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });
// }


// // Function to parse CSV data and remove every other column
// function parseCsvData2(csvData) {
//   var lines = csvData.split('\n');
//   var headers = lines[0].split(',').slice(1);
//   var datasets = [];
//   var colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];

//   for (var i = 1; i < lines.length; i++) {
//     var line = lines[i].trim();
//     if (line !== '') {
//       var parts = line.split(',');
//       var label = parts[0];
//       var values = parts.slice(1).filter((value, index) => index % 12 === 0).map(parseFloat);
//       var colorIndex = i - 1;
//       datasets.push({
//         label: label,
//         data: values,
//         backgroundColor: colors[colorIndex],
//         borderColor: colors[colorIndex],
//         borderWidth: 1
//       });
//     }
//   }
    
//   return { headers: headers.filter((value, index) => index % 12 === 0), datasets: datasets }; 
// }

// // Function to create a chart using Chart.js
// function createChart2(data) {
//     console.log("i tried");
//     console.log(data)
//   var ctx = document.getElementById('SupplyChart').getContext('2d');
//   var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: data.headers,
//       datasets: data.datasets
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });
// }



async function fetchAndGetCsvString() {
    const url = 'https://caiso-proxy-repo.onrender.com/caiso-csv';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const csvString = await response.text();

    console.log('CSV string:', csvString);
    
    // You can now use csvString however you want (send to server, display, etc.)
    return csvString;
  } catch (error) {
    console.error('Error:', error);
  }
}
(async () => {
  try {
    const csvData = await fetchAndGetCsvString();
    if (csvData && csvData.trim() !== '') {

    // Split the CSV data into rows using the newline character
    const aRows = csvData.split('\n');
    const rows = aRows.slice(1).filter((value, index) => index % 12 === 0);

    // Initialize an empty array to hold the series data
    const headers = [];
    const values = [];
    var datasets = [];
    var colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];

    for (let i = 1; i < rows.length; i++) {
        // Split the row into an array using the comma separator
        const row = rows[i].split(',');
        headers.push(row[0]);
        
        console.log(row);
        values.push((parseInt(row[6]) + parseInt(row[9]))- parseInt(row[4]) + parseInt(row[8]) );  

        var colorIndex = i - 1;


              
        // Add the object to the series array
    }

    datasets.push({
      label: "Avalible Supply",
      data: values,
      backgroundColor: colors[colorIndex],
      borderColor: colors[colorIndex],
      borderWidth: 1
    });
    const data = { headers: headers, datasets: datasets };
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.headers,
        datasets: data.datasets
      },
      options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    });
    // --- All code that depends on the loaded data goes here ---
    
    } else {
    console.warn('CSV string is empty or undefined.');
    }
  } catch (error) {
    console.error('Error:', error);  
  }  
})();  
