document.addEventListener('DOMContentLoaded', () => {
    const navTrigger = document.getElementById('navTrigger');
    const navWrapper = document.querySelector('.nav-wrapper');

    navTrigger.addEventListener('click', () => {
        navWrapper.classList.toggle('active');
    });

    const overlay = document.getElementById('textOverlay');
    const lines = overlay.querySelectorAll('.scramble-line');
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>/?';
    let hoverInterval = null;
    let isClicked = false;

    overlay.addEventListener('mouseenter', () => {
        if (isClicked) return;
        hoverInterval = setInterval(() => {
            lines.forEach(line => {
                line.innerText = line.innerText.split('').map(char => {
                    if (char === ' ' || char === '.') return char;
                    return characters[Math.floor(Math.random() * characters.length)];
                }).join('');
            });
        }, 50);
    });

    overlay.addEventListener('mouseleave', () => {
        if (isClicked) return;
        clearInterval(hoverInterval);
        lines.forEach(line => {
            line.innerText = line.dataset.orig;
        });
    });

    overlay.addEventListener('click', () => {
        if (isClicked) return;
        isClicked = true;
        clearInterval(hoverInterval);

        lines[0].style.transition = 'opacity 1.5s ease';
        lines[0].style.opacity = '0';
        lines[1].style.transition = 'opacity 1.5s ease';
        lines[1].style.opacity = '0';

        const targetAddress = "123 MAIN ST, PARLIN, NJ";
        let iteration = 0;
        const bottomLine = lines[2];

        const scrambleClick = setInterval(() => {
            bottomLine.innerText = targetAddress.split('').map((char, index) => {
                if (index < iteration) return targetAddress[index];
                if (char === ' ' || char === ',') return char;
                return characters[Math.floor(Math.random() * characters.length)];
            }).join('');

            if (iteration >= targetAddress.length) {
                clearInterval(scrambleClick);
                setTimeout(() => {
                    const origBottom = bottomLine.dataset.orig;
                    let revIteration = 0;
                    lines[0].innerText = lines[0].dataset.orig;
                    lines[1].innerText = lines[1].dataset.orig;
                    const revScramble = setInterval(() => {
                        bottomLine.innerText = origBottom.split('').map((char, index) => {
                            if (index < revIteration) return origBottom[index];
                            if (char === ' ' || char === '.') return char;
                            return characters[Math.floor(Math.random() * characters.length)];
                        }).join('');

                        if (revIteration >= origBottom.length) {
                            clearInterval(revScramble);
                            isClicked = false;
                        }
                        revIteration += 1 / 3;
                    }, 30);
                    lines[0].style.opacity = '1';
                    lines[1].style.opacity = '1';
                }, 7500);
            }
            iteration += 1 / 3;
        }, 30);
    });

    const photoSources = [
        "assets/images/barber/photo1.jpg",
        "assets/images/barber/photo2.jpg",
        "assets/images/barber/photo3.jpg",
        "assets/images/barber/photo4.jpg",
        "assets/images/barber/photo5.jpg",
        "assets/images/barber/photo6.jpg",
        "assets/images/barber/photo7.jpg",
        "assets/images/barber/photo8.jpg",
        "assets/images/barber/photo9.jpg",
        "assets/images/barber/photo10.jpg",
        "assets/images/barber/photo11.jpg",
        "assets/images/barber/photo12.jpg"
    ];
    const stack = document.getElementById('photoStack');
    let currentPhotos = [];
    let nextIndex = 5;

    for (let i = 0; i < 5; i++) addPhoto(i, true);

    function addPhoto(index, isInit) {
        const img = document.createElement('img');
        img.src = photoSources[index % photoSources.length];
        img.className = 'stack-photo';
        const rot = (Math.random() * 14 - 7).toFixed(1);
        if (isInit) {
            img.style.transform = `translateZ(0) scale(1) rotate(${rot}deg)`;
            img.style.zIndex = index + 1;
            stack.appendChild(img);
            currentPhotos.push(img);
        } else {
            img.style.transform = `translateZ(200px) scale(1.1) rotate(${rot}deg)`;
            img.style.opacity = '0';
            const highestZ = parseInt(currentPhotos[currentPhotos.length - 1].style.zIndex);
            img.style.zIndex = highestZ + 1;
            stack.appendChild(img);
            void img.offsetWidth;
            img.style.transform = `translateZ(0) scale(1) rotate(${rot}deg)`;
            img.style.opacity = '1';
            currentPhotos.push(img);
            const oldest = currentPhotos.shift();
            oldest.style.opacity = '0';
            setTimeout(() => oldest.remove(), 800);
        }
    }
    setInterval(() => addPhoto(nextIndex++, false), 2500);

    const bookingSteps = document.querySelectorAll('.booking-step');
    const trackerProgress = document.querySelector('.tracker-progress');
    const trackerDots = document.querySelectorAll('.tracker-step');

    function goToStep(stepNumber) {
        bookingSteps.forEach(step => step.classList.remove('active-step'));
        document.getElementById(`step${stepNumber}`).classList.add('active-step');
        trackerProgress.style.height = stepNumber === 1 ? '0%' : stepNumber === 2 ? '50%' : '100%';
        trackerDots.forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === stepNumber);
            dot.classList.toggle('completed', index + 1 < stepNumber);
        });
    }

    document.querySelectorAll('.select-service-btn').forEach(btn => {
        btn.addEventListener('click', (e) => goToStep(parseInt(e.target.dataset.target)));
    });

    trackerDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToStep(index + 1));
    });

    // Add-ons toggle logic
    const addonBtns = document.querySelectorAll('.toggle-addon-btn');
    addonBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target;
            button.classList.toggle('selected');
            button.innerText = button.classList.contains('selected') ? 'Added' : 'Add';
        });
    });
});