export const base_url = "http://localhost:8055";

/* login Api Post Data */

export async function checkLogin() {
    let response = await retryAccessToken();
    return response;
}

export async function login(email, password) {
    let response = false;
    await fetch('/auth/login', {
        method: 'POST',
        crossDomain: true,
        async: false,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.access_token) {
                // localStorage.setItem("userCred", result.data);
                localStorage.setItem("access_token", result.data.access_token);
                localStorage.setItem("refresh_token", result.data.refresh_token);
                localStorage.setItem("expires", Date.now() + (result.data.expires * 0.9));
                response = true;
                userMe();
            }
            else {
                response = false;
            }
        })
    return response;
}

/* userMe Api Get Data */

export async function userMe() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    await fetch('/users/me', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.first_name) {
                let name = result.data.first_name;
                let id = result.data.id;
                if (result.data.last_name)
                    name = name + ' ' + result.data.last_name;
                let user = { name, id };
                localStorage.setItem("user", JSON.stringify(user));
                // localStorage.setItem("first_name", JSON.stringify(result.data.first_name));
                // localStorage.setItem("last_name", JSON.stringify(result.data.last_name));
            }
        })
}

export function getAccessToken() {
    if (localStorage.getItem("expires") < Date.now()) {
        let response = retryAccessToken();
    }
    return localStorage.getItem("access_token");
}

export async function retryAccessToken() {
    let response = false;
    if (!localStorage.getItem("refresh_token"))
        return false;
    await fetch('/auth/refresh', {
        method: 'POST',
        crossDomain: true,
        async: false,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "refresh_token": localStorage.getItem("refresh_token") }),
    })
        .then(response => response.json())
        .then(result => {
            if (result.data && result.data.access_token) {
                // localStorage.setItem("userCred", result.data);
                localStorage.setItem("access_token", result.data.access_token);
                localStorage.setItem("refresh_token", result.data.refresh_token);
                localStorage.setItem("expires", Date.now() + (result.data.expires * 0.9));
                response = true;
                userMe();
            }
            else {
                response = false;
            }
        })
    return response;
}

/* Massage Api Get Data */

export async function getMassage() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/messages', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json()
    return result;
}

/* AddMassage Api Post Data */

export async function addMassage(room, title, content) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/messages', {
        method: 'post',
        body: JSON.stringify({ "room": room, "title": title, "content": content }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Room Api Get Data */

export async function getRoom() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/rooms/', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* AddImageFile Api Post Data */

export async function addImageFile(file) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    const formData = new FormData();
    formData.append('file', file);
    let result = await fetch('/files', {
        method: 'POST',
        headers: myHeaders,
        body: formData,
    })
    result = await result.json();
    return result;
}

/* Food Menu Api Get Data */

export async function getFoodMenu() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/food_menu', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* Add Food Menu Api Post Data */

export async function addFoodMenuList(name, price, pic, desc) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/food_menu', {
        method: 'post',
        body: JSON.stringify({ "name": name, "price": price, "desc": desc, "pic": pic }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Editing Food Menu Api Get Data */

export async function showFoodMenuGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/food_menu/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing Food Menu Api Patch Data */

export async function editFoodMenu(id, name, price, pic, desc) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/food_menu/' + id, {
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "name": name, "price": price, "desc": desc, "pic": pic }),
    })
    result = await result.json();
    return result;
}

/* Delete Food Menu Api Delete Data */

export async function deleteFoodMenu(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/food_menu/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* IPTV Api Get Data */

export async function getIPTV() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/iptv', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* IPTV Api Post Data */

export async function AddIPTVData(logo, name, number) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/iptv', {
        method: 'post',
        body: JSON.stringify({ "logo": logo, "name": name, "number": number }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Delete IPTV Api Delete Data */

export async function deleteIPTV(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/iptv/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Editing IpTv Api Get Data */

export async function editIPTVGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/iptv/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing IpTv Api Patch Data */

export async function editIPTV(id, logo, name, number, protocol, port, mip) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/iptv/' + id, {
        credentials: "include",
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "logo": logo, "name": name, "number": number, "protocol": protocol, "port": port, "mip": mip, }),
    })
    result = await result.json();
    return result;
}

