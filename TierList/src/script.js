/*
######################################################################
##################### Declare/Assing globals #########################
######################################################################
*/ 
//declare
let maincon,iname,itemurl,tierselect,rname,colorfield,colorsel,namefield,namesel,pxToEmRatio,cropWH,zoffset,disablePopups,canvOverlay;
let id=0;
let ratio=[]
let aspect={"w":0,"h":0};
let scale={"w":0,"h":0};
let scaleCoefficent={"x":0,"y":0}
let badge=false;

// assign
window.onload=()=>{
    disablePopups=document.getElementById("disablePopups")
    mainformcon=document.getElementsByClassName("mainFormCon")[0];
    maincon=document.getElementById("mainCon");
    iname=document.getElementById("IName");
    itemurl=document.getElementById("itemURL");
    tierselect=document.getElementById("tierSelect");
    rname=document.getElementById("RName");
    colorfield=document.getElementById("colorField");
    colorsel=document.getElementById("colorSel");
    namefield=document.getElementById("nameSelect");
    namesel=document.getElementById("nameColorSel");
    imgCrop=document.getElementById("cropImgImg");
    divCrop=document.getElementById("cropImgDiv");
    sliders=document.getElementsByClassName("cropSlider");
    mainCrop=document.getElementById("cropMain");
    canvOverlay=document.getElementById("canvOverlay");
    ITC=document.getElementById("imgToCrop");
    xslider=sliders[0];
    yslider=sliders[1];
    zslider=sliders[2];
    if(localStorage.getItem("checked")!=null){
        if(localStorage.getItem("checked")=="true"){
            disablePopups.checked=true;
        }
    }
}

/*
######################################################################
########################## Tier creation #############################
######################################################################
*/ 
function colorChange(x){
    if(x=="Field"){
        colorsel.value=colorfield.value;
    }
    if(x=="Sel"){
        colorfield.value=colorsel.value;
    }
    if(x=="NameSel"){
        namesel.value=namefield.value;
    }
}
function createItem(){
    itemHtml=`
    <div class="objectFrame" onclick="clearItem(this)" style="overflow:hidden;">
        <div class="objectImage">
            <img src="${imgCrop.src}" style="width:${18*scaleCoefficent.x}em; margin-left:-${Number(xslider.value)*scaleCoefficent.x}em; margin-top:-${Number(yslider.value)*scaleCoefficent.y}em;" crossorigin="anonymous">
        </div>
        <br><div class="objectPlate">${iname.value}</div>
    </div>`;
    if(!badge){
        itemHtml=`
        <div class="objectFrame2" onclick="clearItem(this)" style="overflow:hidden;">
            <div class="objectImage2">
                <img src="${imgCrop.src}" style="width:${18*scaleCoefficent.x}em; margin-left:-${Number(xslider.value)*scaleCoefficent.x}em; margin-top:-${Number(yslider.value)*scaleCoefficent.y}em;" crossorigin="anonymous">
            </div>
        </div>`;
    }
    document.getElementById(tierSelect.value+"Con").innerHTML+=itemHtml;
}
function createTier(){
    tierselect.innerHTML+=`\n<option id="${id}option" value="${id}">${rname.value}</option>`;
    maincon.innerHTML+=`
    <div class="container board" id="${id}Con">
        <div class="mark" onclick="clearTier(this,${id})" style="background-color: ${colorfield.value}; color: ${namefield.value};" id="${id}">
            <span class="markfont">${rname.value}</span>
        </div>
    </div>`;
    id++;
}
function clearTier(object,id){
    maincon.removeChild(object.parentNode);
    tierselect.removeChild(document.getElementById(id+"option"));
}
function clearItem(object) {
    object.parentNode.removeChild(object);
}
async function toitemurl(object){
    itemURL.value=await toBase64(object.files[0]);
}
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
/*
######################################################################
########################## Crop functions ############################
######################################################################
*/ 
function cut(){
    xPs=Number(xslider.value)+Number(scale.w);
    yPs=Number(yslider.value)+Number(scale.h);
    imgCrop.style.clip=`rect(${yslider.value}em ${xPs}em ${yPs}em ${xslider.value}em)`;
}
function resize(){
    
    scale.w=aspect.w*Number(zslider.value);
    scale.h=aspect.h*Number(zslider.value);
    xslider.max=18-scale.w;
    yslider.max=(imgCrop.height*pxToEmRatio)-scale.h;
    scaleCoefficent={"x":((aspect.w*6)/scale.w),"y":((aspect.h*6)/scale.h)}
    cut();
}
function initiateCrop(img){
    if(iname.value==""){badge=false;}else{badge=true;}
    imgCrop.src=img;
    divCrop.style.backgroundImage=`url(${img})`;
    imgCrop.onload=()=>{
        aspect={"w":1.15,"h":1.15}
        zoffset=0.86;
        if (badge){
            aspect={"w":1,"h":0.9}
            zoffset=1;
        }
        scale.w=aspect.w*Number(zslider.value);
        scale.h=aspect.h*Number(zslider.value);
        mainCrop.style.display="inline-block";
        setTimeout(()=>{
            imgHeight=imgCrop.height;
            imgWidth=imgCrop.width;
            pxToEmRatio=18/imgWidth;
            xslider.max=18-scale.w;
            yslider.max=(imgHeight*pxToEmRatio)-scale.h;
            divCrop.style.width=`${imgWidth*pxToEmRatio}em`;
            divCrop.style.height=`${imgHeight*pxToEmRatio}em`;
            zslider.max=(imgHeight*pxToEmRatio)*zoffset;
            if(imgHeight>imgWidth){
                zslider.max=(imgWidth*pxToEmRatio)*zoffset;
            }
            if(Number(zslider.value)>Number(zslider.max)){zslider.value=Number(zslider.max)}
            resize();
        },20);
    }
}
function cancelCrop(){
    imgCrop.src="";
    divCrop.style.backgroundImage="";
    mainCrop.style.display="none";
}
function endCrop(){
    createItem();
    mainCrop.style.display="none";
}

