let currentCamQrResult = null;
let completedTasks = 0; 
const totalTasks = 7; 
const progressBar = document.getElementById('progress');
const taskCount = document.getElementById('task-count');
const confirmTaskElement = document.querySelector(".confirm-task");
const closeButton = document.querySelector(".close-button");
const taskInput = document.getElementById("task-input");

const videoContainer = document.getElementById('video-container');
const grabFrameButton = document.getElementById('grab-frame');
const img = document.getElementById('taken-photo');
let imageCapture;

const leaveCameraButton = document.getElementById("leave-camera");
const photoSubmissionButton = document.getElementById("submit-image");
let videoCreated;

/* Check if the device already has a unique ID */
let deviceId = localStorage.getItem('deviceId');

/*If no ID is found, create a new one */
if (!deviceId) {
  deviceId = Math.random().toString(36).substr(2, 9);
  localStorage.setItem('deviceId', deviceId);
}

// Close the pop-up
function closePopup() {
  popup.classList.add("hidden");
}

function hideCamera() {
  videoContainer.classList.add("video-hidden");
  videoContainer.classList.remove("video-flex");

  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop()); // Stop all tracks
    stream = null;
  }
}

/* Mark the task as completed */
function completeTask(currentButton) {
  // Check if the task index is not already marked as completed 
  if (!completedTasks.includes(currentButton) && completedTasks.length < totalTasks) {
    // Add the task index to the completed tasks array
    completedTasks.push(currentButton); 
    updateProgress();

    // Disable the map box button corresponding to the task index
    const button = document.querySelectorAll(".map-box")[currentButton];
    if (button) {
      button.disabled = true; 
      button.style.opacity = 0.5;
      button.style.pointerEvents = 'none'; 
    }
    // Mark the corresponding badge as completed
    const badgeImages = document.querySelectorAll('.badge');

// Sending a POST request to /server

fetch('https://i539663.hera.fontysict.net/server', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', 
  },
  // Sends the task name and device ID to the server as JSON
  body: JSON.stringify({
    name: currentButton,
    deviceId: deviceId,  
  }),
  mode: 'cors' 
})
.then(response => {
  console.log(response); 
})
.catch(error => {
  console.error('Error sending data to server:', error); 
});

}
if (currentButton === 0 || currentButton === 1)
{
if (img.src !== "")
{
  closePopup();
  hideCamera();
}
else {
  alert("You have not taken a photo yet.");
}
}
else if (currentButton === 2 || currentButton === 4)
{
    closePopup();
    hideCamera();
}
}


/* Confirm tasks */
function confirmTask() {
  const inputValue = taskInput.value.trim();
  if (completedTasks.length != totalTasks)
  {
    // Tasks 3, 4, and 6 specific validation
    if (currentButton === 3 || currentButton === 5 || currentButton === 6) {
      if (inputValue) {
        switch (currentButton) {
          case 3: // Task 4: Find puzzle pieces, code 1819
            if (inputValue === "1819") {
              completeTask(currentButton);
              closePopup();
            } else {
              alert("Incorrect code. Try again.");
            }
            break;

          case 5: // Task 6: Count cats (answer: 3)
            if (inputValue === "3") {
              completeTask(currentButton);
              closePopup();
            } else {
              alert("Incorrect number of cats. Try again.");
            }
            break;

          case 6: // Task 7: Fun fact (accept any input)
            completeTask(currentButton);
            closePopup();
            break;

          default:
            alert("Unexpected task. Please check the code logic.");
        }
      } else {
        alert("Please enter task details to confirm.");
      }

      // Clear the task input field after confirmation
      taskInput.value = '';
    }
    else if (currentButton === 0 || currentButton === 1 || currentButton === 2 || currentButton === 4)
    {
      openCamera(currentButton);
    }
  }
  else
  {
    closePopup();
  }
}


/* Get completed tasks from localStorage, default empty array*/
completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

/* Checks completedTasks is an array, defaulting to an empty array if not*/
if (!Array.isArray(completedTasks)) {
  completedTasks = [];
}

