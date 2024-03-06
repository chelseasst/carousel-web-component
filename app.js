import { html, render } from '../node_modules/lit-html/lit-html.js';

const template = (context, displayedImgIndex) => {
    return html`
            <style>
            .carousel-container {
                max-width: 60rem;
                position: relative;
                margin: 0 auto;
            }

            .carousel-controls {
                text-align: center;
            }

            .carousel-slide {
                display: none;
            }

            .carousel-slide>img {
                width: 100%;
            }

            /* Next & previous buttons */
            .prev,
            .next {
                cursor: pointer;
                position: absolute;
                top: 50%;
                width: auto;
                margin-top: -22px;
                padding: 16px;
                color: white;
                font-weight: bold;
                font-size: 18px;
                transition: 0.6s ease;
                border-radius: 0 3px 3px 0;
                user-select: none;
            }

            /* Position the "next button" to the right */
            .next {
                right: 0;
                border-radius: 3px 0 0 3px;
            }

            /* On hover, add a black background color with a little bit see-through */
            .prev:hover,
            .next:hover {
                background-color: rgba(0, 0, 0, 0.8);
            }

            /* Caption text */
            .text {
                color: #f2f2f2;
                font-size: 15px;
                padding: 8px 12px;
                position: absolute;
                bottom: 8px;
                width: 100%;
                text-align: center;
            }

            /* Number text (1/3 etc) */
            .numbertext {
                color: #f2f2f2;
                font-size: 12px;
                padding: 8px 12px;
                position: absolute;
                top: 0;
            }

            /* The dots/bullets/indicators */
            .carousel-controls>.dot {
                cursor: pointer;
                height: 15px;
                width: 15px;
                margin: 0 2px;
                background-color: #bbb;
                border-radius: 50%;
                display: inline-block;
                transition: background-color 0.6s ease;
            }

            .active,
            .dot:hover {
               
                background-color: #717171;
            }
            /* Fading animation */
            .fade {
                -webkit-animation-name: fade;
                -webkit-animation-duration: 1.5s;
                animation-name: fade;
                animation-duration: 1.5s;
            }

            @-webkit-keyframes fade {
                from {
                    opacity: .4
                }

                to {
                    opacity: 1
                }
            }
            
            @keyframes fade {
                from {
                    opacity: .4
                }

                to {
                    opacity: 1
                }
            }
        </style>

    <div class="carousel-container">
        ${context.images.map((image, index) => imageTemplate(image, context.captions[index], index, context.images.length, displayedImgIndex))}

            <a class="prev">&#10094;</a>
            <a class="next">&#10095;</a>
    </div>
    <div class="carousel-controls">
        ${context.images.map((img, index) => dotTemplate(displayedImgIndex, index))}
    </div>
    `
}

const imageTemplate = (image, text, imgIndex, imagesCount, displayedImgIndex) => {
    return html`
            <article class="carousel-slide ${imgIndex === displayedImgIndex ? 'fade' : ''}" style="display: ${imgIndex === displayedImgIndex ? 'block' : 'none'}">
                <p class="numbertext">${imgIndex + 1} / ${imagesCount}</p>
                <img src="${image}" alt="">
                <p class="caption text">${text}</p>
            </article>
    `
}

const dotTemplate = (displayedImgIndex, index) => {
    return html`<span class="dot ${displayedImgIndex === index ? 'active' : ''}"></span>`
}


class Carousel extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.context = {
            images: JSON.parse(this.getAttribute('images')), //array
            captions: JSON.parse(this.getAttribute('captions')), //array
        }
        this.imageIndex = 0;
    }
    update() {
        render(template(this.context, this.imageIndex), this.root)
    }
    connectedCallback() {
        this.update();
        this.addEventListeners();
    }
    scrollPrev() {
        this.imageIndex = (this.imageIndex - 1 + this.context.images.length) % this.context.images.length;
        this.update();
    }
    scrollNext() {
        this.imageIndex = (this.imageIndex + 1) % this.context.images.length;
        this.update();
    }
    selectImage(index) {
        this.imageIndex = index;
        this.update();
    }
    addEventListeners() {
        //both are the shadowDom reference 
        this.root.querySelector('.prev').addEventListener('click', this.scrollPrev.bind(this))
        this.shadowRoot.querySelector('.next').addEventListener('click', this.scrollNext.bind(this))

        const dots = this.root.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.selectImage(index))
        });
    }
}
window.customElements.define('carousel-component', Carousel)