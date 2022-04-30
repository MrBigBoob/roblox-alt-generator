const loadingElem = document.getElementById('loading');
const captchaFrame = document.getElementById('captcha-frame');
const accountsText = document.getElementById('accountstxt');
let accounts = 0;

function fadeOutLoading() {
	let opacity = 100;
	let interval = setInterval(() => {
		if (opacity <= 0) {
			loadingElem.style.display = 'none';
			clearInterval(interval);
			return;
		}
		opacity--;
		loadingElem.style.opacity = opacity + '%';
	}, 5);
}

function fadeInLoading() {
	let opacity = 0;
	let interval = setInterval(() => {
		if (opacity >= 100) {
			loadingElem.style.display = 'flex';
			clearInterval(interval);
			return;
		}
		opacity++;
		loadingElem.style.opacity = opacity + '%';
	}, 5);
}

window.addEventListener('message', ({ data }) => {
	if (data === 'done') {
		captchaFrame.contentWindow.location.reload();
		accountsText.textContent = 'Accounts: ' + ++accounts;
		document.getElementById('loading').style.display = 'flex';
		fadeInLoading();
	} else if (data === 'load') {
		fadeOutLoading();
	}
});
