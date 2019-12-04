




const createSalvoes = function (parent, isStatic){

    let salvoes = document.createElement('DIV')
    let gripSalvo = document.createElement('DIV')
    let content = document.createElement('DIV')

    salvoes.classList.add('grid-item')
    salvoes.dataset.length = length
    
    if(window.innerWidth >= 768){
        salvoes.style.width = `${length * 45}px`
        salvoes.style.height= '45px'
    }else if(window.innerWidth >= 576){
        salvo.style.width = `${length * 35}px` 
        salvo.style.height = '35px'
    }else{
        salvo.style.width = `${length * 30}px`
        salvo.style.height = '30px'
    }
    window.addEventListener('resize', () => {
        if(window.innerWidth >= 768){
            salvo.style.width = `${length * 45}px` 
            salvo.style.height = '45px'
        }else if(window.innerWidth >= 576){
            salvo.style.width = `${length * 35}px` 
            salvo.style.height = '35px'
        }else{
            salvo.style.width = `${length * 30}px` 
            salvo.style.height = '30px'
        }
        if(!isStatic){
            gripSalvo.classList.add('gripSalvo')
            gripSalvo.draggable = 'true'
            gripSalvo.addEventListener('dragstart', dragSalvo)
            salvo.addEventListener('touchmove', touchSalvo)
            salvo.addEventListener('touchend', touchSalvoEnd)
            salvo.appendChild(gripSalvo)
        }
        content.classList.add('grid-item-content')
        salvo.appendChild(content)

        parent.appendChild(salvo)

        if(isStatic){
            checkBusyCells(salvo,parent)

        function dragSalvo(ev){
                ev.dataTransfer.setData("salvo", ev.target.parentNode.id)
        
            }
            function touchSalvo(ev){
                // make the element draggable by giving it an absolute position and modifying the x and y coordinates
                salvo.classList.add("absolute");
                
                var touch = ev.targetTouches[0];
                // Place element where the finger is
                salvo.style.left = touch.pageX - 25 + 'px';
                salvo.style.top = touch.pageY - 25 + 'px';
                event.preventDefault();
            }
            function touchSalvoEnd(ev){
                // hide the draggable element, or the elementFromPoint won't find what's underneath
                salvo.style.left = '-1000px';
                salvo.style.top = '-1000px';
                // find the element on the last draggable position
                var endTarget = document.elementFromPoint(
                    event.changedTouches[0].pageX,
                    event.changedTouches[0].pageY
                )};


                // Shoots at the target player on the grid.
            // Returns {int} Constants.TYPE: What the shot uncovered
            function salvo (x, y, targetPlayer) {
                var targetGrid;
                var targetShips;
                if (targetPlayer === gp1) {
                    targetGrid = this.gp1Grid;
                    targetShips = this.gp1Ships;
                } else if (targetPlayer === gp2) {
                    targetGrid = this.gp2Grid;
                    targetShips = this.gp2Ships;
                } else {
                    // Should never be called
                    console.log("There was an error trying to find the correct player to target");
                }

                if (targetGrid.isDamagedShip(x, y)) {
                    return null;
                } else if (targetGrid.isMiss(x, y)) {
                    return null;
                } else if (targetGrid.isUndamagedShip(x, y)) {
                    // update the board/grid
                    targetGrid.updateCell(x, y, 'hit', targetPlayer);
                    // IMPORTANT: This function needs to be called _after_ updating the cell to a 'hit',
                    // because it overrides the CSS class to 'sunk' if we find that the ship was sunk
                    targetShips.findShipByCoords(x, y).incrementDamage(); // increase the damage
                    this.turn();
                    return  gp1.TYPE_HIT;
                } else {
                    targetGrid.updateCell(x, y, 'miss', targetPlayer);
                    this.turn();
                    return gp2.TYPE_MISS;
                }
                };
                function salvoListener(e) {
                    var self = e.target.self;
                    // Extract coordinates from event listener
                    var x = parseInt(e.target.getAttribute('data-x'), 10);
                    var y = parseInt(e.target.getAttribute('data-y'), 10);
                    var result = null;
                    if (self.readyToPlay) {
                        result = self.salvo(x, y, gp2);
                
                       
                    }
                
                    if (result !== null && !Game.gameOver) {
                        Game.stats.incrementShots();
                        if (result === CONST.TYPE_HIT) {
                            Game.stats.hitShot();
                        }
                        // The AI shoots iff the player clicks on a cell that he/she hasn't
                        // already clicked on yet
                        self.robot.shoot();
                    } else {
                        Game.gameOver = false;
                    }
                }
                }
                })
    }
    
            //DEVUELVE LAS CELDAS DONDE SE APUNTO PARA DISPARAR
function getSalvoesCells(){
    let celdas= document.querySelectorAll('.aimedSalvo')
    let ubicaciones=[]

    celdas.forEach(celda => ubicaciones.push(`${celda.dataset.y}${celda.dataset.x}`))

    return ubicaciones;
}
    