/* Update the task count*/
function updateProgress() {
  const progress = (completedTasks.length / totalTasks) * 100;
  progressBar.style.width = progress + '%';

  taskCount.textContent = `${completedTasks.length}/${totalTasks}`;

/* Save the completed tasks to localStorage */
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  
  if (completedTasks.length === totalTasks) {
    setTimeout(() => {
      showPopup(null, 7);
    }, 500);
  }
}

updateProgress();

// Task descriptions
const taskDescriptions = [
  "Take a selfie at the convention’s main banner with someone else.",
  "Take a selfie with a superhero!",
  "Search across where green people bite and find the hidden QR code around the map marker.",
  "Find puzzle pieces at the map marker and enter the code to proceed.",
  "Find a QR code around the map marker and scan it.",
  "Count the origami cats around the map marker, how many?",
  "Ask a cosplayer for a fun fact about their character."
];

// Pop-up elements
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const badgesContainer = document.getElementById("task-badges");
// initialize QR Scanner
let scannerQr
let currentButton = null;

// Intercept map box clicks and show the pop-up
document.querySelectorAll(".map-box").forEach((box, index) => {
  box.addEventListener("click", () => {
    showPopup(box, index); 
    currentButton = index; 
  });

  /* Disable tasks that are already completed */
  if (completedTasks.includes(index)) {
    box.disabled = true;
    box.style.opacity = 0.5;
    box.style.pointerEvents = 'none';
  }
});
// Function to add blips dynamically to the map
function addBlipsToMap() {
  const mapParts = [
    { className: 'pink', title: 'Experience', description: 'Explore immersive experiences.', position: { top: '20%', left: '30%' } },
    { className: 'blue', title: 'Gaming', description: 'Find games and tournaments.', position: { top: '50%', left: '50%' } },
    { className: 'green', title: 'Activity', description: 'Participate in fun activities.', position: { top: '10%', left: '80%' } },
    { className: 'orange', title: 'Outdoor', description: 'Relax in the outdoor zone.', position: { top: '30%', left: '20%' } },
    { className: 'red', title: 'Comic', description: 'Discover comics and creators.', position: { top: '60%', left: '40%' } },
    { className: 'yellow', title: 'Dealer', description: 'Shop exclusive merchandise.', position: { top: '70%', left: '10%' } },
    { className: 'purple', title: 'Entertainment', description: 'Enjoy performances and shows.', position: { top: '40%', left: '70%' } }
  ];

  mapParts.forEach(part => {
    const mapBox = document.querySelector(`.map-box.${part.className}`);
    if (mapBox) {
      // Create the blip element
      const blip = document.createElement('div');
      blip.className = 'map-blip';
      blip.title = part.title; // Tooltip for the blip

      // Set the blip position based on the configuration
      blip.style.top = part.position.top;
      blip.style.left = part.position.left;

      // Add click event to show popup with title and description
      blip.addEventListener('click', () => {
        showPopup(part.title, part.description);
      });

      // Append blip to the map box
      mapBox.appendChild(blip);
    }
  });
}

// Call the function to add blips
addBlipsToMap();




function setResult(result, currentButton) {
  currentCamQrResult = result.data;
  if (currentButton === 2 && result.data == "https://www.youtube.com/watch?v=XfELJU1mRMg")
  {
    scannerQr.stop();
    completeTask(currentButton);
  }
  else if (currentButton === 4 && result.data == "https://www.youtube.com/watch?v=M5V_IXMewl4")
  {
    scannerQr.stop();
    completeTask(currentButton);
  }
  else {
    alert("Invalid QR Code. Please try again.");
  }
}
 

