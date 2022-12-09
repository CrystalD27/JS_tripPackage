//lv1:https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json
//lv2:https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json


// 1.purpose: get jason data by using axios 
let data = [];
let url = "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
axios.get(url).then((rse) => {
    //console.log(rse.data.data) //驗證是否抓到資料
    data = rse.data.data;
    //console.log(data) //驗證資料是否已賦予到data
    render(data); //渲染畫面
    renderC3();

})

// write all the const 
const ticketList = document.querySelector(".ticketCard-area");
const searchNum = document.querySelector("#searchResult-text");
const selectRegion = document.querySelector(".regionSearch");
const cantFind = document.querySelector(".cantFind-area");
const form = document.querySelector(".addTicket-form");
//DOM-add info 
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
//DOM-add info btn
const addTicketBtn = document.querySelector(".addTicket-btn");
//2.目的：讓資料以li方式帶入網頁中ul中列表顯示 
//2.1開render函式，並把data帶入函式中
//2.2字串相加
//2.3 將資料加入到指定位置

function render(data) {
    let str = "";
    data.forEach(item => {
        //console.log(item);
        let content = `<li class="ticketCard">
    <div class="ticketCard-img">
        <a href="#">
            <img src="${item.imgUrl}"
                alt="">
        </a>
        <div class="ticketCard-region">${item.area}</div>
        <div class="ticketCard-rank">${item.rate}</div>
    </div>
    <div class="ticketCard-content">
        <div>
            <h3>
                <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
            ${item.description}
            </p>
        </div>
        <div class="ticketCard-info">
            <p class="ticketCard-num">
                <span><i class="fas fa-exclamation-circle"></i></span>
                剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
                TWD <span id="ticketCard-price">${item.price}</span>
            </p>
        </div>
    </div>
</li>`
        str += content;
    });
    ticketList.innerHTML = str;
    //console.log(ticketList)
}

//3.目的：再按新增套票同時，可以把資料丟入資料中
addTicketBtn.addEventListener("click", () => {


    const isValidated = getIsValidated();
    // 驗證失敗的處理也需要跑回圈並給予錯誤內容
    if (!isValidated) {
        inputs.forEach((inputElement) => {
            handleInputValidate(inputElement);
        });

        alert("表單驗證失敗");
        return;
    }


    // 驗證通過的處理
    let newList = {
        id: Date.now(),
        area: ticketRegion.value,
        name: ticketName.value,
        imgUrl: ticketImgUrl.value,
        price: Number(ticketPrice.value),
        group: Number(ticketNum.value),
        rate: Number(ticketRate.value),
        description: ticketDescription.value,
    }
    data.push(newList); //push newList 到data中
    //console.log(newList);
    form.reset();//新增後form值會消失
    render(data);//將新增的list加上在data中
    renderC3();//將新增資料加入圖表中


})



//3.選取地區，下面選項會依照該選取區域排列顯示
//3.1要先用DOM選取要監聽事件
//3.2思考要如何取到台北，台中，高雄的值，並帶入函式
selectRegion.addEventListener("change", (e) => {
    //console.log(e.target.value);
    renderRegionList(e.target.value);
})

//3.3 將3.2值帶入函式中，並宣告catchData做篩選資料
//3.4 catchData 做字串相加，並且顯示在指定位置


function renderRegionList(location) {
    //console.log(location)
    let catchData = [];
    if (location === "") {
        catchData = data;
        render(data);
        //console.log(catchData)
    }
    else {
        catchData = data.filter((item) => location == item.area)//簡化了function,{}和return寫法
        //console.log(catchData)
        render(catchData)
    }
    searchNum.textContent = `本次搜尋共${catchData.length}筆資料`

}

//4.validate 
const formValidate = document.querySelector("#myForm")
const inputs =
    document.querySelectorAll("input[type=text],input[type=number],select[name=area],textarea")
const constraints = {
    name: {
        presence:
        {
            message: "必填欄位",
            allowEmpty: false,//查看原文件加上
        },
    },
    imgUrl: {
        presence:
        {
            message: "是必填欄位",

        },
        url: {
            schemes: ["https"],
            message: "必須是https開頭"
        }
    },
    area: {
        presence: {
            message: "是必填欄位",
            allowEmpty: false,
        },
    },
    price: {
        presence: {
            message: "是必填欄位",

        },
        numericality: {
            greaterThan: 0,
            onlyInteger: true,
            message: "必須大於 0且整數"
        }

    },
    set: {
        presence: {
            message: "是必填欄位"
        },
        numericality: {
            greaterThan: 0,
            onlyInteger: true,
            message: "必須大於 0且整數"
        }
    },
    rate: {
        presence: {
            message: "是必填欄位"
        },
        numericality: {
            greaterThanOrEqualTo: 1,
            lessThanOrEqualTo: 10,
            message: "必須符合 1-10 的區間"
        }

    },
    description: {
        presence: {
            message: "是必填欄位",
            allowEmpty: false,
        },
    },

};

inputs.forEach((inputElement) => {
    //console.log(inputElement)
    inputElement.addEventListener("change", (() => {//監聽事件若寫成click,則會在點下後直接觸發錯誤訊息，應要用change
        handleInputValidate(inputElement);
    }))
})
//4.1需要取到input name屬性和對應的位置
function handleInputValidate(inputElement) {
    const inputName = inputElement.name;
    const inputValue = inputElement.value;
    // console.log(inputName)
    // console.log(inputValue)

    //要印出錯誤訊息需要放入兩個參數
    //第一個參數
    const target = {
        [inputName]: inputValue,
    }
    //console.log(inputName)
    //console.log(target)
    // 第二個參數 驗證的規則
    const validateValue = {
        [inputName]: constraints[inputName],
    };
    //console.log(inputName)
    // 驗證通過， error 會是 undefined
    // 驗證失敗， error 會是 error message
    const error = validate(target, validateValue);
    const isError = !!error;//undefined->false,!error->true,!!error->false
    //驗證是if (undefined)=>是false(undefined 轉成布林是false)

    if (isError) {
        // 塞入錯誤訊息
        inputElement.parentNode.nextElementSibling.textContent = error[inputName];
    } else {
        // 清空錯誤訊息
        inputElement.parentNode.nextElementSibling.textContent = '';
    }
}

function getIsValidated() {
    const validateResult = validate(formValidate, constraints)
    return validateResult === undefined;
}

function renderC3() {
    //篩選資料，資料會進入到totalObj裡
    //totalObj 會變成{高雄:1,台北:1,台中:1}
    let totalObj = {};//改成陣列也可以,why?
    data.forEach(function (item, index) {
        console.log(item)
        if (totalObj[item.area] == undefined) {//該如何理解totalObj
            totalObj[item.area] = 1;
        } else {
            totalObj[item.area] += 1;
        }

    })
    //處理成c3js要的格式
    // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
    let newData = [];
    let area = Object.keys(totalObj);//取屬性
    // area output ["高雄","台北","台中"]
    area.forEach(function (item, index) {
        console.log(item)
        let ary = [];
        ary.push(item);
        //console.log(totalObj)
        ary.push(totalObj[item]);
        newData.push(ary);
        //console.log(ary)
    })
    // 將 newData 丟入 c3 產生器
    const chart = c3.generate({
        bindto: "#chart",
        data: {
            columns: newData,
            type: 'donut',
            colors: {
                "高雄": "#E68618",
                "台中": "#5151D3",
                "台北": "#26BFC7"
            }
        },
        donut: {
            title: "地區"
        }
    });
}

