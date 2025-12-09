
function showInfo(idName) {
    document.getElementById(idName).classList.toggle("hidden");
}



const threats = ["Climate change could be irreversible by 2030",
    "Greenhouse gas levels are at an all-time high",
    "More than 1 million species face extinction",
    "Climate change is creating a refugee crisis",
    "The last 7 years have been the warmest on record",
    "Atmospheric Carbon Dioxide levels reached a record high in 2024, exceeding 421 parts per million—over 50% higher than pre-industrial levels.",
    "Since 1880, the global average surface temperature has increased by 2.12 degrees Fahrenheit.",
    "At least 3.6 billion people live in areas that are highly vulnerable to the impacts of climate change, including extreme weather and sea-level rise.",
    "Greenland and Antarctica have lost an average of 427 billion tons of ice per year.",
    "Glaciers worldwide have lost 890 cubic miles of ice since 1961.",
    "Oceans have absorbed about 90% of the excess heat from global warming, leading to rising ocean temperatures.",
    "If warming exceeds 2°C, 99% of coral reefs will be lost."    
];

var flowers = [];



function calculateEnergyAvailability(date, ){

}


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
const colorRange = 1.7;
(async () => {
  try {

    const csvData = await fetchAndGetCsvString();
    if (csvData && csvData.trim() !== '') {

    // Split the CSV data into rows using the newline character
    const rows = csvData.split('\n');
    // Initialize an empty array to hold the series data
    const series = [];

    const obj = {};
    for (let i = 0; i < rows.length; i++) {
        // Split the row into an array using the comma separator
        const row = rows[i].split(',');
        obj[row[0]] = parseInt(((parseInt(row[6]) + parseInt(row[9]))- (parseInt(row[4]) + parseInt(row[8])))/ 60000 * 100);  

        
        // Add the object to the series array
    }
    series.push(obj);
    makeEnergyCircle(series);
    makeHourOptions(series);
    makeDayOptions(series);
    initializeReminder();
    } else {
        console.warn('CSV string is empty or undefined.');
        }
    } catch (error) {
        console.error('Error:', error);  
    }  
})();  


    function find12hr(t) { // converts 24 hr time into 12 hr time
        t = t%24;
        let output = t%12;
        let meridiem;
        let opposite;
        if (t > 12 || t == 0) {
            meridiem = " pm";
            opposite = " am";
        } else {
            meridiem = " am";
            opposite = " pm";
        }
        if (output == 0) {
            output = 12;
            meridiem = opposite;
        }
        return output + meridiem
     }

    function find24hr(t) { // converts 12 hr time into 24 hr time
        if (t === "Now") {
            const now = new Date();
            return now.getHours();
        }

        let meridiem = t.slice(-2);
        let hour = parseInt(t.slice(0, -3));
        if (meridiem === " am") {
            if (hour === 12) {
                hour = 0;
            }
        } else {
            if (hour !== 12) {
                hour += 12;
            }
        }
        return hour;
    }
    /**
     * Finds the date stamp for a given time.
     * @param {string} t - number of minutes past current time.
     */
    function findDateStamp(t){ 
        const now = new Date();
        
        
        const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const originalMinutes = now.getMinutes() + t;
        const originalHour = String(((parseInt(now.getMinutes()> 57.5 ? now.getHours() +1 : now.getHours()) + parseInt(originalMinutes/60))));
        const originalDay = now.getDate() + parseInt((originalHour)/24);
        const originalMonth = now.getMonth() + 1 + (originalDay > monthLengths[now.getMonth() ] ? 1 : 0);

        const minutes = (Math.round(parseInt(originalMinutes) / 5) * 5) % 60; // round to nearest 5 minutes
        const hour = originalHour%24;
        const day = originalDay > monthLengths[now.getMonth()] ? originalDay - monthLengths[now.getMonth()] : originalDay;
        const year = now.getFullYear() + (originalMonth > 12 ? 1 : 0);
        const month = originalMonth > 12 ? originalMonth - 12 : originalMonth;
        // Create the date string in the format "MM/DD/YYYY HH:MM"
        const dateString = String(month).padStart(2, '0') + "/" + String(day).padStart(2, '0')
        + "/" + year + " " + String(hour).padStart(2, '0')
        + ":" + String(minutes).padStart(2, '0');
        return dateString;  
    }


    function renderHours(idealHourIndex, hours){
        const now = new Date();
        
        var hourIndex = idealHourIndex;

        
        const timeOptions = document.getElementById("time-options");
        const hourBoxes = document.querySelectorAll(".hour");
        
        for (let i = 0; i < hourBoxes.length; i++) {
            const hourBox = hourBoxes[i];
            hourBox.setAttribute("index", parseInt(hourIndex) + i);
            const timeText = hourBox.querySelector("p");
            timeText.textContent = parseInt(hourBox.getAttribute("index")) === 0 ? "Now" 
                :find12hr(parseInt(Object.keys(hours[parseInt(hourBox.getAttribute("index"))])[0].split(" ")[1].split(":")[0]));
            //circle
            const circle = hourBox.querySelector(".small-circle");
            circle.style.backgroundColor = "hsl(" + Object.values(hours[hourBox.getAttribute("index")])[0] *parseInt(colorRange) + ", 90%, 50%)";
            circle.textContent = parseInt(hourBox.getAttribute("index")) === 0 ? document.getElementsByClassName("circle")[0].textContent
                :String(Object.values(hours[hourBox.getAttribute("index")])[0]);
            hourBox.appendChild(circle);
            if (hourBox.querySelector(".price-tag")) {
                // Remove the price tag if it exists
                hourBox.removeChild(hourBox.querySelector(".price-tag"));
            }
            if (timeText.textContent === "4 pm" 
            || timeText.textContent === "5 pm" 
            || timeText.textContent === "6 pm" 
            || timeText.textContent === "7 pm" 
            || timeText.textContent === "8 pm" 
            || timeText.textContent === "9 pm"
            || (timeText.textContent === "Now"
            && (parseInt(now.getHours()) >= 16
            && parseInt(now.getHours()) <= 21)
            )) {
                const priceTag = document.createElement("img");
                priceTag.className = "price-tag";
                priceTag.src = "dollar-sign.png";
                hourBox.appendChild(priceTag);
            } 
            hourBox.addEventListener('click',  function() {makeReminderVisible(circle.textContent, parseInt(((i+now.getHours())/24+now.getDay())%7), timeText.textContent);});
        }
        highlightCorrectDay(hourIndex)        
    }

    function highlightCorrectDay(hourIndex){
        const now = new Date();
        const days = document.getElementsByClassName("day");
        const day = parseInt((hourIndex + now.getHours())/24);
        for (let i = 0; i < document.getElementsByClassName("day").length; i++) {
            if (parseInt(i) === parseInt(day)) {
                days[i].classList.add("selected");
            } else {
                days[i].classList.remove("selected");
            }
        }    
    }

    function makeEnergyCircle(series){
        //Make current energy avaliability circle
    const currentEnergy = document.getElementById("current-energy");
    const circle = document.createElement("div");
    circle.className = "circle";
    const now = new Date();
    const dateString = findDateStamp(0); 
    console.log(dateString);
    console.log(series[0][dateString]);
    
    const goodness = String(series[0][dateString]);
    circle.style.backgroundColor = "hsl(" + String(series[0][dateString] * parseInt(colorRange)) + ", 90%, 50%)";
    
    circle.appendChild(document.createTextNode(goodness));
    currentEnergy.appendChild(circle);

    currentEnergy.append(String(goodness > 90 ? "Best"
    : goodness > 75 ? "Very High"
    : goodness > 60 ? "High"
    : goodness >  45? "Moderate" 
    : goodness > 30 ? "Low"
    : goodness > 15 ? "Very Low"
    : "Avoid Use"));
    }

    function makeHourOptions(series){
    const now = new Date();
    //Make hour boxes
    const timeOptions = document.getElementById("time-options");
    const hourContainer = document.createElement("div");
    hourContainer.classList.add("hour-container")
    const hours = [];
    const numHours = 23-parseInt(now.getHours()) + 6*24;
    const boxesOnScreen = numHours
    for (let i = 0; i < numHours; i++){

        const dateString = findDateStamp(i*60 - now.getMinutes() + 5);        
        const obj = {};

        console.log(dateString + " " + i);
        obj[dateString] = series[0][dateString];
        hours.push(obj);
    }
    console.log(hours);
    timeOptions.innerHTML = ""; 
    for (let i = 0; i < parseInt(boxesOnScreen); i++){
        const hourBox = document.createElement("button");
        hourBox.className = "hour";
        if (i === 0) {
            hourBox.classList.add("first-hour");
        }
        const timeText = document.createElement("p");
        hourBox.appendChild(timeText);
        hourBox.setAttribute("index", i);
        
        
        //Circle
        const circle = document.createElement("div");
        circle.className = "small-circle";
        hourBox.appendChild(circle);        
        hourContainer.appendChild(hourBox);
        
    }

    timeOptions.appendChild(hourContainer)
    console.log("Hours: " + hours.length);
    renderHours(0, hours); 
    hourContainer.addEventListener('scroll', function() {
        const now = new Date();
        let myIndex = Array.from(document.getElementsByClassName("hour")).filter((i)=>(i.getBoundingClientRect().left+i.getBoundingClientRect().right)/2>=0)[0];
        highlightCorrectDay(parseInt(myIndex.getAttribute("index")));
        
    });
}
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function makeDayOptions(series){
    const now = new Date();
    // Day options
    const dayOptions = document.getElementById("day-options");

    for (let i = 0; i < 7; i++) {
        const dayBox = document.createElement("div");
        dayBox.className = "day";
        const timeText = document.createElement("p");
        if (i === 0) {
            dayBox.classList.add("first-day");
            dayBox.classList.add("selected");
            timeText.textContent = "Today";
        } else{
            const dayOfWeekNumber = now.getDay() + i;
            timeText.textContent = daysOfWeek[dayOfWeekNumber%7];
        }
        dayBox.appendChild(timeText);
        
        //Circle
        let dayHigh = 0;
        for (let j = 0; j < (24*60); j+=5){
            const dateString = findDateStamp(j - (now.getMinutes() + now.getHours() * 60) + (i * 24 * 60));
            if (series[0][dateString] > dayHigh) {
                dayHigh = series[0][dateString];
            }
        }
        const circle = document.createElement("div");
        circle.className = "day-circle";
        circle.style.backgroundColor = "hsl(" + dayHigh *parseInt(colorRange) + ", 90%, 50%)";
        circle.textContent = String(dayHigh);
        dayBox.appendChild(circle);
        // Add the day high
        const dayHighText = document.createElement("p");
        dayHighText.className = "day-high";
        dayHighText.textContent = String(dayHigh);
        dayBox.appendChild(dayHighText);

        // Add the day low
        let dayLow = 100;
        for (let j = 0; j < (24*60); j+=5){
            const dateString = findDateStamp(j - (now.getMinutes() + now.getHours() * 60) + (i * 24 * 60));
            if (series[0][dateString] < dayLow) {
                dayLow = series[0][dateString];
            }
        }
        const dayLowText = document.createElement("p");
        dayLowText.className = "day-low";
        dayLowText.textContent = "Low: " + String(dayLow);
        
        const container = document.createElement("div");
        container.style.justifyContent = "space-between";
        container.style.display = "flex";
        container.style.width = "100%";
        
        container.appendChild(dayHighText);
        container.appendChild(dayLowText);
        dayBox.appendChild(dayLowText);

        dayBox.onclick = function() {
            const now = new Date();
            let myIndex = Array.from(document.getElementsByClassName("hour")).filter((i)=>(i.getBoundingClientRect().left+i.getBoundingClientRect().right)/2>=0)[0];
            var index = i*24 + (parseInt(myIndex.getAttribute("index")) + now.getHours())%24 - now.getHours();
            const hourContainer = document.getElementsByClassName("hour-container")[0];

            if (index > 23-parseInt(now.getHours()) + 6*24 - boxesOnScreen) {
                var boxesOnScreen = 0;
                const elements = Array.from(document.getElementsByClassName("class"));
                for (var hour in elements){
                    if (hour.getBoundingClientRect().left > 0 && hour.getBoundingClientRect().left < hourContainer.getBoundingClientRect().left){
                        boxesOnScreen ++;
                    }
                }
                hourContainer.scrollTo(hourContainer.scrollBy({left: hourContainer.scrollWidth}));
                index = 23-parseInt(now.getHours()) + 6*24 - boxesOnScreen;
            } else {
                if (index < 0) {
                    index = 0;
                }
                const p = Array.from(document.getElementsByClassName("hour"))[index];
                hourContainer.scrollTo({left: p.getBoundingClientRect().left + hourContainer.scrollLeft-4.5});
            }
        };

            dayOptions.appendChild(dayBox);
        }
    } 
