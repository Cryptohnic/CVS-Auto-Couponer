function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function scrollToBottom() {
    return new Promise(resolve => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    console.log('Reached the bottom');
                    resolve();
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 1.0
        });

        const bottomElement = document.createElement('div');
        document.body.appendChild(bottomElement);
        observer.observe(bottomElement);

        const interval = setInterval(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                clearInterval(interval);
            } else {
                window.scrollBy(0, 300);
            }
        }, 100);
    });
}

waitForElement('.coupon-action.button-blue.sc-send-to-card-action').then(element => {
    console.log('Page correctly accessed!');
    return scrollToBottom(); 
}).then(() => {
    console.log('Scrolling is done');
    let i = 1;
    const buttons = document.getElementsByClassName('coupon-action button-blue sc-send-to-card-action');
    for (let button of buttons) {
        button.addEventListener('click', function () {
            console.log('Coupon number ' + i + ' has been sent to card!');
        });
        button.click();
        i += 1;
    }
}).catch(error => {
    console.error('An error occurred:', error);
});