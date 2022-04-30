let accounts = 0;

async function loadChallenge() {
	let fieldData = await (await fetch('/api/field_data')).text();
	new FunCaptcha({
		public_key: 'A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F',
		target_html: 'CAPTCHA',
		callback: async captchaToken => {
			const res = await fetch('/api/accounts/create', {
				method: 'POST',
				body: JSON.stringify({
					captcha: captchaToken,
					captchaId: fieldData.split(',')[0]
				})
			});

			if (!res.ok) {
				const json = await res.json();
				if (!json['success']) {
					alert(json['error']);
				} else {
					alert('Unexpected error');
				}
			}

			window.parent.postMessage('done');
		},
		onshown: () => {
			window.parent.postMessage('load');
		},
		data: {
			blob: fieldData.split(',')[1]
		}
	});
}