function makeReminderVisible(energy, day, time){
    const reminderContainer = document.getElementById("reminder-container");
    const reminderCircle = document.getElementById("reminder-circle");
    const reminderDay = document.getElementById("reminder-day");
    const reminderHour = document.getElementById("reminder-hour");
    reminderHour.textContent = time;
    console.log(reminderCircle.textContent + "Day: " + day);
    reminderCircle.textContent = energy;
    reminderCircle.style.backgroundColor = "hsl(" + energy *parseInt(colorRange) + ", 90%, 50%)";
    reminderDay.textContent = day == new Date().getDay() ? "Today" : daysOfWeek[day];
    reminderContainer.style.display = "flex";
    const button = document.getElementById("reminder-button");
    button.textContent = "Choose Appliance";
    button.style.backgroundColor = "#a3a3a3";
    button.style.color = "#f4f4f4";
    const reminderConfirm = document.getElementById("reminder-confirm");
    reminderConfirm.classList.remove("reminder-confirm-selected");
    reminderConfirm.classList.add("reminder-confirm");
}

function initializeReminder(){
    const reminderCancel = document.getElementById("reminder-cancel");
    reminderCancel.onclick = function() {
        const reminderContainer = document.getElementById("reminder-container");
        reminderContainer.style.display = "none";
        const button = document.getElementById("reminder-button");
        button.textContent = "Choose Appliance";
        button.style.backgroundColor = "#a3a3a3";
        button.style.color = "#f4f4f4";
        const reminderConfirm = document.getElementById("reminder-confirm");
        reminderConfirm.classList.remove("reminder-confirm-selected");
        reminderConfirm.classList.add("reminder-confirm");
    }
    document.querySelectorAll(".dropdown-content a").forEach(item => {
    item.addEventListener("click", event => {
        const selected = event.target.textContent;
        const button = document.getElementById("reminder-button");
        button.textContent = selected;
        button.style.backgroundColor = "#f4f4f4";
        button.style.color = "#a3a3a3";
        const reminderConfirm = document.getElementById("reminder-confirm");
        reminderConfirm.classList.remove("reminder-confirm");
        reminderConfirm.classList.add("reminder-confirm-selected");
    });
    });
    const confirmButton = document.getElementById("reminder-confirm");
    confirmButton.addEventListener("click", function() {
        if (confirmButton.classList.contains("reminder-confirm-selected")) {
            const reminderContainer = document.getElementById("reminder-container");
            reminderContainer.style.display = "none";
            subscribeToPush();
            const hours = find24hr(document.getElementById("reminder-hour").textContent);
            const day = document.getElementById("reminder-day").textContent;
            let notifyDate = new Date();
            const now = new Date();
            const targetDayIndex = day == "Today" ? daysOfWeek.indexOf(now.getDay()) : daysOfWeek.indexOf(day);
            const currentDayIndex = daysOfWeek.indexOf(now.getDay());
            const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
            console.log("Days until target: " + daysUntilTarget);
            notifyDate.setHours(hours,0,0,0);
            notifyDate.setDate(now.getDate() + daysUntilTarget);
            const message = threats[Math.floor(Math.random() * threats.length)];
            console.log(message);
            notifyUser(localStorage.getItem("userId"),
                document.getElementById("reminder-button").textContent + " Reminder", 
                message, 
                notifyDate);
        }
    });
}


async function registerSW() {
    if (!("serviceWorker" in navigator)) return;

    const reg = await navigator.serviceWorker.register("/purrwatt/service-worker.js");
    console.log("Service worker registered:", reg);
}

registerSW();

async function subscribeToPush() {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return alert("Notifications blocked");

    const sw = await navigator.serviceWorker.ready;

    const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "BLZeHawWnSB4DNsIzrVFxrP_qxEYBIgGSjYKUB2-xxJJmFUuMzsSLTLNxnPnz-hPvPaDEFnYPEzYZPGk328Ssm0"
    });
    // Send subscription to backend
    if (!localStorage.getItem("userId")) {
        localStorage.setItem("userId", "user-" + crypto.randomUUID());
    }
    await fetch("https://caiso-proxy-repo.onrender.com/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            subscription
        })
    });
    console.log("Subscribed:", subscription);
}
async function notifyUser(userId, title, body, time) {
    // await fetch("https://caiso-proxy-repo.onrender.com/notify", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         userId,
    //         title,
    //         body
    //     })
    // }
    // );
    await fetch("https://caiso-proxy-repo.onrender.com/notify-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId,
            title,
            body,
            time
        })
    }
    );
    console.log("Notification scheduled: " + time.toString());
}