(function() {



    function MakeAjaxCall() {

        xhrObject = new XMLHttpRequest();
        xhrObject.open("GET", "http://localhost:3000/productsInCart", false);
        xhrObject.send(null);
        jsonObject = JSON.parse(xhrObject.responseText);
    }

    function createElement(element) {
        return document.createElement(element);
    }

    function appendChild(parent, element) {
        return parent.appendChild(element);
    }




    function render() {


        var j,
            i,
            xhr,
            mainDiv,
            con,
            imgDiv,
            imgs,
            dv,
            sn,
            cl,
            size,
            bTag,
            qty,
            funcSection,
            listItems,
            hline,
            fullList,
            strUser,
            TotalSizes,
            itemSelected,
            editButton,
            model

        for (j = 0; j < jsonObject.length; j++) {


            mainDiv = createElement("div");
            mainDiv.className += "item1-title-value";


            con = createElement("div");
            con.className += "container";



            imgDiv = createElement("div");
            imgDiv.className += "item-image-division";
            appendChild(con, imgDiv);

            imgs = createElement("img");
            imgs.setAttribute('src', jsonObject[j].p_img);


            imgs.className += "item-image-desktop";
            appendChild(imgDiv, imgs);
            appendChild(con, imgDiv);

            dv = createElement("div");
            dv.className += "item-name-desktop";
            dv.append(document.createTextNode(jsonObject[j].p_variation + " " + jsonObject[j].p_name));
            appendChild(con, dv);

            sn = createElement("span");
            sn.className += "item-style";
            sn.append(document.createTextNode("Style#: " + jsonObject[j].p_style));
            appendChild(dv, sn);
            appendChild(con, dv);

            cl = createElement("span");
            cl.className += "item-color";
            cl.append(document.createTextNode("Color: " + jsonObject[j].p_selected_color.name));
            appendChild(dv, cl);
            appendChild(con, dv);

            size = createElement("span");
            size.className += "item-size";

            size.append(document.createTextNode("Size: " + jsonObject[j].p_selected_size.name));
            appendChild(dv, size);
            appendChild(con, dv);

            // ITEM INFO SECTION APPENDED
            appendChild(mainDiv, con);

            // br TAG
            bTag = createElement("br");
            appendChild(dv, bTag);
            appendChild(con, dv);

            qty = createElement("span");
            qty.className += "quantity";
            qty.append(document.createTextNode("QTY: " + jsonObject[j].p_quantity));
            appendChild(dv, qty);
            appendChild(con, dv);



            funcSection = createElement("div");
            funcSection.className += "functionalities-section-desktop";
            appendChild(mainDiv, funcSection);

            listItems = createElement("ul");
            appendChild(funcSection, listItems);

            for (i = 0; i < 3; i++) {
                var list = createElement("li");
                var anc = createElement("a");
                anc.setAttribute('href', "#");

                if (i == 0) {
                    anc.textContent = "EDIT";
                    anc.className = "edit-Button";
                } else if (i == 1) {
                    anc.textContent = "REMOVE";
                } else
                    anc.textContent = "SAVE FOR LATER";


                appendChild(list, anc);
                appendChild(listItems, list);
                appendChild(funcSection, listItems);
                appendChild(mainDiv, funcSection);

            }

            hline = createElement("hr");
            hline.className += "items-separating-line";
            appendChild(mainDiv, hline);

            fullList = document.getElementById("full-list");
            fullList.append(mainDiv);


        }

    }

    MakeAjaxCall();
    render();



    ///////////////////////////////////////// MODAL JS //////////////////////////////////////////

    for (i = 0; i < 3; i++) {

        editButton = document.getElementsByClassName("edit-Button")[i];
        model = document.getElementById("model-pop");
        editButton.addEventListener("click", function() {

            model.style.display = "inline";

        });
    }



    // CLOSE BUTTON
    var cButton = document.getElementsByClassName("close-me")[0];
    cButton.addEventListener("click", function() {
        model.style.display = "none";

    })


    // MODAL EDIT BUTTON FUNCTIONALITY
    var modalEdit = document.getElementsByClassName("edit-button-modal")[0];
    modalEdit.addEventListener("click", function() {

        // SELECTED NEW SIZE
        itemSelected = document.getElementById("new-size-value");
        SizeNewVal = itemSelected.options[itemSelected.selectedIndex].value;

        // SELECTED NEW QUANTITY
        qtySelected = document.getElementById("new-qty-value");
        QtyNewVal = qtySelected.options[qtySelected.selectedIndex].value;


        // EDIT LOGIC
        for (i = 0; i < jsonObject.length; i++) {

            TotalSizes = jsonObject[i].p_available_options.sizes.length;


            for (j = 0; j < TotalSizes; j++) {


                if ((jsonObject[j].p_available_options.sizes[j].code) == SizeNewVal.toLowerCase()) {
                    console.log(jsonObject[j].p_available_options.sizes[j].code);
                    jsonObject[j].p_selected_size.code = SizeNewVal.toLowerCase();
                    jsonObject[j].p_quantity = QtyNewVal;
                    break;

                }




            }

        }

        render();
        model.style.display = "none";
    })



    // PRICES AND DISCOUT LOGIC
    var totalPrice = document.getElementById("total-price");
    var price = 0;
    for (i = 0; i < jsonObject.length; i++) {
        price = price + jsonObject[i].p_quantity * jsonObject[i].p_price;
    }
    console.log(price);
    totalPrice.innerHTML = "$" + price;

    var shippingCharges = document.getElementById("shipping-charges");
    var fixedShippingCharge;
    if (price > 30) {
        fixedShippingCharge = 0;
        shippingCharges.innerHTML = "FREE";
    } else {
        fixedShippingCharge = 5;
        shippingCharges.innerHTML = "$" + fixedShippingCharge;
    }
    var promotionCode = document.getElementById("promotion-code-value");
    if (jsonObject.length == 3) {
        var promotionCodeValue = price / 20;
    } else if (jsonObject.length > 3 && jsonObject.length < 7) {
        var promotionCodeValue = price / 10;
    } else {
        var promotionCodeValue = price / 4;
    }

    promotionCode.innerHTML = "$" + promotionCodeValue;
    var finalPrice = document.getElementById("final-price");
    var fullPrice = price + fixedShippingCharge - promotionCodeValue;
    finalPrice.innerHTML = "$" + fullPrice;





})();