/*
* Mainly these are just helper functions.
*/
var districts ={
    1:"Colby", 2:"Concordia", 3:"Manhattan", 4:"Lane", 5:"Hays", 6:"Ottawa", 7:"Garden City", 8:"Pratt", 9:"Parsons"
}

var asic ={
    1:["USC00141699", 141699], 2:["USW00013984",13984], 3:["USC00144972",144972], 4:["USC00148235",148235], 5:["USC00143527", 143527], 6:["USC00146128",146128], 7:["USW00023064",23064], 8:["USC00146549",146549], 9:["USC00146242",146242]
}

export function getDistrictName(id) {
    return districts[id];
}

export function getAsic(id) {
    return asic[id];
}
 