/*
######################################################################
#################### Save/Load/Export/clear ##########################
######################################################################
*/ 
function updateChecked(){
    localStorage.setItem("checked",disablePopups.checked);
}
function loadDefault(){
    if (id>0&&disablePopups.checked!=true){
        i=confirm("Warning this will delete all tiers currently on screen.");
    } else {
        i=true;
    }
    if (!i) {return;}
    x=`
    <div class="container board" id="0Con">
        <div class="mark" onclick="clearTier(this,0)" style="background-color: #ff0000; color: #000000;" id="0">
            <span class="markfont">S</span>
        </div>
    </div>
    <div class="container board" id="1Con">
        <div class="mark" onclick="clearTier(this,1)" style="background-color: #ff8400; color: #000000;" id="1">
            <span class="markfont">A</span>
        </div>
    </div>
    <div class="container board" id="2Con">
        <div class="mark" onclick="clearTier(this,2)" style="background-color: #ffff00; color: #000000;" id="2">
            <span class="markfont">B</span>
        </div>
    </div>
    <div class="container board" id="3Con">
        <div class="mark" onclick="clearTier(this,3)" style="background-color: #00ff00; color: #000000;" id="3">
            <span class="markfont">C</span>
        </div>
    </div>
    <div class="container board" id="4Con">
        <div class="mark" onclick="clearTier(this,4)" style="background-color: #0096ff; color: #000000;" id="4">
            <span class="markfont">D</span>
        </div>
    </div>
    <div class="container board" id="5Con">
        <div class="mark" onclick="clearTier(this,5)" style="background-color: #0019ff; color: #000000;" id="5">
            <span class="markfont">E</span>
        </div>
    </div>
    <div class="container board" id="6Con">
        <div class="mark" onclick="clearTier(this,6)" style="background-color: #0000aa; color: #000000;" id="6">
            <span class="markfont">F</span>
        </div>
    </div>`;
    z=`
    <option id="0option" value="0">S</option>
    <option id="1option" value="1">A</option>
    <option id="2option" value="2">B</option>
    <option id="3option" value="3">C</option>
    <option id="4option" value="4">D</option>
    <option id="5option" value="5">E</option>
    <option id="6option" value="6">F</option>`;
    load(x,z,7);
}
function clearTiers(){
    if (id>0&&disablePopups.checked!=true){
        i=confirm("Warning this will clear all data on screen.");
    } else {
        i=true;
    }
    if (!i) {return;}
    load("","",0);
}
function loadData(){
    if (id>0&&disablePopups.checked!=true){
        i=confirm("Warning loading this data will clear all tiers on screen.");
    } else {
        i=true;
    }
    if (!i) {return;}
    tiers=JSON.parse(localStorage.getItem("tiers"));
    load("",localStorage.getItem("dropdown"),Number(localStorage.getItem("id")));
    for(i=0;i<tiers.length;i++){
        board=tiers[i].board;
        items=tiers[i].items;
        loadTier(board.id,board.name,board.color.bg,board.color.fg);
        for(z=0;z<items.length;z++){
            item=items[z]
            loadItem(item.loadBadge,item.img,item.width,item.margin.left,item.margin.top,item.badgeText,item.id);
        }
    }
}
function exportImg(){
    canvas=initCanvas(indexTiers())
    canvOverlay.style.display="block";
    canvOverlay.innerHTML="<button onclick='canvOverlay.style.display=\"none\";'>X</button><br>"
    x=canvOverlay.appendChild(canvas)
    x.style.width="70vw";
}
function save(){
    if (localStorage.getItem("tiers")!=null&&localStorage.getItem("tiers")!=""&&disablePopups.checked!=true){
        i=confirm("Warning this will overwrite your previous saved tiers.");
    } else {
        i=true;
    }
    if (!i) {return;}
    tiers=indexTiers();
    localStorage.setItem("tiers",JSON.stringify(tiers));
    localStorage.setItem("dropdown",tierselect.innerHTML);
    localStorage.setItem("id",id);
}
function indexTiers(){
    tiers=[]
    indexedTiers=document.getElementsByClassName("board");
    for (i=0;i<indexedTiers.length;i++){
        tiers.push({});
        for (z=0;z<indexedTiers[i].children.length;z++){
            if(z==0){
                obj={
                    "id":indexedTiers[i].children[z].id,
                    "name":indexedTiers[i].children[z].firstElementChild.innerText,
                    "color":{
                        "bg":indexedTiers[i].children[z].style.backgroundColor,
                        "fg":indexedTiers[i].children[z].style.color
                    }
                };
                tiers[i]["board"]=obj;
                tiers[i]["items"]=[];
            }else{
                isbadge=indexedTiers[i].children[z].getElementsByClassName("objectPlate");
                if(isbadge.length>0){badgeload=true;isbadge=isbadge[0].innerText}else{badgeload=false;isbadge=""}
                obj={
                    "id":indexedTiers[i].children[0].id,
                    "margin":{
                        "top":indexedTiers[i].children[z].firstElementChild.firstElementChild.style.marginTop,
                        "left":indexedTiers[i].children[z].firstElementChild.firstElementChild.style.marginLeft
                    },
                    "badgeText":isbadge,
                    "width":indexedTiers[i].children[z].firstElementChild.firstElementChild.style.width,
                    "loadBadge":badgeload,
                    "img":indexedTiers[i].children[z].firstElementChild.firstElementChild.src
            };
                tiers[i]["items"].push(obj);
            }
        }
    };
    return tiers;
}
function loadItem(loadBadge,imgLoad,width,leftmargin,topmargin,badgeTxt,target){
    itemHtml=`
    <div class="objectFrame" onclick="clearItem(this)" style="overflow:hidden;">
        <div class="objectImage">
            <img src="${imgLoad}" style="width:${width}; margin-left:-${leftmargin}; margin-top:-${topmargin};" crossorigin="anonymous">
        </div>
        <br><div class="objectPlate">${badgeTxt}</div>
    </div>`;
    if(!loadBadge){
        itemHtml=`
        <div class="objectFrame2" onclick="clearItem(this)" style="overflow:hidden;">
            <div class="objectImage2">
                <img src="${imgLoad}" style="width:${width}; margin-left:-${leftmargin}; margin-top:-${topmargin};" crossorigin="anonymous">
            </div>
        </div>`;
    }
    document.getElementById(target+"Con").innerHTML+=itemHtml;
}
function loadTier(loadId,loadName,bgCol,fgCol){
    maincon.innerHTML+=`
    <div class="container board" id="${loadId}Con">
        <div class="mark" onclick="clearTier(this,${loadId})" style="background-color: ${bgCol}; color: ${fgCol};" id="${loadId}">
            <span class="markfont">${loadName}</span>
        </div>
    </div>`;
}
function load(x,z,i){
    maincon.innerHTML=x;
    tierselect.innerHTML=z;
    id=i;
}

