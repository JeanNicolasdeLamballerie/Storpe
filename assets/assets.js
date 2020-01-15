module.exports = function (odd, win) {
    odd = (Math.round(parseFloat(odd)*10))/10
    console.log(odd)
    if (win){
        if (odd < 1.10) {
            return (odd-1)*100
        }
        else {
            return (odd * 10)
        }
    }
    else{
        if (odd < 1.10) {
            return -15
        }
        else if (1.30 > odd) {
            return - 11
        }
        else if (1.50 > odd) {
            return - 10
        }
        else if (1.60 > odd) {
            return - 9
        }
        else if (1.80 > odd) {
            return - 8
        }else if (2 > odd) {
            return - 7
        }
        else if (2.30 > odd) {
            return - 7
        }
        else if (2.50 > odd) {
            return - 6
        }
        else if (odd > 2.6) {
            return - 5
        }
    }
}