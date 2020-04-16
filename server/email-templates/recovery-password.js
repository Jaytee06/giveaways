module.exports = (data = {}) =>
	`
			<h1>Link for password recovery:</h1>
			<a href="${data.url}?token=${data.recoveryToken}">Recovery password Link</a> (only valid for the next 3 hours)
			<p>You are receiving this because you requested to have your password reset on <a href="https://www.vintley.com">Vintley</a>.</p>
			<p>Please click the link above and follow the instructions on our website for how to reset your password.</p>
			<p>Thanks,<br>Vintley</p>
		`;
