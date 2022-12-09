//https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json
console.clear();

const form = document.querySelector("[data-form]");
const btnAddTicket = document.querySelector("[data-btn-addTicket]");

const search = document.querySelector("[data-search]");
const searchLen = document.querySelector("[data-search-length]");
const card = document.querySelector("[data-card]");

let dataArr = [];
let chartArr = [];

const renderCard = (arr) => {
    const str = arr.reduce((acc, crr) => {
        acc += `<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${crr.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${crr.area}</div>
          <div class="ticketCard-rank">${crr.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${crr.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${crr.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${crr.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">${crr.price}</span>
            </p>
          </div>
        </div>
      </li>`;
        return acc;
    }, "");

    searchLen.innerHTML = `本次搜尋共 ${arr.length} 筆資料`;
    card.innerHTML = str;
};

const getChartData = (arr) => {
    const obj = arr.reduce((acc, crr) => {
        if (acc.hasOwnProperty(crr.area)) {
            acc[crr.area] += 1;
        } else {
            acc[crr.area] = 1;
        }
        return acc;
    }, {});
    return Object.entries(obj);
};

const c3Render = (arr) => {
    let chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: arr,
            type: "donut"
        },
        donut: {
            title: "套票地區比重",
            width: 10,
            label: {
                show: false
            }
        }
    });
};

const getFormData = () => {
    const data = new FormData(form);
    const formData = [...data].reduce((acc, [name, value]) => {
        if (
            typeof parseInt(value) === "number" &&
            isNaN(parseInt(value)) === false
        ) {
            acc[name] = parseInt(value);
        } else {
            acc[name] = value.trim();
        }
        return acc;
    }, {});
    const formDataObj = {
        id: dataArr.length,
        name: formData["套票名稱"],
        imgUrl: formData["圖片網址"],
        area: formData["景點地區"],
        description: formData["套票描述"],
        group: formData["套票組數"],
        price: formData["套票金額"],
        rate: formData["套票星級"]
    };
    return formDataObj;
};

const formDataCheck = (obj) => {
    const value = Object.values(obj);
    let boolean = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] == false) {
            boolean = false;
            break;
        } else {
            boolean = true;
        }
    }
    if (boolean) {
        dataArr.push(obj);
        // console.log(dataArr);
    } else {
        alert("Please make sure all fields are filled");
    }
};

axios
    .get(
        "https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json"
    )
    .then((res) => {
        dataArr = res.data;
        renderCard(dataArr);
        chartArr = getChartData(dataArr);
        c3Render(chartArr);
    });

search.addEventListener("change", (e) => {
    const value = e.target.value;
    let arr = [];
    dataArr.forEach((i) => {
        if (value === "") {
            arr.push(i);
        } else if (value === i.area) {
            arr.push(i);
        }
    });
    renderCard(arr);
    chartArr = getChartData(dataArr);
    c3Render(chartArr);
});

btnAddTicket.addEventListener("click", (e) => {
    const data = getFormData();
    formDataCheck(data);
    renderCard(dataArr);
    chartArr = getChartData(dataArr);
    c3Render(chartArr);
});
