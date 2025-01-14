var e = 1120222121; // This is the project id of the starting project
var h = 7131; // This will be the next project's remix number.
var csrf = document.cookie.split('; ').find(row => row.startsWith('scratchcsrftoken=')).split('=')[1]; // your scratch X-CSRFToken
var xtoken = "83c36f55138348fc91627879b3a44d0f:-NB2RTu4M3j1xUZy0OBFN4SpoPk"; // your scratch x-token
var cookies = ``; // scratch browser cookies

// Retry function without delay
async function retryFetch(url, options, retries = Infinity) {
    let attempts = 0;
    while (true) {
        try {
            let response = await fetch(url, options);
            if (response.ok) {
                console.log(`Fetch successful after ${attempts + 1} attempt(s)`);
                return response;
            } else {
                console.warn(`Fetch attempt ${attempts + 1} failed: ${response.statusText}`);
            }
        } catch (error) {
            console.warn(`Fetch attempt ${attempts + 1} failed: ${error}`);
        }
        attempts++;
    }
}

// JSBOMB function
async function jsbomb() {
    try {
        // Create the new project with a specific title format
        var mod = h%1000
        if (mod<100) {
            var mod = '0' + mod
            if (mod<10) {
                var mod = '0' + mod
            }
        }
        var projectTitle = "Untitled-1088 Remix " + h + "";
        var newProject = await retryFetch("https://projects.scratch.mit.edu/?is_remix=1&original_id=" + e + "&title=" + encodeURIComponent(projectTitle), {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/json",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "cookie": cookies
            },
            "referrer": "https://scratch.mit.edu/",
            "body": '{"targets":[{"isStage":true,"name":"Stage","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"backdrop1","dataFormat":"svg","assetId":"cd21514d0531fdffb22204e0ec5ed84a","md5ext":"cd21514d0531fdffb22204e0ec5ed84a.svg","rotationCenterX":240,"rotationCenterY":180}],"sounds":[],"volume":100,"layerOrder":0,"tempo":60,"videoTransparency":50,"videoState":"on","textToSpeechLanguage":"en"},{"isStage":false,"name":"Sprite1","variables":{},"lists":{},"broadcasts":{},"blocks":{},"comments":{},"currentCostume":0,"costumes":[{"name":"costume1","bitmapResolution":1,"dataFormat":"svg","assetId":"48a0f84cb10d72fda68a0e6a605acf10","md5ext":"48a0f84cb10d72fda68a0e6a605acf10.svg","rotationCenterX":47.58949126262232,"rotationCenterY":49.82001167683757},{"name":"costume2","bitmapResolution":1,"dataFormat":"svg","assetId":"666bfc27332237ed84c428f84674cba8","md5ext":"666bfc27332237ed84c428f84674cba8.svg","rotationCenterX":45.9539025753854,"rotationCenterY":52.40377293006547}],"sounds":[],"volume":100,"layerOrder":1,"visible":true,"x":0,"y":0,"size":100,"direction":90,"draggable":false,"rotationStyle":"all around"}],"monitors":[],"extensions":[],"meta":{"semver":"3.0.0","vm":"5.0.40","agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"}}',
            "method": "POST",
            "mode": "cors"
        });

        newProject = await newProject.json();
        e = newProject["content-name"]; // Get the project ID from the response

        h = h + 1; // Increment the remix number
        console.log(h - 1); // Log the project's remix number
        console.log(e); // Log the project's id

        // Share the original project
        await retryFetch("https://api.scratch.mit.edu/proxy/projects/" + e + "/share", {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "X-CSRFToken": csrf,
                "x-token": xtoken,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "cookie": cookies
            },
            "referrer": "https://scratch.mit.edu/",
            "method": "PUT",
            "mode": "cors"
        });

        // Update the project that was just shared with the new title
        await retryFetch('https://api.scratch.mit.edu/projects/' + e, { // Use the ID of the newly created project
            method: 'PUT',
            headers: {
                "X-CSRFToken": csrf,
                "x-token": xtoken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: projectTitle, // Use the new title
                instructions: "UNTITLED-1088 WILL WIN!",
                description: "UNTITLED-1088 WILL BEAT GRIDREMIX!"
            })
        });

        jsbomb(); // Call jsbomb again for the next remix
    } catch (error) {
        console.error(`Failed to process the request: ${error}`);
    }
}

jsbomb();
