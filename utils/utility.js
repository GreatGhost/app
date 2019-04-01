const config = require('./config')

export function throttle(fn, period) {
    var bingo = true, timer = -1, timer1 = -1, fun = fn;
    return function() {
        fun = fn;
        if (bingo) {            
            fn();

            bingo = false;
            clearTimeout(timer);
            clearTimeout(timer1);
            fun = null;
            
            timer = setTimeout(function() {
                bingo = true;
                if (fun) { //在禁止的过程中还有调用进来                  
                    timer1 = setTimeout(function() {                         
                        fun();
                        fun = null;
                        clearTimeout(timer1)
                    }, period);
                }
            }, period);
        }
    }
}

export const logger = function(){
    if (config.env.showLog) {        
        return console;
    }
    return {log: () => {}, error: () => {}}
}()