let stream
let videotrack
async function openCamera(currentButton) {
  videoContainer.classList.remove("video-hidden");
  videoContainer.classList.add("video-flex");

  if (!videoCreated) {
    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    videoContainer.appendChild(video);
    videoCreated = true;
  }

  if (currentButton === 0 || currentButton === 1)
  {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { minAspectRatio: 1.333, facingMode: { exact: "user"}, 
       },
    });
  }

  const videoElement = document.querySelector("video");
  videoElement.srcObject = stream;

  if (currentButton === 2 || currentButton === 4) {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { minAspectRatio: 1.333, facingMode: { exact: "environment" },
      }
    });
    // Set up QR scanner if required
    scannerQr = new QrScanner(
      videoElement,
      (result) => setResult(result, currentButton),
      { returnDetailedScanResult: true }
    );
    scannerQr.start();
  }
}

function takePhoto() {
  const video = document.querySelector("video");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas size to video dimensions
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas content to an image
  const imageData = canvas.toDataURL("image/png");
  img.src = imageData; // Display captured photo
  img.classList.remove("hidden");

  console.log("Photo captured:", imageData);
}

// Show the pop-up
function showPopup(button, currentButton) 
{
  // currentButton = button; // Store the button for later use
  let currentTaskName;
  switch (currentButton)
  {
    case 0:
      currentTaskName = "Experience area";
      break;
    case 1:
      currentTaskName = "Gaming area";
      break;
    case 2:
      currentTaskName = "Activity area";
      break;
    case 3:
      currentTaskName = "Outdoor area";
      break;
    case 4:
      currentTaskName = "Comic area";
      break;
    case 5:
      currentTaskName = "Dealer area";
      break;
    case 6:
      currentTaskName = "Entertainment area";
      break;
  }
  popupTitle.textContent = `Task ${currentTaskName}`;
  popupDescription.textContent = taskDescriptions[currentButton];
  if (currentButton === 0 || currentButton === 1)
  {
    confirmTaskElement.innerHTML = "Open Camera";
    taskInput.style.display = "none";
    photoSubmissionButton.style.display = "block";
    grabFrameButton.style.display = "block";
    img.style.display = "block";
  }
  else if (currentButton === 2 || currentButton === 4)
  {
    confirmTaskElement.innerHTML = "Scan QR Code";
    taskInput.style.display = "none";
    photoSubmissionButton.style.display = "none";
    grabFrameButton.style.display = "none";
    img.style.display = "none";
  }
  else if (currentButton === 7)
  {
    popupTitle.textContent = "Congratulations!";
    popupDescription.textContent = "You have completed all the tasks. Go between 14:00 and 15:00 to front of vip area to get your reward!";	
    closeButton.style.display = "none";
    confirmTaskElement.innerHTML = "Cool!";
    taskInput.style.display = "none";
    photoSubmissionButton.style.display = "block";
    grabFrameButton.style.display = "block";
    img.style.display = "block";
  }
  else {
    confirmTaskElement.innerHTML = "Confirm Task";
    taskInput.style.display = "block";
    photoSubmissionButton.style.display = "block";
    grabFrameButton.style.display = "block";
    img.style.display = "block";
  }
  popup.classList.remove("hidden");
}

const badgeSources = [
  './images/experienceBadge3.svg',
  './images/gamingBadge3.svg',
  './images/activitiesBadge3.svg',
  './images/outdoorBadge3.svg',
  './images/comicBadge3.svg',
  './images/dealerBadge3.svg',
  './images/entertainmentBadge3.svg'
];

/* Render badges */
if (badgesContainer) {
  badgeSources.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Badge ${index + 1}`;
    img.className = 'badge';

    if (completedTasks.includes(index)) {
      img.classList.add('completed');
    }

    badgesContainer.appendChild(img);
  });
}

grabFrameButton.onclick = takePhoto;



// function takePhoto() {
//   console.log(videotrack)
//   const imageCapturer = new ImageCapture(videotrack);
//   imageCapturer.takePhoto().then(function(blob) {
//     console.log('Took photo:', blob);
//     img.classList.remove('hidden');
//     img.src = URL.createObjectURL(blob);
//   }).catch(function(error) {
//     console.log('takePhoto() error: ', error);
//   });
// }



leaveCameraButton.addEventListener('click', hideCamera)

photoSubmissionButton.addEventListener('click',() =>
{
  completeTask(currentButton);
})