/*
######################################################################
###################### HTML TO CANVAS CODE ###########################
######################################################################
*/ 
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
function initCanvas(tiers){
    canvas=document.createElement("canvas");
    context=canvas.getContext("2d");
    canvas.width=window.outerWidth-16;
    canvas.height=30;
    cnvsem=canvas.width/16;
    drawCanvas(canvas,context,tiers);
    return canvas;
}
function drawCanvas(cnvs,ctx,tiers){
    canvasDraws=genDraw(tiers,cnvs);
    bgImg=new Image()
    bgImg.src="./imgs/TextBG.jpeg"
    bgImg.onload=()=>{ctx.drawImage(bgImg,0,0,cnvs.width,cnvs.height);
        for(i in canvasDraws.tierSorted){
            draw(canvasDraws.tierSorted[i],cnvs,ctx);
        }
        setTimeout(()=>{
            for(i in canvasDraws.items){
                draw(canvasDraws.items[i],cnvs,ctx);
            }
        },150)
    }
}
async function draw(e,cnvs,ctx){
    switch (e.type) {
        case "tier":
            theimg=await loadImage("./imgs/TierListBG.jpg");
            ctx.drawImage(theimg,0,0,theimg.width,e.height,12,e.posY,cnvs.width-28,e.height);
            drawHollowRect(ctx,12,e.posY,cnvs.width-28,e.height,6);
            break;
        case "img":
            pos=e.position
            if(e.hasOwnProperty("badge")){
                await drawImgRaw(ctx,"./imgs/Frame.png",pos.x1,pos.y1+pos.y2,pos.x2,16*1.7);
                await drawImg(e,ctx);
                drawText(ctx,pos.x1+(pos.x2/2),pos.y1+pos.y2+((16*1.3)),e.badge,20,"#000")
            }else{
                drawImg(e,ctx);
            }
            break;
        case "mark":
            pos=e.position
            drawRect(ctx,pos.x1,pos.y1-2,pos.x2+4,pos.y2+4,"#000");
            drawRect(ctx,pos.x1,pos.y1,pos.x2,pos.y2,e.color.bg);
            drawText(ctx,pos.x1+48,pos.y1+71,e.value,48,e.color.fg)
            break;
        default:
            break;
    }
}
function genDraw(tiers,cnvs){
    
    order={"tierSorted":[],"items":[]}
    tiers.forEach((e,i)=>{
        board=e.board
        mark={
            "type":"mark",
            "value":board.name,
            "position":{
                "x1":16,
                "y1":(16+((16*7)*i))+(i*8),
                "x2":(16*6),
                "y2":(16*7)
            },
            "color":{
                "fg":rgb2hex(board.color.fg),
                "bg":rgb2hex(board.color.bg),
            }
        }
        tier={
            "type":"tier",
            "posY":12+(((16*7)*i)+(i*8)),
        }
        order.items.push(mark);
        for(x in e.items){
            data=e.items[x];
            item={
                "type":"img",
                "value":data.img,
                "position":{
                    "x1":((16*7)+5)+(x*3)+((16*7)*x),
                    "y1":(16+((16*7)*i))+(i*8),
                    "x2":(16*7),
                    "y2":(16*7)
                },
                "imgScale":{
                    "x":Number(data.margin.left.slice(0,-2))*16,
                    "y":Number(data.margin.top.slice(0,-2))*16,
                    "width":Number(data.width.slice(0,-2))*16,
                },
            }
            if(data.loadBadge){
                item["badge"]=data.badgeText;
                item.position.x1+=7.5;
                item.position.y2=(16*5.4);
                item.position.x2=(16*6);
            }
            order.items.push(item);
        }
        tier["height"]=5+(16*7.2),
        order.tierSorted.push(tier);
        if(tier.posY+tier.height>cnvs.height){cnvs.height=(tier.posY+tier.height)+10}
    });
    return order;
}
function drawText(ctx,x,y,text,size,c="#000"){
    ctx.fillStyle=c;
    ctx.font=`${size}px serif`;
    ctx.textAlign="center";
    ctx.fillText(text,x,y);
}
function drawRect(ctx,x,y,w,h,c="#000"){
    ctx.fillStyle=c;
    ctx.fillRect(x,y,w,h);
}
function drawHollowRect(ctx,x,y,w,h,s,c="#000"){
    ctx.strokeStyle=c;
    ctx.lineWidth=s;
    ctx.strokeRect(x,y,w,h);
}   
async function drawImg(e,ctx){
    theimg= await loadImage(e.value);
    pos=e.position;
    scale=e.imgScale;
    drawRect(ctx,pos.x1,pos.y1,pos.x2,pos.y2,"#111");
    width=(pos.x2/(scale.width/theimg.width));
    height=(pos.y2/(scale.width/theimg.width));
    if(scale.x<0){
        scale.x=-scale.x;
    }
    if(scale.y<0){
        scale.y=-scale.y;
    }
    scale.x=(scale.x/(scale.width/theimg.width));
    scale.y=(scale.y/(scale.width/theimg.width));
    ctx.drawImage(theimg,scale.x,scale.y,width,height,pos.x1,pos.y1,pos.x2,pos.y2);
    drawHollowRect(ctx,pos.x1-2,pos.y1-2,pos.x2+2,pos.y2+4,4,"#000");
}
const loadImage = url => {
return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`load ${url} fail`));
    img.src = url;
});
};

async function drawImgRaw(ctx,img,x,y,w,h){
    theimg=await loadImage(img);
    ctx.drawImage(theimg,x,y,w,h);
    drawHollowRect(ctx,x-2,y-2,w+2,h+2,4,"#000");
}