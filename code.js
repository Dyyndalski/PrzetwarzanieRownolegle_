
loadData();

function parse(array) {
    const average = arr => arr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / arr.length;

    array = array.split("\n");

    const pointsY = array[0];
    const seriesSize = array[1];

    array.splice(0, 1);
    array.splice(0, 1);

    let axisX = [];
   

    for (let i = 0; i <= parseInt(seriesSize * pointsY) + 1; i += parseInt(seriesSize) + 1) {
        axisX.push(array[i]);
    }

    let axisY = chunkArray(array, parseInt(seriesSize) + 1);

    for (let i = 0; i < axisY.length; i++) {
        axisY[i].splice(0, 1);
    }
    axisY.splice(axisY.length, 1)

    let max = [];
    let min = [];
    
    for(let z = 0; z < axisY.length; z++){
        max.push(Math.max.apply(Math, axisY[z]));
        min.push(Math.min.apply(Math, axisY[z]));
        axisY[z] = average(axisY[z]);
    }

    return [axisX, axisY, max, min];
}

function tableCreateStatistic(data1, max1, min1 , max2, min2) {
    const body = document.body,
    tbl = document.createElement('table');

    let tr = tbl.insertRow();
    let td = tr.insertCell();
    td.setAttribute('colSpan', '4');
    td.appendChild(document.createTextNode("Tabela przedstawiająca średni czas generowania permutacji oraz obliczonego parametru wydajnościowego."));

    tbl.style.border = '1px solid black';
  
    let names = ["Liczba wątków: n", "Sekwencyjne: T_s(n)", "Równoległe: T_s(n)"];
    for (let i = 0; i <= data1[0].length; i++) {
        tr = tbl.insertRow();
        for (let j = 0; j < 5; j++) {
            td = tr.insertCell();
            if (i === 0 && j === 1) {
                td.setAttribute('colSpan', '2');
                j++;
            }
            if (i === 0 && j === 3) {
                td.setAttribute('colSpan', '2');
                j++;
            }
            if(i == 0 && j == 0){
                td.appendChild(document.createTextNode(names[j]));
                td.style.border = '1px solid black';
                
            }else if(i == 0 && j == 2){
                td.appendChild(document.createTextNode(names[1]));
                td.style.border = '1px solid black';
                
            }else if(i == 0 && j == 4){
                td.appendChild(document.createTextNode(names[2]));
                td.style.border = '1px solid black';
                tr = tbl.insertRow();
                
            }else if(j == 0){
                td.appendChild(document.createTextNode(data1[0][i-1]));
                td.style.border = '1px solid black';
            }else if(j == 1){
                td.appendChild(document.createTextNode(min1[i-1]));
                td.style.border = '1px solid black';
            }else if(j == 2){
                td.appendChild(document.createTextNode(max1[i-1]));
                td.style.border = '1px solid black';
            }else if(j == 3){
                td.appendChild(document.createTextNode(min2[i-1]));
                td.style.border = '1px solid black';
            }else if(j == 4){
                td.appendChild(document.createTextNode(max2[i-1]));
                td.style.border = '1px solid black';
            }
        }
    }
    
    body.appendChild(tbl);
}


function tableCreateResult(data1, data2) {
    const body = document.body,
    tbl = document.createElement('table');

    tbl.style.border = '1px solid black';
  
    let names = ["Długość permutacji: n", "Sekwencyjne: T_s(n)", "Równoległe: T_s(n)", "T_s(n)/T_s(n)"];

    const tr = tbl.insertRow();
    const td = tr.insertCell();
    td.setAttribute('colSpan', '5');
    td.appendChild(document.createTextNode("Tabela przedstawiająca średni czas generowania permutacji oraz obliczonego parametru wydajnościowego."));
    for (let i = 0; i <= data1[0].length; i++) {
      const tr = tbl.insertRow();
      for (let j = 0; j < 4; j++) {
        const td = tr.insertCell();
        if(i == 0){
            td.appendChild(document.createTextNode(names[j]));
            td.style.border = '1px solid black';
        }else if(j == 0){
            td.appendChild(document.createTextNode(data1[0][i-1]));
            td.style.border = '1px solid black';
        }else if(j == 2){
            td.appendChild(document.createTextNode(Number(Math.round(data1[1][i-1] + 'e+8') + 'e-8')));
            td.style.border = '1px solid black';
        }else if(j == 1){
            td.appendChild(document.createTextNode(Number(Math.round(data2[1][i-1] + 'e+8') + 'e-8')));
            td.style.border = '1px solid black';
        }else if(j == 3){
        td.appendChild(document.createTextNode(Number(Math.round(data2[1][i-1]/data1[1][i-1] + 'e+8') + 'e-8')));
        td.style.border = '1px solid black';
    }
      }
    }
    body.appendChild(tbl);
  }
  


function loadData() {
    const fetchedData = fetch('daneRownolegle.txt')
        .then(result => result.text())
        .then(row => {

            const fetchedData = fetch('daneSekwencyjne.txt')
                .then(result => result.text())
                .then(sek => {

                    let data1 = parse(row);
                    let data2 = parse(sek);

                    drawGraph(data1[0], data1[1], data2[1]);
                    tableCreateResult(data1, data2);
                    tableCreateStatistic(data1, data1[2], data1[3], data2[2], data2[3])
                })
        })
}



const chunkArray = (arr, chunk) => {
    let chunkedArray = [];
    for (let num of arr) {
        const lastChunk = chunkedArray[chunkedArray.length - 1];
        if (!lastChunk || lastChunk.length === chunk) {
            chunkedArray.push([num]);
        } else {
            lastChunk.push(num);
        }
    }
    return chunkedArray;
};

function drawGraph(axisX, data1, data2) {
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: [...axisX],
            datasets: [{
                    label: "Równoległe",
                    data: [...data1],
                    borderColor: "cadetblue",
                    fill: false
                },
                {
                    label: "Sekwencyjne",
                    data: [...data2],
                    borderColor: "coral",
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Wykres zależności liczby wątków od czasu'
                }

            },
            responsive: false,
            maintainAspectRatio: true
        }
    });
}