/* World Clock Api Get Data */

export async function getWorldClock() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/world_clock', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* Add World Clock Api Post Data */

export async function addWorld_Clock(icon, city_name, time_zone, current_time) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/world_clock', {
        method: 'post',
        body: JSON.stringify({ "icon": icon, "city_name": city_name, "time_zone": time_zone, "current_time": current_time }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Delete World Clock Api Delete Data */

export async function deleteWorldClock(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/world_clock/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Editing World Clock Api Get Data */

export async function editWorldClockGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/world_clock/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing WorldClock Api Patch Data */

export async function editWorldClock(id, icon, city_name, time_zone, current_time) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/world_clock/' + id, {
        credentials: "include",
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "icon": icon, "city_name": city_name, "time_zone": time_zone, "current_time": current_time }),
    })
    result = await result.json();
    return result;
}

/* Navigation Api Get Data */

export async function getNavigation() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/info_desk', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* Add Navigation Api Post Data */

export async function addNavigations(logo, title, action) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/info_desk', {
        method: 'post',
        body: JSON.stringify({ "logo": logo, "title": title, "action": action }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Delete Navigation Api Delete Data */

export async function deleteNavigation(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/info_desk/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Editing Navigation Api Get Data */

export async function showNavigationGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/info_desk/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing Navigation Api Patch Data */

export async function editNavigations(id, logo, title, action) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/info_desk/' + id, {
        credentials: "include",
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "logo": logo, "title": title, "action": action }),
    })
    result = await result.json();
    return result;
}

/* Promotions Api Get Data */

export async function getPromotions() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/promotions', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* Add Promotions Api Post Data */

export async function addPromotion(title, image, start_date, end_date) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/promotions', {
        method: 'post',
        body: JSON.stringify({ "title": title, "image": image, "start_date": start_date, "end_date": end_date }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Delete Promotions Api Delete Data */

export async function deletePromotions(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/promotions/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    console.log(result);
    return result;
}

/* Editing Promotions Api Get Data */

export async function editPromotionsGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/promotions/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing Promotions Api Patch Data */

export async function editPromotions(id, title, image, start_date, end_date) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/promotions/' + id, {
        credentials: "include",
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "title": title, "image": image, "start_date": start_date, "end_date": end_date }),
    })
    result = await result.json();
    return result;
}

/* Onclick Action Api Get Data */

export async function getAction() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}
/* Onclick Action Api Post Data */

export async function addAction(title, action_type, action_details) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action', {
        method: 'post',
        body: JSON.stringify({ "title": title, "action_type": action_type, "action_details": action_details }),
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Delete Action Api Delete Data */

export async function deleteAction(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    return result;
}

/* Editing Action Api Get Data */

export async function editActionGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing Action Api Patch Data */

export async function editAction(id, title, action_type, action_details) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/action/' + id, {
        credentials: "include",
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "title": title, "action_type": action_type, "action_details": action_details }),
    })
    result = await result.json();
    return result;
}

/* Onclick ActionType Api Get Data */

export async function getActionType() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action_type', {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* Onclick ActionType Api Post Data */

export async function AddActionType(title, action_type,) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action_type', {
        method: 'Post',
        body: JSON.stringify({ "title": title, "action_type": action_type, }),
        headers: myHeaders,
    })
    result = await result.json();
    return result;
}

/* Editing ActionType Api Get Data */

export async function editActionTypeGet(id) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action_type/' + id, {
        method: 'GET',
        async: false,
        crossDomain: true,
        headers: myHeaders,
    });
    result = await result.json();
    return result;
}

/* Editing ActionType Api Patch Data */

export async function editActionType(id, title, action_type) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*",);
    let result = await fetch('/items/action_type/' + id, {
        credentials: "include",
        method: 'PATCH',
        headers: myHeaders,
        body: JSON.stringify({ "id": id, "title": title, "action_type": action_type, }),
    })
    result = await result.json();
    return result;
}

/* Delete ActionType Api Delete Data */

export async function deleteActionType(id) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + getAccessToken());
    let result = await fetch('/items/action_type/' + id, {
        method: 'Delete',
        headers: myHeaders
    })
    result = await result.json();
    return result;
}