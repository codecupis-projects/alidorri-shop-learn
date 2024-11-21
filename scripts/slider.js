// ========== Slider Logic ==================

const Direction = Object.freeze({
    Horizontal: 0,
    Vertical: 1
});

class Slider{
    constructor(element, direction, loop = true, sliding = false, firstSlide = 0, autoSwitch = true, switchInterval = 3000,
        switchDuration = 500, hasDrag = false){
        Object.assign(this, {
            element, direction, loop, sliding, firstSlide, autoSwitch, switchInterval, switchDuration, hasDrag
        })

        this.activeIndex = firstSlide;
        this.autoSwitching = null;
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
        
        this.activateSlide(newIndex, isInitial);
        this.showSlide(newIndex);
    }

    activateSlide(index, isInitial){
        let activeName = isInitial ? 'active-initial' : 'active';
        let otherName = !isInitial ? 'active-initial' : 'active';

        this.element.children[index].classList.remove(otherName);
        this.element.children[index].classList.remove(activeName);
        this.element.children[index].classList.add(activeName);
    }

    deactivateSlide(index){
        this.element.children[index].classList.remove('active-initial');
        this.element.children[index].classList.remove('active');
    }

    showSlide(index){
        this.element.children[index].style.display = 'block';
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
}


// ========== Slider Finding ==================

sliders = document.getElementsByClassName('slider');
if(sliders != null)
    for(let i = 0; i < sliders.length; i++)
        initSlider(sliders[i]);

function initSlider(element){
    const slider = new Slider(element, Direction.Horizontal);
    slider.reset();
}