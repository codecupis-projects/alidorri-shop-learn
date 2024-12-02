// ========== Slider Logic ==================

const Direction = Object.freeze({
    Horizontal: 0,
    Vertical: 1
});

class Slider{
    constructor(element, direction, loop = true, sliding = false, firstSlide = 0, autoSwitch = true, switchInterval = 4000,
        switchDuration = 500, hasDrag = false){
        Object.assign(this, {
            element, direction, loop, sliding, firstSlide, autoSwitch, switchInterval, switchDuration, hasDrag
        })

        this.activeIndex = firstSlide;
        this.autoSwitching = null;
        this.initDisplays();
    }

    initDisplays(){
        this.displays = [];
        const childCount = this.element.childElementCount;
        for (let i = 0; i < childCount; i++)
            this.displays[i] = this.element.children[i].style.display;
    }

    reset(){
        if(this.sliding)
            this.element.style.width = '200%';
        else
            this.element.style.width = '100%';

        this.setActiveSlide(this.firstSlide, true);
        if(this.autoSwitch)
            this.startAutoSwitch();
        else
            this.stopAutoSwitch();
    }

    getSlide(index){
        return this.element.children[index];
    }

    getActiveSlide(){
        return getSlide(this.activeIndex);
    }

    setActiveSlide(index, isInitial = false){
        if(index < 0 || index >= this.element.childElementCount)
            throw "index is out of children range";
        
        this.activeIndex = index;
        this.switchSlide(index, isInitial);
    }
    
    next(){
        if(this.loop)
        {
            const index = (this.activeIndex + 1) % this.element.childElementCount;
            this.setActiveSlide(index);
        }
        else if(this.activeIndex < this.element.childElementCount - 1)
            this.setActiveSlide(this.activeIndex + 1);
    }

    previous(){
        if(this.loop)
        {
            let index = (this.activeIndex - 1) % this.element.childElementCount;
            index = (index + this.element.childElementCount) % this.element.childElementCount;
            this.setActiveSlide(index);
        }
        else if(this.activeIndex > 0)
            this.setActiveSlide(this.activeIndex - 1);
    }

    switchSlide(newIndex, isInitial){
        const childCount = this.element.childElementCount;
        for (let i = 0; i < childCount; i++)
            if(i != newIndex)
            {
                this.deactivateSlide(i);
                this.hideSlide(i);
            }
        
        this.showSlide(newIndex);
        if(isInitial)
            this.activateSlideInitial(newIndex);
        else
            this.activateSlideNextFrame(newIndex);
    }

    activateSlideInitial(index){
        this.activateSlide(index, "active");
        this.activateSlide(index, "initial");
    }

    // Activate next frame to apply transitions AFTER unsetting display from none.
    activateSlideNextFrame(index){
        setTimeout(() => this.activateSlideCurrent(index), 1);
    }

    activateSlideCurrent(index){
        this.activateSlide(index, "active");
    }

    activateSlide(index, activeName){
        this.element.children[index].classList.remove(activeName);
        this.element.children[index].classList.add(activeName);
    }

    deactivateSlide(index){
        this.element.children[index].classList.remove('active-initial');
        this.element.children[index].classList.remove('active');
    }

    showSlide(index){
        this.element.children[index].style.display = this.displays[index];
    }

    hideSlide(index){
        this.element.children[index].style.display = 'none';
    }

    startAutoSwitch(){
        if(this.autoSwitching == null)
            this.autoSwitching = setInterval(() => this.next(), this.switchInterval);
    }

    stopAutoSwitch(){
        if(this.autoSwitching != null)
            clearInterval(this.autoSwitching);
        this.autoSwitching = null;
    }

    restartAutoSwitch(){
        this.stopAutoSwitch();
        this.startAutoSwitch();
    }

    nextManual(){
        this.next();
        if(this.autoSwitching)
            this.restartAutoSwitch();
    }

    previousManual(){
        this.previous();
        if(this.autoSwitching)
            this.restartAutoSwitch();
    }
}


// ========== Slider Finding ==================

sliders = initSliders();
initSlidersButtons(sliders);

function initSliders(){
    sliderElements = document.getElementsByClassName('slider');
    sliders = {};
    if(sliderElements != null)
        for(let i = 0; i < sliderElements.length; i++)
            initSlider(sliderElements[i], sliders);
    return sliders;
}

function initSlider(element, sliders){
    const slider = new Slider(element, Direction.Horizontal);
    slider.reset();

    if(element.dataset.slider !== undefined)
        sliders[element.dataset.slider] = slider;
}

function initSlidersButtons(sliders){
    buttonPairs = document.getElementsByClassName('slider-buttons');
    if(buttonPairs != null)
        for(let i = 0; i < buttonPairs.length; i++)
            initSliderButtons(buttonPairs[i], sliders);
}

function initSliderButtons(buttons, sliders)
{
    if(buttons.dataset.slider === undefined)
        return;

    sliderKey = buttons.dataset.slider;
    if(!(sliderKey in sliders))
        return;

    slider = sliders[sliderKey];
    tryRegisterSliderButton(buttons, '.slider-prev', () => slider.previousManual());
    tryRegisterSliderButton(buttons, '.slider-next', () => slider.nextManual());
}

function tryRegisterSliderButton(buttons, childQuery, switchOperation)
{
    const child = buttons.querySelector(childQuery);
    if(child === undefined)
        return;

    child.addEventListener("click", switchOperation);
}