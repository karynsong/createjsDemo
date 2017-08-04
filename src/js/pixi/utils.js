export const getProcess = (x, y , max, min) => {
    var move = Math.abs(x || y);
    if(move < min){
        return 0;
    }else if(move > max){
        return 1;
    }else{
        return (move - min) / (max - min)
    }
}