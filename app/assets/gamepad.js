// Creem les variables globals que necessitarem
var caliblx = 0;
var calibly = 0;
var calibrx = 0;
var calibry = 0;
var lx = 0;
var ly = 0;
var rx = 0;
var ry = 0;

//Escoltem per quan es detecti el gamepad o mando
window.addEventListener('gamepadconnected', (event) => {
    console.log("Gamepads: " + navigator.getGamepads());
    const update = () => {
        // Agafem tota la informació actual del mando
        var gp = navigator.getGamepads()[0];

        // Repartim la informació en variables per a que sigui més comode de treballar
        var b_x = gp.buttons[0];
        var b_r = gp.buttons[1];
        var b_c = gp.buttons[2];
        var b_t = gp.buttons[3];
        var l1 = gp.buttons[4];
        var l2 = gp.buttons[6];
        var r1 = gp.buttons[5];
        var r2 = gp.buttons[7];/*
        var up = gp.buttons[12];
        var down = gp.buttons[13];
        var left = gp.buttons[14];
        var right = gp.buttons[15];*/
        var start = gp.buttons[8];
        var select = gp.buttons[9];

        var aLX = (gp.axes[0] - caliblx).toFixed(1)
        var aLY = (gp.axes[1] - calibly).toFixed(1)

        var aRX = gp.axes[2].toFixed(2) - calibrx
        var aRY = gp.axes[3].toFixed(2) - calibry
        rx += +aRX;
        // Mirem si els buttons han sigut activats
        //Right buttons
        if (b_x.pressed) { }
        if (b_c.pressed) { }
        if (b_t.pressed) { }
        if (b_r.pressed) { }
        //Els de adal
        if (r1.pressed) {
            // Sumem el valor a la global sempre assegurant que no sobrepassa els limits
            ly += +aLY * -5;
            if (ly < 0) {
                ly = 0
            }
            if (ly > 100) {
                ly = 100
            }
            aLX = 0
        }
        if (r2.pressed) {
            // Fem que no tingiu cap valor
            aRY = 0;
        }
        if (l1.pressed) {
            // Sumem el valor a la global sempre assegurant que no sobrepassa els limits
            ly += +aLY * -5;
            if (ly < 0) {
                ly = 0
            }
            if (ly > 100) {
                ly = 100
            }
        }
        if (l2.pressed) {
            // Fem que no tingiu cap valor
            aRX = 0;
        }
        //Left buttons
        /*
                if (up.pressed) { }
                if (down.pressed) { }
                if (left.pressed) { }
                if (right.pressed) { }*/
        //Center buttons
        if (b_t.pressed) {
            // Fem una petita calibració tenint en compte l'error que tenen
            console.log("Calibrating");
            caliblx += +aLX;
            calibly += +aLY;
            calibrx += +aRX;
            calibry += +aRY;
        }
        if (select.pressed) { }

        if (aRY > 0) {
            // Ens assegurem que no va al reves
            aRX = aRX * -1
        }

        //Mostrem els nous valors en pantalla
        document.getElementById("rightmotor").style.height = ly + "%";
        document.getElementById("leftmotor").style.height = ly + "%";

        document.getElementById("waybar").style.width = Math.abs(aLX) * 50 + "%";
        document.getElementById("waybar").style.marginLeft = (aLX) * 50 + "%";
        /*
                document.getElementById("brujula").style.transform = "Rotate(" + aRX * 90 + "deg)";
                document.getElementById("frontspeed").style.height = Math.abs(aRY) * 50 + "%";
                document.getElementById("frontspeed").style.marginBottom = (aRY) * -0.5 * 7 + "vw";*/

        //Tornem a l'inici

        requestAnimationFrame(update);
    };
    update();
});