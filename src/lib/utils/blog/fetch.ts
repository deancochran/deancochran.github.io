import { browser } from '$app/environment';


export async function fetchWakaStats() {
    if(browser){

        const WAKA_SECRET="waka_bfb91e1c-57e7-40b8-805d-0e2b66b1e87d"
        const apiKey = WAKA_SECRET
        const url = `https://wakatime.com/api/v1/users/current/all_time_since_today?api_key=${apiKey}`;
    
        const requestOptions:RequestInit = {
            method: "GET",
    
            mode:'no-cors'
        };
    
        const response = await fetch(url, requestOptions);
        // console.log(response)
    }

}