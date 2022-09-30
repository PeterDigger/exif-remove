var input = document.querySelector('#erd');
input.addEventListener('change', load);
function load(){
    var fr = new FileReader();
    fr.onload = process;
    fr.readAsArrayBuffer(this.files[0]);
    document.querySelector('#orig').src = URL.createObjectURL(this.files[0]);
}
function process(){
    var dv = new DataView(this.result);
    var offset = 0, recess = 0;
    var pieces = [];
    var i = 0;
    if (dv.getUint16(offset) == 0xffd8){
        offset += 2;
        var app1 = dv.getUint16(offset);
        offset += 2;
        while (offset < dv.byteLength){
            //console.log(offset, '0x'+app1.toString(16), recess);
            if (app1 == 0xffe1){

                pieces[i] = {recess:recess,offset:offset-2};
                recess = offset + dv.getUint16(offset);
                i++;
            }
            else if (app1 == 0xffda){
                break;
            }
            offset += dv.getUint16(offset);
            var app1 = dv.getUint16(offset);
            offset += 2;
        }
        if (pieces.length > 0){
            var newPieces = [];
            pieces.forEach(function(v){
                newPieces.push(this.result.slice(v.recess, v.offset));
            }, this);
            newPieces.push(this.result.slice(recess));
            var br = new Blob(newPieces, {type: 'image/jpeg'});
            document.querySelector('#mod').src = URL.createObjectURL(br);
        }
    }       
}