/**
 *Julia Hotaling
 *Project 3 - 5 - 4/20/18
 * Create a class to house the hue grid and it's chromosome 
 **/
"use strict"

class HueGrid {
    constructor(chrom, x, y, cWidth, cHeight) {
        this.hueVal; //global 2D array of hue values
        //this.cSize = 10; //cellsize for each square in the grid
        this.maxDev = 10; //maximum deviation for hue values in the grid
        this.chrom = chrom;
        this.strokeOn;

        //origin points
        this.hgX = x;
        this.hgY = y;
        //width and height for each individual hue grid
        this.hgWidth = cWidth;
        this.hgHeight = cHeight;

        this.reset(chrom); //pass the chrom variable into the reset function
    }


    //resets all the huegrids
    reset(chrom) {

        this.chrom = chrom;

        this.cSize = (this.chrom & 15) + 3; //sets cellsize
        background(100);
        this.initMeth = (this.chrom >>> 4) & 3; //shifts to the right 
        this.initColor = ((this.chrom >>> 6) & 3) + Math.floor(random(120, 360)); //color range is either limited or goes fully to 360
        this.initStroke = (this.chrom >>> 7) & 1; //either stroke or no stroke

        this.strokeOn = this.initStroke == 1; //stroke is either true at 1 or false at 0

        //calculate row and column lengths using the canvas dimensions and cellsize
        let rowLeng = Math.floor(this.hgWidth / this.cSize);
        let colLeng = Math.floor(this.hgHeight / this.cSize);

        this.hueVal = [];

        let scale = 360 / (rowLeng + colLeng); //scale to multiply by for the striped pattern

        for (let i = 0; i < rowLeng; i++) {
            this.hueVal[i] = [];
            for (let j = 0; j < colLeng; j++) {

                switch (this.initMeth) { //selects from  a hyperbolic, striped, random, or sine pattern
                    case 0:
                        this.hueVal[i][j] = (i * j) % this.initColor; //formula for a hyperbole 
                        break;
                    case 1:
                        this.hueVal[i][j] = ((i + j) * scale) % this.initColor; //normalize the hue value to save graphics card stress, it would have to normalize the hue value but we can just do it here
                        break;
                    case 2:
                        this.hueVal[i][j] = random(this.initColor); //random scattering of 'pixels'
                        break;
                    case 3:
                        this.hueVal[i][j] = ((i / sin(j + 0.0001)) * scale) % this.initColor; //weird streaky sine pattern 
                        break;
                }
            }
        }
    }

    //codes to display the huegrids
    display() {

        push();
        translate(this.hgX, this.hgY); //set the origin point to the new starting location

        this.maxDev = mdSlider.value(); //sets the maximum deviation to the slider's value, which returns the number and controls how fast the 'pixels' move 

        if (this.strokeOn) { //sets stroke based on switch statement
            stroke(100);
        } else {
            noStroke();
        }

        for (let i = 0; i < this.hueVal.length; i++) {
            for (let j = 0; j < this.hueVal[i].length; j++) {
                this.hueVal[i][j] = this.hueVal[i][j] + random(-this.maxDev, this.maxDev);

                //keeps the hue value within the 0-360 range
                if (this.hueVal[i][j] > 360) {
                    this.hueVal[i][j] -= 350;
                } else if (this.hueVal[i][j] < 0) {
                    this.hueVal[i][j] += 360;
                } else {
                    //draws the individual cells within the hue grid 
                    fill(this.hueVal[i][j], satVal, 100);
                    rect(i * this.cSize, j * this.cSize, this.cSize, this.cSize);
                }
            }
        }
        pop();
    }

    //detects when the mouse is over any of the huegrids and returns true or false
    mouseOver() {
        if (mouseX > this.hgX && mouseX < this.hgWidth + this.hgX && mouseY > this.hgY && mouseY < this.hgHeight + this.hgY) {
            return true;
        } else {
            return false;
        }
    }
}
